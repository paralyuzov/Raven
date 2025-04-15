const User = require("../models/User");
const {users} = require("../state/sharedState");

exports.sendFriendRequest = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Invalid sender or receiver ID" });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot send friend request to yourself" });
        }

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        if (receiver.friends.includes(senderId)) {
            return res.status(400).json({ message: "Users are already friends" });
        }

        if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        receiver.friendRequests.push(senderId);
        await receiver.save();

        const io = req.app.get('io');
        const receiverSocket = users[receiverId]; 

        if (receiverSocket) {
            io.to(receiverSocket).emit("friend_request_received", { 
                id: senderId,
                firstName: sender.firstName,
                lastName: sender.lastName
            });
        }

        res.status(200).json({ 
            message: "Friend request sent successfully!",
            request: {
                id: senderId,
                firstName: sender.firstName,
                lastName: sender.lastName
            }
        });
    } catch (error) {
        console.error("Send friend request error:", error);
        res.status(500).json({ message: "Server error while sending friend request", error: error.message });
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
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ firstName: user.firstName, lastName: user.lastName,id:user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchUser = async (req, res) => {
    try {
        const query = req.query.query?.trim();
        const currentUserId = req.user.id;
        
        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }
        
        const searchRegex = new RegExp(query, 'i');
        const users = await User.find({
            $and: [
                {
                    $or: [
                        { firstName: searchRegex },
                        { lastName: searchRegex }
                    ]
                },
                { _id: { $ne: currentUserId } }
            ]
        }).select('firstName lastName _id');
        
        return res.status(200).json(users);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ message: "Server error while searching users" });
    }
};
