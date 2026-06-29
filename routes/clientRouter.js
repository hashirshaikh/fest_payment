const express = require("express");
const clientRouter = express.Router();

const clientController = require("../controllers/clientController");

clientRouter.get('/',clientController.homePage);
clientRouter.post('/BOOKING',clientController.bookTicket)
clientRouter.get('/BOOKING',clientController.bookTicket)
clientRouter.get('/success/:order_id',clientController.paydone)
clientRouter.get('/download/:order_id',clientController.download)
clientRouter.post('/payment',clientController.createOrder)
clientRouter.post('/razorpay-webhook', express.json({ type: '*/*' }),clientController.webhookHandler)

// ─── JSON API routes for React frontend ───────────────────────────────────────
clientRouter.get('/api/booking', clientController.getBookingData);
clientRouter.post('/api/payment', clientController.createOrderApi);
clientRouter.get('/api/success/:order_id', clientController.getSuccessData);

module.exports = clientRouter;