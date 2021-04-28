var express = require('express');
const router = express.Router();
var request = require('request');
var querystring = require('querystring');
require('dotenv').config();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.URL + '/spotify/callback';
var stateKey = 'spotify_auth_state';
const Submit = require("../models/Submitting");

const session = require('express-session');
router.use(session({
  secret: process.env.APP_SECRET
}));


router.get('/', (req, res) => {
  var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});

router.get('/callback', (req, res) => {
  var code = req.query.code || null;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;
      Submit.findOneAndUpdate({ server: req.session.server, status: "open" }, { $set: { token: access_token, refresh: refresh_token } }, (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }
      });

    }
  });

  res.redirect('/counter');

});

//Get Spotify token if present
router.get("/get", (req, res) => {
  Submit.findOne({ server: req.session.server, status: "open" }).then((info) => {
    if (info.token) {
      return res.json({ success: true, info: true });
    } else {
      return res.json({ success: true, info: false });
    }

  });
});

// Pause using Spotify token
router.get("/pause", (req, res) => {
  Submit.findOne({ server: req.session.server, status: "open" }).then((info) => {
    // To prevent token being lost, lets refresh the token each time
    var refresh_token = info.refresh;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
        var options = {
          url: 'https://api.spotify.com/v1/me/player/pause',
          method: 'PUT',
          headers: headers
        };
        request(options);
      }
    });
  });
  res.redirect('/counter');
});

// Resume using Spotify token
router.get("/play", (req, res) => {
  Submit.findOne({ server: req.session.server, status: "open" }).then((info) => {
    // To prevent token being lost, lets refresh the token each time
    var refresh_token = info.refresh;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
        var options = {
          url: 'https://api.spotify.com/v1/me/player/play',
          method: 'PUT',
          headers: headers
        };
        request(options);
      }
    });
  });
  res.redirect('/counter');
});

module.exports = router;