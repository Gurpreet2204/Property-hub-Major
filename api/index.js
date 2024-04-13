import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import listing from "./models/listing.model.js";
import Razorpay from "razorpay";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
dotenv.config();

app.use(express.json());

app.post("/orders", (req, res) => {
  const { appointmentFees } = req.body;
  var instaance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  var options = {
    amount: 10,
    currency: "INR",

  };
  instaance.orders.create(options, function (err, order) {
    console.log(err)
    if (err) {
      return res.send({ code: 500, message: "Server error" });
    }
    return res.send({ code: 200, message: "Oredr created", data: order });
  });
});
app.post("verify", (req, res) => {
  res.send(verify);
});

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

app.use(cookieParser());
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
