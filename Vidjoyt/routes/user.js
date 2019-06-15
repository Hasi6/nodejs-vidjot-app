const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const passport = require("passport");

//Load Idea Models
require("../models/User");
const User = mongoose.model('User');

// user login route
router.get("/login", (req, res) => {
    res.render("users/login");
});

// user register route
router.get("/register", (req, res) => {
    res.render("users/register");
});

//user register process
router.post("/register", (req, res) => {
    let errors = [];
    if (req.body.password != req.body.cpassword) {
        errors.push({ text: "Password and Confirm Passwords are not the same" });
    }
    if (req.body.password.length < 6) {
        errors.push({ text: "Password must be at least 6 charecters" });
    }

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            username: req.body.uname,
            email: req.body.email
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', "Email Already Registerd");
                    res.redirect("/users/register");
                } else {
                    const newUser = {
                        username: req.body.uname,
                        email: req.body.email,
                        password: req.body.password
                    };
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            new User(newUser)
                                .save()
                                .then(user => {
                                    req.flash('success_msg', 'New User Added');
                                    res.redirect("/users/login");
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        })
                    });
                }
            })

    }
});

module.exports = router;
4