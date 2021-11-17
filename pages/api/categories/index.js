import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createCategory(req, res);
      break;
    case "GET":
      await getCategories(req, res);
      break;
  }
};

const createCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { name } = req.body;
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication not valid" });
    if (!name)
      return res.status(400).json({ err: "Name can't be left blank." });

    const newCategory = new Categories({ name });

    await newCategory.save();

    res.json({
      msg: "Created Category Success!",
      newCategory,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Categories.find();

    res.json({ categories });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
