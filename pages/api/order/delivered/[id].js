import connectDB from "../../../../utils/connectDB";
import Orders from "../../../../models/orderModel";
import auth from "../../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await deliveredOrder(req, res);
      break;
  }
};

const deliveredOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { id } = req.query;
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication not valid." });

    const order = await Orders.findOne({ _id: id });
    if (order.paid) {
      const newOrder = await Orders.findOneAndUpdate(
        { _id: id },
        { delivered: true },
        { new: true }
      );
      res.json({ msg: "Update Success!", newOrder });
    } else {
      const newOrder = await Orders.findOneAndUpdate(
        { _id: id },
        {
          delivered: true,
          paid: true,
          dateOfPayment: new Date().toISOString(),
          method: "Receive Cash",
        },
        { new: true }
      );
      res.json({ msg: "Update Success!", newOrder });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
