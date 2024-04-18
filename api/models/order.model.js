import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  // Add other properties as needed
});

const order = mongoose.model('Order', orderSchema);

export default order