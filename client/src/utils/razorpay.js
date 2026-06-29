import axios from 'axios';
import { toast } from 'react-hot-toast';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handleRazorpayCheckout = async (planTier, amount, onSuccess) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    toast.error('Failed to load payment gateway. Please check your connection.');
    return;
  }

  try {
    // 1. Fetch public key
    const { data: configData } = await axios.get('/api/payments/config');
    const keyId = configData.keyId;

    if (!keyId) {
      toast.error('Payment gateway not configured on server.');
      return;
    }

    // 2. Create order on our backend
    const { data: orderData } = await axios.post('/api/payments/create-order', {
      amount,
      currency: 'USD'
    });

    if (!orderData.success) {
      toast.error('Failed to initiate payment.');
      return;
    }

    // 3. Open Razorpay Checkout modal
    const options = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'MinuteCraft AI',
      description: `Upgrade to ${planTier.toUpperCase()} Plan`,
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // 3. Send signature to backend for verification
          const { data: verifyData } = await axios.post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount,
            planTier
          });

          if (verifyData.success) {
            toast.success(`Welcome to ${planTier.toUpperCase()}! Your account has been upgraded.`);
            if (onSuccess) onSuccess(verifyData.plan);
          } else {
            toast.error('Payment verification failed.');
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Payment verification failed.');
        }
      },
      prefill: {
        name: 'User',
        email: 'user@example.com'
      },
      theme: {
        color: '#6366f1' // Brand primary color
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      toast.error('Payment failed: ' + response.error.description);
    });
    
    rzp.open();

  } catch (error) {
    console.error('Checkout error:', error);
    toast.error('An error occurred while initiating checkout.');
  }
};
