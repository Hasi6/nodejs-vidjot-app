const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");


//Load Idea Models
require("../models/Idea");
const Idea = mongoose.model('Idea');


//idea index page
router.get("/", ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// add ideas form
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("ideas/ideasAdd");
});

// Edit idea form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })

    .then(idea => {
        if (idea.user != req.user.id) {
            req.flash("error_msg", "Not authorized");
            res.redirect("/ideas");
        } else {
            res.render("ideas/edit", {
                idea: idea
            });
        }
    });
});

// process Form
router.post("/", ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "plese add a title" });
    }
    if (!req.body.details) {
        errors.push({ text: "please add a description" });
    }
    if (errors.length > 0) {
        res.render("ideas/ideasAdd", {
            errors: errors,
            title: req.body.title,
            details: req.body.title
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea Added');
                res.redirect("/ideas");
            });
    }
});

// Edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash("error_msg", "Not authorized");
                res.redirect("/ideas");
            } else {
                //new values
                idea.title = req.body.title;
                idea.details = req.body.details;

                idea.save()
                    .then(idea => {
                        req.flash('success_msg', 'Video idea Edited');
                        res.redirect("/ideas");
                    });
            }

        });
});

// Delete form process
router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect("/ideas");
    });
});

module.exports = router;