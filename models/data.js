const mongoose = require('mongoose');
const dataSchema =  mongoose.Schema({
payment_id: {type: String},
status: {type: String, default: 'pending'},
razorpay_order_id: {type: String, required: true},
amount: {type: Number, required: true},
Numoftickets: {type: Number, required: true},
Name: {type: Array, required: true},
RollNo: {type: Array, required: true},
Email: {type: String, required: true},
Date: {type: String, required:true}
});

module.exports = mongoose.model('Data', dataSchema);