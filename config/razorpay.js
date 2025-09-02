const Razorpay = require('razorpay');



const razorpay = new Razorpay({
  key_id: 'rzp_test_RBqOz0XAEVh2fS',
  key_secret: 'SupDb7GwSGgAn12prK0QhsFb'
});

const WEBHOOK_SECRET = 'pz3iQs67zHU9@qb';

module.exports = { razorpay, WEBHOOK_SECRET }; 