import PropTypes from 'prop-types';

const Dashboard = ({ orders, appointments }) => {
  return (
  <>
    <div className="bg-white flex shadow-md rounded-md p-6">
      

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        <ul>
          {orders &&
            orders.map((order) => (
              <li key={order._id.$oid} className="mb-4">
                <div className="border border-gray-200 p-4 rounded-md">
                  <p className="text-gray-600">Order ID: {order.orderId}</p>
                  <p className="text-gray-600">Amount: {order.amount/100}</p>
                  <p className="text-gray-600">Currency: {order.currency}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Created At: {new Date(order.createdAt.$date).toLocaleString()}</p>
                </div>
              </li>
            ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Appointments</h2>
        <ul>
          {appointments &&
            appointments.map((appointment, index) => (
              <li key={index} className="mb-4">
                <div className="border border-gray-200 p-4 rounded-md">
                  <p className="text-gray-600">Date: {new Date(appointment.date.$date).toLocaleString()}</p>
                  <p className="text-gray-600">Name: {appointment.name}</p>
                  <p className="text-gray-600">Phone: {appointment.phone}</p>
                  <p className="text-gray-600">Duration: 60  minutes</p>
                  {/* <p className="text-gray-600">Date: {appointment.duration} minutes</p> */}
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
    </>
  );
};

Dashboard.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.shape({
        $oid: PropTypes.string.isRequired,
      }).isRequired,
      orderId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.shape({
        $date: PropTypes.string.isRequired,
      }).isRequired,
    })
  ),
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.shape({
        $date: PropTypes.string.isRequired,
      }).isRequired,
      duration: PropTypes.number.isRequired,
    })
  ),
};

export default Dashboard;
