const mongoose = require("mongoose");
require('dotenv').config();

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose connection
mongoose
    .connect(
        process.env.MONGO_SERVER
    )
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));