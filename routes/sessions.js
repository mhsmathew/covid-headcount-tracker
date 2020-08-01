const express = require("express");
const router = express.Router();

router.get('/check', (req, res) => {
    let sesh = req.session;
    res.send(sesh.server);
});

router.post('/login', (req, res) => {
    let sesh = req.session;
    sesh.server = req.body.server;
    res.send(sesh.server);
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.send('done');
    });

});

module.exports = router;