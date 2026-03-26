export const onRequestPost: PagesFunction<{
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_SERVICE_ACCOUNT: string;
}> = async (context) => {
  const { request, env } = context;
  
  try {
    // Validate environment variables
    const requiredEnv = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "FIREBASE_PROJECT_ID", "FIREBASE_SERVICE_ACCOUNT"];
    const missingEnv = requiredEnv.filter(key => !env[key as keyof typeof env]);
    if (missingEnv.length > 0) {
      return new Response(JSON.stringify({ 
        error: "Server configuration error", 
        details: `Missing environment variables: ${missingEnv.join(", ")}` 
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const { items, currency = "INR", receipt, notes, couponCode } = await request.json() as any;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
    }

    let accessToken: string | null = null;
    if (couponCode && env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
        accessToken = await getGoogleAccessToken(serviceAccount);
      } catch (e) {
        console.error("Failed to get access token:", e);
      }
    }

    // 1. Calculate total amount server-side by fetching prices from Firestore
    let subtotal = 0;
    let totalDiscount = 0;
    let appliedCouponData: any = null;

    // Fetch universal coupon if provided and we have an access token
    if (couponCode && accessToken) {
      const couponQueryUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;
      const couponQueryBody = {
        structuredQuery: {
          from: [{ collectionId: "coupons" }],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                {
                  fieldFilter: {
                    field: { fieldPath: "code" },
                    op: "EQUAL",
                    value: { stringValue: couponCode.toUpperCase() }
                  }
                },
                {
                  fieldFilter: {
                    field: { fieldPath: "isActive" },
                    op: "EQUAL",
                    value: { booleanValue: true }
                  }
                }
              ]
            }
          },
          limit: 1
        }
      };

      const couponRes = await fetch(couponQueryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(couponQueryBody),
      });

      if (couponRes.ok) {
        const couponResults = await couponRes.json() as any[];
        if (couponResults.length > 0 && couponResults[0].document) {
          const doc = couponResults[0].document;
          const fields = doc.fields;
          
          // Basic validation
          const expiryDate = fields.expiryDate?.stringValue;
          const maxUsage = fields.maxUsage?.integerValue ? Number(fields.maxUsage.integerValue) : null;
          const usageCount = fields.usageCount?.integerValue ? Number(fields.usageCount.integerValue) : 0;

          const isExpired = expiryDate && new Date(expiryDate) < new Date();
          const isLimitReached = maxUsage !== null && usageCount >= maxUsage;

          if (!isExpired && !isLimitReached) {
            appliedCouponData = {
              id: doc.name.split('/').pop(),
              code: fields.code.stringValue,
              type: fields.type.stringValue,
              value: Number(fields.value.doubleValue || fields.value.integerValue),
              minOrderValue: fields.minOrderValue ? Number(fields.minOrderValue.doubleValue || fields.minOrderValue.integerValue) : 0
            };
          }
        }
      }
    }
    
    // We'll use the Firestore REST API
    for (const item of items) {
      const collection = item.type === 'pet' ? 'pets' : 'products';
      const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${item.id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch item ${item.id}`);
      const data = await res.json() as any;
      if (!data.fields) throw new Error(`Invalid data for item ${item.id}`);
      
      const fields = data.fields;
      const price = Number(fields.price?.doubleValue || fields.price?.integerValue || 0);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      // Product-specific coupon logic (only if no universal coupon is applied)
      if (!appliedCouponData && couponCode && fields.productCoupons?.arrayValue?.values) {
        const coupons = fields.productCoupons.arrayValue.values;
        const applicableCoupon = coupons.find((c: any) => 
          c.mapValue?.fields?.code?.stringValue?.toUpperCase() === couponCode.toUpperCase()
        );

        if (applicableCoupon) {
          const discValue = Number(
            applicableCoupon.mapValue.fields.discount.doubleValue || 
            applicableCoupon.mapValue.fields.discount.integerValue || 0
          );
          const discType = applicableCoupon.mapValue.fields.type.stringValue || 'percentage';

          if (discType === 'percentage') {
            totalDiscount += (itemTotal * discValue) / 100;
          } else {
            totalDiscount += discValue * item.quantity;
          }
        }
      }
    }

    // Apply universal coupon discount
    if (appliedCouponData) {
      if (subtotal >= appliedCouponData.minOrderValue) {
        if (appliedCouponData.type === 'percentage') {
          totalDiscount = (subtotal * appliedCouponData.value) / 100;
        } else {
          totalDiscount = appliedCouponData.value;
        }
      }
    }

    // Fetch shop settings for delivery fee
    const settingsUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/settings/shop`;
    const settingsRes = await fetch(settingsUrl);
    let deliveryFee = 100; // Default
    let threshold = 1000; // Default
    
    if (settingsRes.ok) {
      const settingsData = await settingsRes.json() as any;
      if (settingsData.fields) {
        if (settingsData.fields.fixedDeliveryFee) {
          deliveryFee = Number(settingsData.fields.fixedDeliveryFee.integerValue || settingsData.fields.fixedDeliveryFee.doubleValue || 100);
        }
        if (settingsData.fields.deliveryFeeThreshold) {
          threshold = Number(settingsData.fields.deliveryFeeThreshold.integerValue || settingsData.fields.deliveryFeeThreshold.doubleValue || 1000);
        }
      }
    }

    const finalDeliveryFee = subtotal >= threshold ? 0 : deliveryFee;
    const finalTotal = Math.max(0, subtotal - totalDiscount + finalDeliveryFee);

    const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(finalTotal * 100),
        currency,
        receipt,
        notes: {
          ...notes,
          subtotal,
          discountAmount: totalDiscount,
          couponCode: couponCode || '',
          finalTotal,
          items: JSON.stringify(items)
        },
      }),
    });

    if (!response.ok) {
        const error = await response.json();
        return new Response(JSON.stringify(error), { status: response.status });
    }

    const order = await response.json();
    return new Response(JSON.stringify(order), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to create payment order",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Helper to get Google Access Token from Service Account
async function getGoogleAccessToken(serviceAccount: any) {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/datastore",
  };

  const encodedHeader = b64(JSON.stringify(header));
  const encodedPayload = b64(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const privateKey = serviceAccount.private_key.replace(/\\n/g, "\n");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    str2ab(privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const encodedSignature = b64(signature);

  const jwt = `${unsignedToken}.${encodedSignature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json() as any;
  return data.access_token;
}

function b64(input: string | ArrayBuffer) {
  let binary = "";
  if (typeof input === "string") {
    binary = btoa(input);
  } else {
    const bytes = new Uint8Array(input);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    binary = btoa(binary);
  }
  return binary.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function str2ab(str: string) {
  const binaryString = atob(str.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, ""));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
