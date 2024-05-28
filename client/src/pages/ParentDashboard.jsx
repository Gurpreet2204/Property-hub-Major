import Dashboard from './Dashboard';

const ParentComponent = () => {
  const ordersData = [
    {
      _id: { $oid: '661bc5652fa49ca5d051ea05' },
      orderId: 'order_NyUjdpK2eguMQf',
      amount: 50000,
      currency: 'INR',
      status: 'created',
      createdAt: { $date: '2024-04-14T12:00:37.560Z' },
      __v: 0,
    },
    // Add more orders if needed
  ];
  
  const appointmentsData = [
    {
      date: { $date: '2024-03-13T07:30:00.000Z' },
      duration: 60,
      __v: 0,
    },
    // Add more appointments if needed
  ];

    return (
        <Dashboard appointmentsData={appointmentsData} ordersData={ordersData} />
    );
};

export default ParentComponent;
