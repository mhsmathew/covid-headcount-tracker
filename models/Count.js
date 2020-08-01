const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creates the vote collection
const VoteSchema = new Schema({
    button: {
        type: String,
        require: true,
    },
    points: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: false,
    },
    time: {
        type: Date,
        required: true,
    },
    server: {
        type: String,
        required: true,
        default: "test"
    },
    status: {
        type: String,
        required: true,
        default: "open"
    },
    group: {
        type: String,
        required: false,
    },

});

// Create collection and add schema
const Vote = mongoose.model("Vote", VoteSchema);
module.exports = Vote;