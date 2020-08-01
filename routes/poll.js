const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
const Vote = require("../models/Count");
var Pusher = require("pusher");
require('dotenv').config();

// Pusher secrets
var pusher = new Pusher({
    appId: process.env.PUSHER_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "us2",
    encrypted: true,
});

router.use(session({
    secret: process.env.APP_SECRET
}));

// Gets user's current counter
router.get("/", (req, res) => {
    Vote.find({ server: req.session.server, status: "open" }).then((votes) => res.json({ success: true, votes: votes }));
    Vote.find({ server: req.session.server, status: "open" }).limit(1).sort({ $natural: -1 }).then((votes) => total = (votes.length > 0 ? votes[0].total : 0));
});

// For statistics we all need the votes
router.post("/history", (req, res) => {
    Vote.find({ group: req.body.group }).then((votes) => res.json({ success: true, votes: votes }));
});

// New count added
router.post("/", (req, res) => {
    Vote.findOne({ server: req.session.server, status: "open" }).sort({ time: -1 }).then(latest => {
        total = latest.total;
        total += req.body.result;
        if (total <= 0) {
            total = 0;
        }
        const newVote = {
            button: req.body.button,
            points: req.body.result,
            total: total,
            time: Date.now(),
            server: req.body.server
        };

        new Vote(newVote).save().then((vote) => {
            pusher.trigger("counter-" + vote.server, "counter-vote", {
                points: vote.points,
                button: vote.button,
                total: vote.total,
                time: vote.time
            });
            return res.json({ success: true, message: "Thanks for counting" });
        });
    })

});

module.exports = router;