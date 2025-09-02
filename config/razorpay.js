const Razorpay = require('razorpay');
const RAZORPAY_ID = process.env.RAZORPAY_ID;
const RAZORPAY_KEY = process.env.RAZORPAY_KEY;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_ID,
  key_secret: RAZORPAY_KEY
});

const webhook_secret = WEBHOOK_SECRET;

module.exports = { razorpay, webhook_secret}; 