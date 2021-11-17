import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProducts(req, res);
      break;
    case "POST":
      await createProduct(req, res);
      break;
  }
};

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.category !== "all") {
      this.query.find({ category: queryObj.category });
    }

    if (queryObj.title !== "all") {
      this.query.find({ title: queryObj.title });
    }

    this.query.find();
    return;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const getProducts = async (req, res) => {
  try {
    const features = new ApiFeatures(Products.find({}), req.query)
      .filtering()
      .sorting()
      .paginating();
    const products = await features.query;

    res.status(201).json({
      products,
      result: products.length,
      message: "Success!",
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createProduct = async (req, res) => {
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

    const newProduct = await new Products({
      title,
      price,
      inStock,
      description,
      content,
      category,
      images,
    }).save();

    res.status(200).json({
      msg: "Success. Created new prodcut",
      newProduct,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
