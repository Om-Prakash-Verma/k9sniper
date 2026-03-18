export const onRequestPost: any = async (context: any) => {
  try {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = context.env;
    
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return new Response(JSON.stringify({ error: 'Razorpay credentials missing in environment' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body: any = await context.request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    // Razorpay API endpoint for order creation
    const url = 'https://api.razorpay.com/v1/orders';
    
    // Basic Auth header
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency,
        receipt,
        notes
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.description || 'Failed to create order via Razorpay API');
    }

    const order = await response.json();
    return new Response(JSON.stringify(order), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
