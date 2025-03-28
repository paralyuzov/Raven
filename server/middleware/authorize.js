const User = require("../models/User");

module.exports = async (req, res, next) => {
    if (!req.cookies || !req.cookies.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findById(req.cookies.user).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid session" });
    }
};