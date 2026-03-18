import Razorpay from 'razorpay';

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

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes
    };

    const order = await razorpay.orders.create(options);
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
