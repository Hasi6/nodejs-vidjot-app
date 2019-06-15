const LocalStrategy = require("passport-local")
    .Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load usermodel
const user = mongoose.model('User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: "email" },
        (email, password, done) => {
            // match the user
            user.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: "No user Found" });
                }

                // if user is found then match the password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Password is incorrect" });
                    }
                })
            })
        }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
            done(err, user);
        });
    });
}