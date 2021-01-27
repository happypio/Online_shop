const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { use } = require('./productController');
const User = mongoose.model('User');
var bcrypt = require('bcrypt');
var assert = require('assert');
var session = require('express-session');

router.get('/', (req, res) => {
    res.redirect('user/list')
})
 
router.get('/list', redirectLogin, (req, res) => {
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
router.post('/', (req, res) => {
    updateRecord(req, res)
})

router.get('/register', (req,res) => {
    res.render('user/register');
})

router.get('/login', redirectIndex, (req,res) => {
    res.render('user/login');
})

router.post('/register', (req, res) => {
    insertRecord(req, res)
})

router.post('/login', (req, res) => {
    checklogin(req, res)
})

router.get('/logout', redirectLogin, (req, res) => {
    res.render('user/logout')
    destroySession(req, res)
})

router.get('/login_success', (req, res) => {
    res.redirect('/user/login');
})  


function checklogin(req, res) {
    var name = req.body.name
    var password = req.body.password
    User.find({name: name}, (err, doc) => {
        if (!err) {
            /* There should be exactly one match as the names are unique */
            if (doc.length == 1) { 
                bcrypt.compare(password, doc[0].password).then((result) => {
                    if( result ){
                        res.render('user/login_success', {name: name});
                        /* These two lines below are crucial for the authentication process */
                        req.session._id = doc[0]._id;
                        req.session.isAdmin = doc[0].isAdmin;
                    } 
                    else {
                        res.render('user/login', {res: "Password incorrect!"});
                    }
                  })
                  .catch((err) => console.error(err))
            } 
            else if (doc.length == 0){
                res.render('user/login', {res: "Login incorrect!"})
            }
            /* This should never happen, but added for clarity: */
            else {
                res.status(500).send({error: "Error during login"});
            }
        }
        else {
            console.log("error during login: " + err);
        }
    })
}

/* Called when anonymous client wants to access a page, that is 
 * available only for authenticated users */ 
function redirectLogin (req, res, next){
    if (!req.session._id){
        res.redirect('/user/login')
    }
    else {
        next()
    }
}

/* Called when authenticated user wants to log in, as we don't
 * want him to login more than once */
function redirectIndex (req, res, next){
    if (req.session._id){
        res.redirect('/..')
    }
    else {
        next()
    }
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

function destroySession(req,res) {
    req.session.destroy(err => {
        if (err){
            return res.redirect("/")
        }
        res.clearCookie('sesID')
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