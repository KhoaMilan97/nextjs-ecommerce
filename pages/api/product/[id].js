import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "PUT":
      await updateProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Products.findById(id);

    if (!product)
      return res.status(401).json({ msg: "This product doesn't exist." });

    res.status(201).json({
      product,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(401).json({ msg: "Authentication is not valid." });

    const { title, price, inStock, description, content, category, images } =
      req.body;

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      !category ||
      images.length === 0
    )
      return res.status(401).json({ msg: "Please add all of fields" });

    const product = await Products.findOneAndUpdate(
      { _id: id },
      { title, price, inStock, description, content, category, images },
      { new: true }
    );

    res.status(200).json({
      msg: "Update success!",
      product,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(401).json({ msg: "Authentication is not valid." });

    await Products.findByIdAndDelete(id);
    res.json({ msg: "Deleted a product." });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
