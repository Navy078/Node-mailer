const nodemailer = require("nodemailer");
const nunjucks = require("nunjucks");

const token = require("./token")

console.log("Inside send mail");

var url;

const sendMail = async(remail, rname, user) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "navjyotsakhalkar7@gmail.com",
            pass: "vhllvaqyoodlbrwq"
        }
    });

    if(user){
        var sub = "User response"
        var template = nunjucks.render('response.html', { user:user });
    }else{
        var sub = "Welcome to MortgageKart"
        url = `http://localhost:5000/confirmation/${token.generateAccessToken(remail)}`;
        var template = nunjucks.render('mail.html', { name:rname, url:url });

        // emaildata = {
        //     name: rname,
        //     url: url
        // }
    }

    let info = {
        from: "navjyotsakhalkar7@gmail.com",
        to: remail,
        subject: sub,
        html: template
    };


    transporter.sendMail(info, (err) => {
        if (err) {
            console.log("An error occured...", err);
        }
        else {
            console.log("Email sent successfully.");
        }
    });
    // console.log("This is info",info);
};

module.exports = { "sendMail":sendMail };
