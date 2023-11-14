const { UserModel } = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(401).json({ message: 'All fields are required' });
    } else {
        try {
            const isUserPressent = await UserModel.findOne({ email: email });
            if (isUserPressent) {
                return res.status(409).json({ message: "Email already exists" })
            } else {

                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (hash) {
                        let new_user = new UserModel({
                            email: email,
                            password: hash,
                            name: name
                        });

                        await new_user.save();
                        return res.status(201).send({ message: 'Registered Successfully' });
                    } else {
                        throw err;
                    }
                });
            }
        } catch (error) {
            return res.status(400).send({ message: "Registered failed" })
        }
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ message: 'All fields are required' });

    } else {
        let isUserPresnt = await UserModel.findOne({ email });

        if (isUserPresnt) {
            bcrypt.compare(password, isUserPresnt.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ name: isUserPresnt.name }, process.env.JWT_TOKEN, { expiresIn: '24h' });
                    return res.status(200).send({ token: token, name: isUserPresnt.name });
                } else {
                    return res.status(403).send({ message: 'Invalid Credentials' });
                }
            });
        } else {
            return res.status(404).send({ message: 'No user found with this Email' });
        }
    }
}

const verifyUser = (req, res) => {
    res.send({ name: req.body.name });
}


module.exports = { registerUser, loginUser, verifyUser };