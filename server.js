const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require('express-session');
const cron = require("node-cron");
const request = require('supertest');
const db = require("./config/db");
const app = express();
const poll = require("./routes/poll");
const load = require("./routes/load");
const sessions = require("./routes/sessions");
const clear = require("./routes/clear");
require('dotenv').config();

// Set public folder and fix extensions
app.use(express.static(path.join(__dirname, "public"), {
    extensions: ['html', 'htm'],
}));



// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(cors());
app.use("/poll", poll);
app.use("/load", load);
app.use("/sessions", sessions);
app.use("/clear", clear);

// Run cron job to close old servers every hour
cron.schedule("0 * * * *", function() {
    request(app)
        .get('/clear/v1')
        .end();
});

const port = 80;
// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));