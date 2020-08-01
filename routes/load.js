const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Vote = require("../models/Count");
const Submit = require("../models/Submitting");

router.post("/", (req, res) => {
    Submit.find({ server: req.body.server, status: "open" }).count(function(err, count) {
        if (count >= 1) {
            // Already exists so we will join
            console.log("Server exists: " + req.body.server);
            return res.json({ success: true, exists: true, server: req.body.server });
        } else {
            console.log("Server does not exist: " + req.body.server);
            return res.json({ success: true, exists: false, server: req.body.server });
        }
    });

});

router.post("/newServer", (req, res) => {
    // User may want to create a new server so we should send them to that page
    const newVote = {
        button: "created",
        points: 0,
        total: 0,
        time: Date.now(),
        server: req.body.server
    };
    const newSubmission = {
        server: req.body.server,
        organization: req.body.organization,
        city: req.body.city,
        email: req.body.email,
        status: 'open',
        time: Date.now(),
    }
    new Submit(newSubmission).save().then(() => {
        new Vote(newVote).save().then(() => {
            console.log("Created New Server");
            return res.json({ success: true, server: req.body.server });
        });
    });
});

module.exports = router;