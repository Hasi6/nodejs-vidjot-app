const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


//Load Idea Models
require("../models/Idea");
const Idea = mongoose.model('Idea');


//idea index page
router.get("/", (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// add ideas form
router.get("/add", (req, res) => {
    res.render("ideas/ideasAdd");
});

// Edit idea form
router.get("/edit/:id", (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render("ideas/edit", {
                idea: idea
            });
        });

});

// process Form
router.post("/", (req, res) => {
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
            details: req.body.details
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
router.put("/:id", (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea Edited');
                    res.redirect("/ideas");
                });
        });
});

// Delete form process
router.delete("/delete/:id", (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect("/ideas");
    });
});

module.exports = router;