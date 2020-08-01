const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
mongoose.set('useFindAndModify', false);
const Vote = require("../models/Count");
const Submit = require("../models/Submitting");
require('dotenv').config();

function FiveHoursAgo(date) {
    time = new Date(date);
    const hour = 1000 * 60 * 60 * 5;
    const hourago = Date.now() - hour;
    console.log(time);
    return time < hourago;
}

// Sends email with link to statistics
function sendEmail(groupName) {
    // Make sure we need to send an email
    Submit.findOne({ group: groupName }).sort({ time: -1 }).then(submission => {
        counter = submission.server;
        email = submission.email;
        if (email == "") {
            // User added no email so we should not send anything
            return;
        }
        // Conects to gmail
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        }));

        // Content of the actual email
        var mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Statistics For Your Counter: ${counter}`,
            html: `<p>We hope you enjoyed using our counter! If you have any questions, comments, or suggestions, please fill out my contact form <a href="https://mathewsteininger.com">here</a>.</p><p>To access the statistics from your counter, you can click <a href="${process.env.URL}/history?group=${groupName}">this</a>.</p><p>Or use this link:</p><p>${process.env.URL}/history?group=${groupName}</p><p>Thanks,</p><p>Mat</p>`
        };

        // Distribute that email
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}

// Our basic request to check which emails to send
router.get("/v1/", (req, res) => {
    console.log("Checking old servers");
    // Check if last vote was made a few hours ago
    Vote.distinct("server").then((votes) => {
        votes.forEach(function(vote) {
            // Let's check for open submissions
            Vote.findOne({ server: vote, status: "open" }).limit(1).sort({ $natural: -1 }).then((latest) => {
                if (latest && FiveHoursAgo(latest.time)) {
                    var groupName = latest.server + "-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    // Mark all votes as closed and add the group id
                    Vote.updateMany({ server: latest.server, status: "open" }, { $set: { status: "closed", group: groupName } }).then((latest) => {});
                    // Set submission to closed
                    Submit.updateMany({ server: latest.server, status: "open" }, { $set: { status: "closed", group: groupName } }).then((latest) => {
                        console.log("Closed Server");
                        // Send email
                        sendEmail(groupName);
                    });
                }
            });
        });
    });
});

module.exports = router;