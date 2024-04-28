import  { useState, useEffect } from 'react';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch(`/api/orders/`)
      .then(response => {
        console.log('Orders:', response.data);
        setOrders(response.data);
      })
      .catch(error => console.error('Error fetching orders:', error));

   fetch(`/api/checkAvailability/`)
      .then(response => {
        console.log('Transactions:', response.data);
        setAppointments(response.data);
      })
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <ul>
        {orders && orders.map(order => (
          <li key={order._id} className="mb-4 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Order Id: {order.orderId}</p>
                <p className="text-gray-500">Amount: {order.amount}</p>
                <p className="text-gray-500">Status: {order.status}</p>
                <p className="text-gray-500">Created at: {order.createdAt}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mb-4 mt-8">Appointments</h2>
      <ul>
        {appointments && appointments.map(appointment => (
          <li key={appointment._id} className="mb-4 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Appointment Id: {appointment._id}</p>
                <p className="text-gray-500">Appointment Date: {appointment.date}</p>
                <p className="text-gray-500">Duration: {appointment.duration}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
