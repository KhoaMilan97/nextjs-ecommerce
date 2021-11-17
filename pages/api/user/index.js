import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await updateInfor(req, res);
      break;
    case "GET":
      await getUsers(req, res);
      break;
  }
};

const updateInfor = async (req, res) => {
  try {
    const { avatar, name } = req.body;
    const result = await auth(req, res);

    const newUser = await Users.findOneAndUpdate(
      { _id: result.id },
      { avatar, name },
      { new: true }
    ).select("-password");

    res.json({ msg: "Update Profile Success!", user: newUser });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid" });

    const users = await Users.find().select("-password");

    res.json({ users });
  } catch (error) {
    return res.status(500).json({ err: err.message });
  }
};
