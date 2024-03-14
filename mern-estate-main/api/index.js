import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const Appointment = mongoose.model('Appointment', {
  name: String,
  email: String,
  phone: String,
  date: Date,
  duration: Number,
});

const app = express();

app.use(express.json());

app.post('/api/checkAvailability', async (req, res) => {
  const { name, email, phone, selectedDate, duration } = req.body;

  try {
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      date: selectedDate,
      duration,
    });
    await newAppointment.save();

    const startTime = new Date(selectedDate);
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const overlappingAppointments = await Appointment.find({
      _id: { $ne: newAppointment._id }, 
      date: { $lt: endTime },
      $or: [
        { date: { $gte: startTime, $lt: endTime } },
        { date: { $lt: startTime }, endDate: { $gt: startTime } },
      ],
    });

    if (overlappingAppointments.length > 0) {
      await Appointment.findByIdAndRemove(newAppointment._id);
      return res.status(409).json({ message: 'Time slot not available. Please choose another time.' });
    }

    return res.status(200).json({ message: 'Time slot is available.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.use(cookieParser());

app.listen(3001, () => {
  console.log('Server is running on port 3001!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist/assets')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist','assets', 'index.html'));
});

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
