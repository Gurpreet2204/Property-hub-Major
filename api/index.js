import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Mongoose Schemas
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  // receipt: { type: String, required: true },
  status: { type: String, default: 'created' },
  createdAt: { type: Date, default: Date.now },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
});

const Order = mongoose.model('Order', orderSchema);

const verificationSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  signature: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Verification = mongoose.model('Verification', verificationSchema);

const Appointment = mongoose.model("Appointment", {
  name: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  propertyId: mongoose.Schema.Types.ObjectId,
});

// Routes
app.post("/api/orders", async (req, res) => {
  const { appointmentFees } = req.body;

  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  var options = {
    amount: appointmentFees * 100,
    currency: "INR",
  };

  try {
    const order = await new Promise((resolve, reject) => {
      instance.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    const newOrder = new Order({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      // receipt: order.receipt,
    });

    await newOrder.save();

    res.send({ code: 200, message: "Order created", data: order });
  } catch (err) {
    console.log(err);
    res.send({ code: 500, message: "Server error" });
  }
});

app.post("/api/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  var expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const newVerification = new Verification({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'valid',
    });

    await newVerification.save();

    res.send({ code: 200, message: "Sign valid" });
  } else {
    const newVerification = new Verification({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'invalid',
    });

    await newVerification.save();

    res.send({ code: 500, message: "Sign invalid" });
  }
});

app.post("/api/checkAvailability", async (req, res) => {
  const { name, email, phone, selectedDate, selectedTime, propertyId } = req.body;

  try {
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      date: new Date(selectedDate),
      time: selectedTime,
      propertyId,
    });

    await newAppointment.save();

    const overlappingAppointments = await Appointment.find({
      _id: { $ne: newAppointment._id },
      propertyId,
      date: newAppointment.date,
      time: selectedTime,
    });

    if (overlappingAppointments.length > 0) {
      await Appointment.findByIdAndRemove(newAppointment._id);
      return res.status(409).json({
        message: "Time slot not available. Please choose another time.",
      });
    }

    return res.status(200).json({ message: "Time slot is available." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});