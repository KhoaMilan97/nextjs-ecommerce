import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await updateRole(req, res);
      break;
    case "DELETE":
      await deleteUser(req, res);
      break;
  }
};

const updateRole = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { role } = req.body;
    const { id } = req.query;

    if (result.role !== "admin" || !result.root) {
      return res.status(400).json({ err: "Authenticate is not valid" });
    }

    await Users.findOneAndUpdate({ _id: id }, { role }, { new: true });

    res.json({ msg: "Update Role Success!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { id } = req.query;

    if (result.role !== "admin" || !result.root) {
      return res.status(400).json({ err: "Authenticate is not valid" });
    }

    await Users.findOneAndDelete({ _id: id });

    res.json({ msg: "Delete User Success!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
