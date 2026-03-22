export const onRequestPost: PagesFunction<{
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
}> = async (context) => {
  const { request, env } = context;
  
  try {
    const { amount, currency = "INR", receipt, notes } = await request.json() as any;
    
    const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt,
        notes,
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
