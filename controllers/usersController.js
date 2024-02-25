const User = require('../models/userModel');
const bcrypt = require('bcrypt');



module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({username});
        if(usernameCheck){
            return res.json({msg: "Username already exists!", status: false});
        }

        const emailCheck = await User.findOne({email});
        if(emailCheck){
            return res.json({msg: "Email already exists!", status: false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        delete user.password;
        return res.json({msg: "User registered successfully!", status: true, user});
    }
    catch(err){
        next(err);
    }
} 

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.json({msg: "Incorrect username or password!", status: false});
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if(!isPassValid){
            return res.json({msg: "Incorrect username or password!", status: false});
        }

        delete user.password;
        return res.json({msg: "User logged in successfully!", status: true, user});
    }
    catch(err){
        next(err);
    }
} 

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        });
        return res.json({isSet: userData.isAvatarImageSet, image: userData.avatarImage});
    } catch (err) {
        next(err);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id:{$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage"
        ]);
        return res.json(users);
    }
    catch(err){
        next(err);
    }
}