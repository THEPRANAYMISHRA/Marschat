const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    friends: [{ type: String }]
})

const UserModel = mongoose.model('User', userSchema);
module.exports = { UserModel };