// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import cors from "cors";
// import path from "path";
// import userRouter from "./routes/user.route.js";
// import authRouter from "./routes/auth.route.js";
// import listingRouter from "./routes/listing.route.js";
// import cookieParser from "cookie-parser";

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors());
// mongoose
//   .connect(process.env.MONGO)
//     .then(() => {
//     console.log("Connected to MongoDB!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// // Mongoose Schemas
// const orderSchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true },
//   // receipt: { type: String, required: true },
//   status: { type: String, default: "created" },
//   createdAt: { type: Date, default: Date.now },
//   appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
// });

// const Order = mongoose.model("Order", orderSchema);

// const verificationSchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
//   paymentId: { type: String, required: true },
//   signature: { type: String, required: true },
//   status: { type: String, default: "pending" },
//   createdAt: { type: Date, default: Date.now },
// });

// const Verification = mongoose.model("Verification", verificationSchema);

// const Appointment = mongoose.model("Appointment", {
//   name: String,
//   email: String,
//   phone: String,
//   date: Date,
//   time: String,
//   propertyId: mongoose.Schema.Types.ObjectId,
// });

// // Routes
// app.post("/api/orders", async (req, res) => {
//   const { appointmentFees } = req.body;

//   var instance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET,
//   });
//   var options = {
//     amount: appointmentFees * 100,
//     currency: "INR",
//   };

//   try {
//     const order = await new Promise((resolve, reject) => {
//       instance.orders.create(options, (err, order) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(order);
//         }
//       });
//     });

//     const newOrder = new Order({
//       orderId: order.id,
//       amount: options.amount,
//       currency: options.currency,
//       // receipt: order.receipt,
//     });

//     await newOrder.save();

//     res.send({ code: 200, message: "Order created", data: order });
//   } catch (err) {
//     console.log(err);
//     res.send({ code: 500, message: "Server error" });
//   }
// });

// app.post("/api/verify", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body.response;

//   let body = razorpay_order_id + "|" + razorpay_payment_id;
//   var expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   if (expectedSignature === razorpay_signature) {
//     const newVerification = new Verification({
//       orderId: razorpay_order_id,
//       paymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//       status: "valid",
//     });

//     await newVerification.save();

//     res.send({ code: 200, message: "Sign valid" });
//   } else {
//     const newVerification = new Verification({
//       orderId: razorpay_order_id,
//       paymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//       status: "invalid",
//     });

//     await newVerification.save();

//     res.send({ code: 500, message: "Sign invalid" });
//   }
// });

// app.post("/api/checkAvailability", async (req, res) => {
//   const { name, email, phone, selectedDate, selectedTime, propertyId } =
//     req.body;

//   try {
//     const newAppointment = new Appointment({
//       name,
//       email,
//       phone,
//       date: new Date(selectedDate),
//       time: selectedTime,
//       propertyId,
//     });

//     await newAppointment.save();

//     const overlappingAppointments = await Appointment.find({
//       _id: { $ne: newAppointment._id },
//       propertyId,
//       date: newAppointment.date,
//       time: selectedTime,
//     });

//     if (overlappingAppointments.length > 0) {
//       await Appointment.findByIdAndRemove(newAppointment._id);
//       return res.status(409).json({
//         message: "Time slot not available. Please choose another time.",
//       });
//     }

//     return res.status(200).json({ message: "Time slot is available." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

// app.use(cookieParser());
// app.listen(3000, () => {
//   console.log("Server is running on port 3000!");
// });

// app.use("/api/user", userRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/listing", listingRouter);
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// app.use(express.static(path.join(__dirname, "/client/dist")));
// app.get("*", (req, res) => {

//       res.sendFile(path.join(__dirname, 'client', 'dist','index.html' ))
// });
// app.use((err, req, res, next) => {
//   console.log(err);
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   return res.status(statusCode).json({ success: false, statusCode, message });
// });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";
import path from "path";
import { body, validationResult } from 'express-validator';
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import order from "./models/order.model.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const Appointment = mongoose.model("Appointment", {
  name: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  propertyId: mongoose.Schema.Types.ObjectId,
});



app.post("/api/checkAvailability", async (req, res) => {
  const { name, email, phone, selectedDate, selectedTime, propertyId } =
    req.body;
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

//ORDER ENDPOINT

app.post("/api/orders", async (req, res) => {
  try {
    // Create a new order instance
    const newOrder = new order({
      amount: req.body.amount,
      currency: "INR",
      // Add other properties as needed
    });

    // Save the order to MongoDB
    await newOrder.save();
    // Return success response
    return res.status(200).json({ code: 200, message: "Order created", data: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ code: 500, message: "Server error" });
  }
});

app.post(
  "/api/verify",
  body("response.razorpay_order_id").notEmpty(),
  body("response.razorpay_payment_id").notEmpty(),
  body("response.razorpay_signature").notEmpty(),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body.response;

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is valid, redirect to the home page
      return res.status(200).json({ code: 200, message: "Sign valid" });

    } else {
      return res.status(500).json({ code: 500, message: "Sign Invalid" });
    }
  }

);
app.use(cookieParser());
app.listen(3001, () => {
  console.log("Server is running on port 3001!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
