export const onRequestPost: PagesFunction<{
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  FIREBASE_PROJECT_ID: string;
}> = async (context) => {
  const { request, env } = context;
  
  try {
    const { items, currency = "INR", receipt, notes } = await request.json() as any;
    
    // 1. Calculate total amount server-side by fetching prices from Firestore
    let subtotal = 0;
    
    // We'll use the Firestore REST API (public read access for products/pets is assumed based on rules)
    for (const item of items) {
      const collection = item.type === 'pet' ? 'pets' : 'products';
      const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${item.id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch item ${item.id}`);
      const data = await res.json() as any;
      const price = data.fields.price.doubleValue || data.fields.price.integerValue;
      subtotal += Number(price) * item.quantity;
    }

    // Fetch shop settings for delivery fee
    const settingsUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/settings/shop`;
    const settingsRes = await fetch(settingsUrl);
    let deliveryFee = 100; // Default
    let threshold = 1000; // Default
    
    if (settingsRes.ok) {
      const settingsData = await settingsRes.json() as any;
      deliveryFee = Number(settingsData.fields.fixedDeliveryFee.integerValue || settingsData.fields.fixedDeliveryFee.doubleValue);
      threshold = Number(settingsData.fields.deliveryFeeThreshold.integerValue || settingsData.fields.deliveryFeeThreshold.doubleValue);
    }

    const finalDeliveryFee = subtotal >= threshold ? 0 : deliveryFee;
    const finalTotal = subtotal + finalDeliveryFee;

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
          calculatedTotal: finalTotal,
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
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create payment order" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
