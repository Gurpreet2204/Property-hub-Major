import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AppointmentForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const checkAvailability = async () => {
    try {
      const response = await fetch('/api/checkAvailability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedDate,
          duration: 60,
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        alert(data || 'Error checking availability. Please try again.');
        return false;
      }

      const data = await response.json();

      if (data) {
        return true;
      } else {
        alert('Error checking availability. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDateTime = new Date(selectedDate);
    const isAvailable = await checkAvailability();

    if (!isAvailable) {
      return;
    }

    console.log('Appointment details submitted:', {
      name,
      email,
      phone,
      selectedDate,
    });

    setAppointments([...appointments, { date: selectedDateTime, duration: 60 }]);

    setName('');
    setEmail('');
    setPhone('');
    setSelectedDate(null);
    setSubmitted(true);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none"
      >
        {showForm ? 'Close Form' : 'Book Your Appointment'}
      </button>
      {showForm && (
        <div className="max-w-md bg-white rounded-md shadow-md p-6">
          
          <h2 className="text-3xl text-red-900 font-semibold mb-4">Book Your Appointment</h2>
          {submitted ? (
            <p className="text-green-600">Appointment request submitted successfully!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Name:</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Email:</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Phone:</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Preferred Date and Time:</span> <br />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                  required
                />
              </label>
              <center>
                <button
                  type="submit"
                  className="bg-green-700 text-white py-2 px-4 rounded-md hover:opacity-95 focus:outline-none"
                >
                  Submit Appointment Request
                </button>

              </center>  

            </form>

          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;