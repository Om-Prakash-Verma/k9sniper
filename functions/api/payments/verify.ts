import Razorpay from 'razorpay';

export const onRequestPost: any = async (context: any) => {
  try {
    const { RAZORPAY_KEY_SECRET } = context.env;
    
    if (!RAZORPAY_KEY_SECRET) {
      return new Response(JSON.stringify({ error: 'Razorpay secret missing in environment' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body: any = await context.request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    
    // Use Web Crypto API for verification in Cloudflare Workers
    const encoder = new TextEncoder();
    const keyData = encoder.encode(RAZORPAY_KEY_SECRET);
    const signData = encoder.encode(sign);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      signData
    );

    const expectedSign = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (razorpay_signature === expectedSign) {
      return new Response(JSON.stringify({ status: 'success', message: 'Payment verified successfully' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ status: 'failure', message: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Verification failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
