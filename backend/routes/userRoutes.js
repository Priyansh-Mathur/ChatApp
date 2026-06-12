const express = require("express");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id }
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;