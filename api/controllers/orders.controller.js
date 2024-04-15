export const orders=(req, res) => {
    const { appointmentFees } = req.body;
    var instaance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    var options = {
      amount: appointmentFees * 100,
      currency: "INR",
    };
    instaance.orders.create(options, function (err, order) {
      console.log(err);
      if (err) {
        return res.send({ code: 500, message: "Server error" });
      }
      return res.send({ code: 200, message: "Oredr created", data: order });
    });
  }

