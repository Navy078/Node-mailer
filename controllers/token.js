const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;


function generateAccessToken(email) {
    const token = jwt.sign({email},process.env.TOKEN_SECRET,{ expiresIn: '8h' });
    // console.log(email, " ", token);
    return token;
}


const authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(data);
        return next();
    } catch {
        return res.sendStatus(403);
    }
};

const tokenVerification = (res, next, token) => {
    if (!token) {
        return false;
    }
    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("Token verified ",data);
        return true;
    } catch {
        return false;
    }
};

const getMailFromToken = async(token) => {
    // console.log("Token: ",token);
    email = jwt.decode(token);
    // console.log("Email:",email);
    return email;
};



module.exports = {"generateAccessToken": generateAccessToken, "authorization": authorization, "tokenVerification":tokenVerification, "getMailFromToken":getMailFromToken}