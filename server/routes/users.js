const express = require("express");
const { sendFriendRequest, acceptFriendRequest, removeFriend,getFriends, getUserById, searchUser } = require("../controllers/userController");
const auth = require("../middleware/authorize");

const router = express.Router();

router.post("/friend-request/:id", auth, sendFriendRequest);
router.post("/accept-request/:id", auth, acceptFriendRequest);
router.delete("/remove-friend/:id", auth, removeFriend);
router.get("/friends",auth,getFriends)
router.get("/user/:id",getUserById)
router.get("/search",searchUser)

module.exports = router;