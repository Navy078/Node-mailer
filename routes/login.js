const express = require('express');

const token = require('../controllers/token')
const hasher = require('../hashing/hasher')
const { User } = require('../models')

const router = express.Router();
router.use(express.urlencoded());



router.get("/login", (req, res) => {
    res.render('newLogin.html')
});


router.post("/login", async(req, res) => {

    console.log(req.body);


    const remail = req.body.email;
    const rpassword = req.body.password;

    console.log(remail, rpassword);

    try{
        // console.log("Trying to get User...");
        const user = await User.findOne({ where: { email: remail } });
        // console.log("User got...");
        const isValidPassword = await hasher.comparePassword(rpassword,user.password)
        // console.log("Is Password Valid: ",isValidPassword);
        if(isValidPassword && user.isVerified==true){
            // console.log("Password verified");
            const newToken = token.generateAccessToken(remail);
            // console.log(newToken);
            res.cookie("access_token", newToken, {
                httpOnly: true
            })
            console.log("Cookie set");
            return res.redirect('/?msg=Successfully logged in')
        }else{
            var error = "Invalid credentials..."
            res.render('newLogin.html', {error:error})
            // return res.redirect('/login/?msg=Credentials invalid')
            // return res.send({"error":"User is not verified or Password incorrect"})
        }
    }catch(err){
        var error = "Invalid credentials..."
        res.render('newLogin.html', {error:error})
        // return res.redirect('/login/?msg=Credentials invalid')
        // return res.send({"error":"Something went wrong"})
    }
});


router.get("/logout", token.authorization, (req, res) => {
    res.clearCookie("access_token");
    var msg = "Successfully logged out..."
    res.render('home.html', {msg:msg})
    // res.redirect(('/?msg=Successfully logged out'))
});


module.exports = router;
