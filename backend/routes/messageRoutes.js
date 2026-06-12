const express = require("express");
const Message = require("../models/Message");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/:receiverId", auth, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;