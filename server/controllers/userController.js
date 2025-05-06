const User = require("../models/User");
const {users} = require("../state/sharedState");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const userId = req.user?.id || req.user?._id || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `user-${userId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const userId = req.user.id || req.user._id;
      console.log("Updating avatar for user ID:", userId);
      
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      console.log("New avatar URL:", avatarUrl);
      
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { avatar: avatarUrl },
        { new: true } 
      );
      
      if (!updatedUser) {
        console.error("Failed to update user with avatar URL, user not found");
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log("Updated user:", updatedUser.firstName, "with avatar:", updatedUser.avatar);
      
      res.status(200).json({
        message: "Avatar uploaded successfully",
        avatarUrl: avatarUrl,
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          avatar: updatedUser.avatar
        }
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({ message: "Failed to upload avatar", error: error.message });
    }
  }
];

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

    res.json({ firstName: user.firstName, lastName: user.lastName,id:user._id ,avatar:user.avatar});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.declineFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.id;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.friendRequests.includes(friendId)) {
            return res.status(400).json({ message: "No friend request found" });
        }

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== friendId
        );
        await user.save();

        res.json({ message: "Friend request declined!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
        }).select('firstName lastName avatar _id')
        
        return res.status(200).json(users);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ message: "Server error while searching users" });
    }
};
