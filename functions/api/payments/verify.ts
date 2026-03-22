async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const text = orderId + "|" + paymentId;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === signature;
}

export const onRequestPost: PagesFunction<{
  RAZORPAY_KEY_SECRET: string;
  FIREBASE_SERVICE_ACCOUNT: string;
  FIREBASE_PROJECT_ID: string;
}> = async (context) => {
  const { request, env } = context;
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, deliveryInfo, items, userId, amount } = await request.json() as any;
    
    const isValid = await verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, env.RAZORPAY_KEY_SECRET);

    if (!isValid) {
      return new Response(JSON.stringify({ status: "failure", message: "Invalid payment signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Payment verified, now save order to Firestore securely
    // We'll use the Firestore REST API with a Service Account
    
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
    const accessToken = await getGoogleAccessToken(serviceAccount);

    const orderData = {
      fields: {
        userId: { stringValue: userId || 'anonymous' },
        items: {
          arrayValue: {
            values: items.map((item: any) => ({
              mapValue: {
                fields: {
                  id: { stringValue: item.id },
                  name: { stringValue: item.name },
                  price: { doubleValue: item.price },
                  quantity: { integerValue: item.quantity },
                  type: { stringValue: item.type }
                }
              }
            }))
          }
        },
        amount: { doubleValue: amount },
        deliveryInfo: {
          mapValue: {
            fields: {
              name: { stringValue: deliveryInfo.name },
              email: { stringValue: deliveryInfo.email },
              phone: { stringValue: deliveryInfo.phone },
              address: { stringValue: deliveryInfo.address },
              city: { stringValue: deliveryInfo.city },
              pincode: { stringValue: deliveryInfo.pincode }
            }
          }
        },
        razorpay_order_id: { stringValue: razorpay_order_id },
        razorpay_payment_id: { stringValue: razorpay_payment_id },
        status: { stringValue: 'paid' },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    };

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/orders`;
    
    const firestoreRes = await fetch(firestoreUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!firestoreRes.ok) {
        const error = await firestoreRes.json();
        throw new Error(`Firestore Error: ${JSON.stringify(error)}`);
    }

    const orderRef = await firestoreRes.json() as any;
    const orderId = orderRef.name.split('/').pop();

    return new Response(JSON.stringify({ 
      status: 'success', 
      message: 'Payment verified and order saved successfully',
      orderId: orderId 
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Razorpay Verification/Save Error:", error);
    return new Response(JSON.stringify({ error: "Payment verification failed" }), {
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
