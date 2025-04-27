const express = require("express");
const { sendFriendRequest, acceptFriendRequest, removeFriend,getFriends, getUserById, searchUser, declineFriendRequest,uploadAvatar } = require("../controllers/userController");
const auth = require("../middleware/authorize");

const router = express.Router();

router.post("/friend-request/:id", auth, sendFriendRequest);
router.post("/accept-request/:id", auth, acceptFriendRequest);
router.delete("/remove-friend/:id", auth, removeFriend);
router.post('/decline-request/:id',auth,declineFriendRequest)
router.get("/friends",auth,getFriends)
router.get("/user/:id",getUserById)
router.get("/search",auth,searchUser)
router.post('/upload-avatar', auth, uploadAvatar);

module.exports = router;