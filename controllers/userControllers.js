const users   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt  = require('bcrypt');

const saltRounds = 10;
const JWT_SECRET = "newtonSchool";

const loginUser =async (req, res) => {

    const email  = req.body.email;
    const password = req.body.password;

    const user = await users.findOne({ 'email':email });

    if(user){

        if(bcrypt.compareSync(password , user.password)){

            const token = jwt.sign(
                { userId: user._id, name: user.name, email: user.email, role:user.role },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            res.status(200).json({
                "status": 'success',
                "token" : token
            });
        }else{
            console.log('Invalid Password');
            res.status(403).json({
                "message": 'Invalid Password, try again !!',
                "status": 'fail'
            });
        }
    }else{
        console.log('User doesnot exist');
        res.status(404).json({
            "message": 'User with this E-mail does not exist !!',
            "status": 'fail'
        });
    }

}



const signupUser = async (req, res) => {

    var {email, password, name, role} = req.body;


    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    var newuser = {
        "name":name,
        "email":email,
        "password": hashedPassword,
        "role": role
    };

    users.create(newuser).then((user) => {
        res.status(200).json({
            "message": 'User SignedUp successfully',
            "status": 'success'
        });
    })
    .catch((error) => {
        res.status(404).json({
            "status": 'fail',
            "message": error.message
        });
    });

}

module.exports = { loginUser , signupUser };