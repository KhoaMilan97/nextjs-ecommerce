import connectDB from "../../../utils/connectDB";
import Orders from "../../../models/orderModel";
import Products from "../../../models/productModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOrder(req, res);
      break;
    case "GET":
      await getOrders(req, res);
      break;
  }
};

const createOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { address, mobile, cart, total } = req.body;

    const newOrder = new Orders({
      user: result.id,
      address,
      mobile,
      cart,
      total,
    });

    cart.filter((item) => {
      return sold(item._id, item.quantity, item.inStock, item.sold);
    });

    await newOrder.save();

    const order = await Orders.populate(newOrder, { path: "user" });

    res.json({
      msg: "Order Success! We will contact you to confirm the order.",
      newOrder: order,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await auth(req, res);
    let orders;
    if (result.role !== "admin") {
      orders = await Orders.find({ user: result.id }).populate(
        "user",
        "-password"
      );
    } else {
      orders = await Orders.find({}).populate("user", "-password");
    }
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const sold = async (id, quantity, oldInstock, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      inStock: oldInstock - quantity,
      sold: oldSold + quantity,
    }
  );
};
