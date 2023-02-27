// let Country = require('country-state-city').Country;
// let State = require('country-state-city').State;
const express = require('express');

const token = require('../controllers/token')
const { User, Email } = require('../models')
const sendMail = require('../controllers/sendMail');

const router = express.Router();
router.use(express.urlencoded())



router.get("/", async(req,res) => {

    try{
        const newToken = await req.cookies.access_token;
    // console.log(res.cookie);
    // console.log("new token: ",newToken);
        remail = await token.getMailFromToken(newToken);
    // console.log("email: ",remail.email);
        const user = await User.findOne({ where: { email: remail.email } });
    // console.log("user: ",user);
        // console.log(Country.getAllCountries());
        res.render('home.html',{"user":user});
    }catch{
        res.render('home.html')
    }
});



router.get("/userInfo", async(req,res) => {
    const newToken = await req.cookies.access_token;
    remail = await token.getMailFromToken(newToken);
    const user = await User.findOne({ where: { email: remail.email } });
    res.render('userInfo.html',{"user":user});
});


router.post("/userInfo", async(req, res) => {

    // console.log(req.body);

    try{
        const user = await User.findOne({ where: { email: req.body.email } });
        // console.log("emai: ",user.email);
        await user.set({
            sentEmails: user.sentEmails+1,
            address:req.body.address,
            country:req.body.country,
            state:req.body.state,
            city:req.body.city,
            zipcode:req.body.zipcode,
            mobile:req.body.mobile
        });
        console.log("Beofore save ... ");
        await user.save();
        console.log("After save ... ");

        // var responseTemplate = nunjucks.render('response.html', { user:user });

    	const newEmail = await Email.create({ userEmail:user.email, emailType:"response", emailData:user, emailStatus:"Success"})

        await newEmail.set({
            emailUrl: `http://localhost:5000/emaildata/${newEmail.id}`
        })
        await newEmail.save();

        // console.log("User address",user.address);
        // return res.send(user)
        await sendMail.sendMail(user.email, user.name, user)
        return res.redirect('/?msg=Successfully filled information.');
    }catch(err){
        return res.send({"error":"Something went wrong"});
        // return res.send(err);
    }
});


router.get('/profile', async(req,res) => {
    try{
        const newToken = await req.cookies.access_token;
        remail = await token.getMailFromToken(newToken);
        const user = await User.findOne({ where: { email: remail.email } });
        console.log("user got");
        const email = await Email.findAll({ where: { userEmail: remail.email }});
        console.log("email got");
        res.render('profile.html',{"user":user, "emails":email});
    }catch{
        res.render('home.html')
    }
})

module.exports = router;
