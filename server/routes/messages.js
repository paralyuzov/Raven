const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.get('/:userId/:recipientId',async (req,res) => {
    try {
        const { userId, recipientId } = req.params;
        const messages = await Message.find({
            $or:[
                {sender:userId,recipient:recipientId},
                {sender:recipientId,recipient:userId}
            ]
        }).sort({createdAt:1})
        console.log(messages)
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error fetching messages",error);
        res.status(500).json({message:"Internal server error"});
    }
})

module.exports = router;