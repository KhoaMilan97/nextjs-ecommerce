import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategory(req, res);
      break;
    case "DELETE":
      await deletegories(req, res);
      break;
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });
    const { id } = req.query;
    const { name } = req.body;

    const category = await Categories.findOneAndUpdate(
      { _id: id },
      { name },
      { new: true }
    );

    res.json({
      msg: "Update category success!",
      category,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const deletegories = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });
    const { id } = req.query;

    await Categories.findOneAndDelete({ _id: id });

    res.json({
      msg: "Delete category success!",
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
