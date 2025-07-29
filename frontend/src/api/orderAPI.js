import api from './axios';

// Finalize Order After Stripe Payment
export const postOrder = async (orderData) => {
  try {
    const res = await api.post('/api/orders/finalize', {
      buyerId: orderData.buyerId,
      items: orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
    return res.data;
  } catch (error) {
    console.error('Error posting order:', error);
    throw error;
  }
};

// Get Orders by Buyer ID
export const getBuyerOrders = async (buyerId) => {
  try {
    const res = await api.get(`/api/orders/buyer/${buyerId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    throw error;
  }
};

// Get Orders by Seller ID
export const getSellerOrders = async (sellerId) => {
  try {
    const res = await api.get(`/api/orders/seller/${sellerId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    throw error;
  }
};

// Verify Stripe payment and create order
export const verifyPaymentAndCreateOrder = async ({ sessionId, buyerId, productId, quantity }) => {
  try {
    const res = await api.post('/api/verify-payment-and-create-order', {
      sessionId,
      buyerId,
      productId,
      quantity,
    });
    return res.data;
  } catch (error) {
    console.error('Error verifying payment or creating order:', error);
    throw error;
  }
};
