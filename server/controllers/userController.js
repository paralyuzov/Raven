const User = require("../models/User");

exports.sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "User not found" });
    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.json({ message: "Friend request sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User not found" });

    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ message: "No friend request found" });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendId
    );
    await user.save();
    await friend.save();

    res.json({ message: "Friend request accepted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User not found" });

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: "Friend removed!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId)
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ firstName: user.firstName, lastName: user.lastName,id:user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
