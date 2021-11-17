import bcrypt from "bcrypt";

import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await resetPassword(req, res);
      break;
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const result = await auth(req, res);
    const hashPassword = await bcrypt.hash(password, 12);

    await Users.findOneAndUpdate(
      { _id: result.id },
      { password: hashPassword }
    );

    res.json({ msg: "Update Password Success!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
