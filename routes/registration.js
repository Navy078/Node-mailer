const express = require('express');
const nunjucks = require("nunjucks");
let alert = require('alert');


const sendMail = require('../controllers/sendMail');
const { User, Email } = require('../models')
const hasher = require('../hashing/hasher')
const token = require('../controllers/token')
// const welcomeTemplate = require('../templates')

const router = express.Router();
const dateObject = new Date();


// To accept the data in json format
// router.use(express.json())


// To decode the data sent through form
router.use(express.urlencoded())


router.get('/register', (req,res) => {
    console.log("inside get");
	res.render('newRegister.html')
});


router.post('/register', async (req, res) => {
    console.log("inside post");
	const name = req.body.name;
	const email = req.body.email;
	const password = await hasher.hashPassword(req.body.password);

    const user = await User.findOne({ where: {email: email}});

    if(user){
        // alert("Email already exist!");
        var error = "Email already exist..."
        return res.render("newRegister.html",{error:error})
        // console.log("params: ");
		// return res.redirect('/register/?msg=Email already exists..');
    }else{
        await sendMail.sendMail(email, name);
    	const newUser = await User.create({ name, email, password });
    	const newEmail = await Email.create({ userEmail:email, emailType:"welcome", emailData:newUser, emailStatus:"In progress"});
        await newEmail.set({
            emailUrl: `http://localhost:5000/emaildata/${newEmail.id}`
        });
        await newEmail.save();
        console.log(newEmail);
        res.render('verifyEmail.html', {user:newUser});
		// return res.json(user)
    }
});


router.get('/confirmation/:token', async(req,res) => {
    try{
        // console.log("Inside confirmation");
        // console.log(req.params.token);
        const isVerifiedToken = token.tokenVerification("","",req.params.token);
        console.log(isVerifiedToken);
        if(isVerifiedToken){
            console.log("Inside confirmation endpoint and token verification done");
            email = await token.getMailFromToken(req.params.token);
            console.log("Confirmation token email: ",email.email);
            const user = await User.findOne({ where: { email: email.email } });
            await user.set({
				isVerified:true,
                verifiedAt:dateObject
            });
			console.log(user.isVerified);
            console.log("User set");
			await user.save();
            newEmail = await Email.findOne({ where: { userEmail: user.email, emailStatus:"In progress" }});
            console.log("Email object found");
            await newEmail.set({
                emailStatus: "Success"
            });
            await newEmail.save();
            console.log("Verified at: ",dateObject);
            var msg = "Email verification successful..."
            return res.render('newLogin.html', {msg:msg})
            // return res.redirect('/login/?msg=Email verification successful...');
        }else{
            console.log("Token not verified");
        }
    } catch (e) {
        res.send('error');
    }
})


router.get('/emaildata/:id', async(req,res) => {
    // console.log(req.params.eid);
    try{
        console.log("Inside emaildata");
        const email = await Email.findOne({where: {id:req.params.id}});
        console.log("emaildata got");
        if(email.emailType=="response"){
            res.render('response.html', {user:email.emailData});
        }else{
            res.render('mail.html',{name:email.emailData.name});
        }
        // res.send(email.emailData);
    }catch{
        res.send("Template not found");
    }
})


module.exports = router;
