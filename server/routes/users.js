const USERS = require('../models/User');
const express = require('express');
const router = express.Router();

router.get('/',async(req,res) => {
    try {
        const users = await USERS.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})

module.exports = router;