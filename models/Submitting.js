const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the form submission collection
const SubmissionSchema = new Schema({
    server: {
        type: String,
        require: true,
    },
    organization: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
        default: 'open'
    },
    time: {
        type: Date,
        required: true,
    },
    group: {
        type: String,
        required: false,
    },
});

// Create collection and add schema
const Submission = mongoose.model("Submission", SubmissionSchema);
module.exports = Submission;