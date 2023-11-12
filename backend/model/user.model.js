const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name: { type: String, require: true },
    mobilenumber: { type: Number, require: true },
    contacts: [
        { type: Number, require: true }
    ]
})

const usermodel = mongoose.model('User', userSchema);
module.exports = usermodel;