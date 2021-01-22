const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { use } = require('./productController');
const User = mongoose.model('User');

router.get('/', (req, res) => {
    res.redirect('/user/list')
})

router.post('/', (req, res) => {
    updateRecord(req, res)
})

router.get('/register', (req,res) => {
    res.render('user/register');
})

router.get('/login', (req,res) => {
    res.render('user/login');
})

router.post('/register', (req, res) => {
    insertRecord(req, res)
})

router.post('/login', (req, res) => {
    checklogin(req, res)
})

function checklogin(req, res) {
    var name = req.body.name
    var password = req.body.password
    User.find({name: name, password: password}, (err, doc) => {
        if (!err) {
            if (doc.length > 0) {
                res.render('user/login', {res: "Succes!"})
            } else {
                res.render('user/login', {res: "Login or Password incorrect!"})
            }
        }
        else {
            console.log("error during login: " + err);
        }
    })
}

/* Adding new user to DB ( register )*/
function insertRecord(req, res) {
    var user = new User();
    var name = req.body.name;
    var email = req.body.email;
    User.find({name: name}, (err, doc) => {
        if (!err) {
            /* Checking only name existance, but what about checking email existence? */
            if (doc.length > 0) {
                res.render('user/register', {name: "This name already exists!"})
            }
            else {
                User.find({email: email}, (err, doc) => {
                    if (!err) {
                        if (doc.length > 0) {
                            res.render('user/register', {email: "Email already in use!"});
                        }
                        else {
                            user.name = name;
                            user.password = req.body.password;
                            user.email = req.body.email;
                            user.user = 'normal';
                            user.isAdmin = false;
                            user.save((err, doc) => {
                                if (!err) {
                                    res.redirect('../');
                                } else {
                                    console.log('Error during insert: ' + err);
                                }
                            })
                        }
                    }
                    else {
                        console.log("error during register: " + err);
                    }
                })
                
            }
            
        }
        else {
            console.log("error during register: " + err);
        }
    })
}

/* Updating existing user data */
function updateRecord(req, res) {
    User.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, dc) => {
        if(!err) {
            res.redirect('user/list');
        } else {
            console.log('Error during update: ' + err);
        }
    })
}

/* List existing users */
router.get('/list', (req, res) => {
    User.find((err, items) => {
        if (!err) {
            res.render('user/list', {
                list: items,
            })
        } else {
            console.log('Error in retrieval: ' + err);
        }
    })
})

/* Show certain user's data (admin only!) */
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, p) => {
        if (!err) {
            res.render('user/edit', {
                user: p
            })
        }
        //console.log(p);
    })
})

/* Delete user by id */
router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, p) => {
        if(!err) {
            res.redirect('../list');
        } else {
            console.log("Error in deletion: " + err);
        }
    })
})

module.exports = router