const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  amount: {
    type: String,
  },
  order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
    default: null,
  },
  razorpay_order_id: {
    type: String,
    default: null,
  },
  razorpay_signature: {
    type: String,
    default: null,
  },
});

const Ordermodel= mongoose.model("order",schema)
module.exports={
    Ordermodel
}