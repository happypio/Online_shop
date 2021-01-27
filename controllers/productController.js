const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

var fs = require('fs');
var path = require('path');
var multer = require('multer');
const { runInNewContext } = require('vm');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

router.get('/', redirect_isAdmin,(req, res) => {
    res.render('product/addOrEdit', {
        viewTitle: 'Insert Product'
    })
})

function redirect_isAdmin(req, res, next) {
    if (!req.session.isAdmin || req.session.isAdmin == false){
        res.redirect('/')
    }
    else{
        next()
    }
}

router.post('/search', (req, res) => {
    if (req.body.search == '') {
        res.redirect('list')
    } else {
        Product.find({name: req.body.search}, (err, items) => {
            if (!err) {
                res.render('product/list', {
                    list: items,
                    search: req.body.search,
                })
            } else {
                console.log('Error in retrieval: ' + err);
        }
        })
    }
})

router.post('/', upload.single('img'), (req, res) => {
    if (req.body._id == '') {
        insertRecord(req, res)
    } else {
        updateRecord(req, res)
    }
})

function insertRecord(req, res) {
    var product = new Product()
    product.name = req.body.name
    product.specification = req.body.specification;
    product.mobile = req.body.mobile;
    if (req.file) {
        var img = {
            data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
        product.img = img
    }
    product.save((err,doc) => {
        if (!err) {
            //wyczyscic podreczna pamiec w upload jesli bylo zdj
            if (req.file) {
                fs.unlink(path.join(process.cwd() + '/uploads/' + req.file.filename), (err) => {
                    if (err) {
                        console.log("error while removing");
                    }
                })
            }
            res.redirect('product/list');
        } else {
            console.log('Error during insert: ' + err);
        }
    })
}

function updateRecord(req, res) {
    Product.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, dc) => {
        if(!err) {
            if (req.file) {
                var img = {
                    data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
                dc.img = img
            }
            dc.save((err,doc) => {
                if (!err) {
                    //wyczyscic podreczna pamiec w upload
                    if (req.file) {
                        fs.unlink(path.join(process.cwd() + '/uploads/' + req.file.filename), (err) => {
                            if (err) {
                                console.log("error while removing");
                            }
                        })
                    }
                    res.redirect('product/list');
                } else {
                    console.log('Error during insert: ' + err);
                }
            })
        } else {
            console.log('Error during update: ' + err);
        }
    })
}

router.get('/list', (req, res) => {
    Product.find((err, items) => {
        if (!err) {
            res.render('product/list', {
                list: items,
            })
        } else {
            console.log('Error in retrieval: ' + err);
        }
    })
})

router.get('/picture/:id', (req, res) => {
    Product.findById(req.params.id, (err, prod) => {
        if (prod.img == null || prod.img.data == null) {
            res.render('unknown');
            //res.redirect('../list');
        }
        else {
            res.contentType(prod.img.contentType);
            res.send(prod.img.data);
        }
    })
})
router.get('/show/:id', (req, res) => {
    Product.findById(req.params.id, (err, prod) => {
        res.render('product/description', {
            product: prod,
        });
    })
})

router.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, p) => {
        if (!err) {
            res.render('product/addOrEdit', {
                viewTitle: 'Update Product',
                product: p
            })
        }
        //console.log(p);
    })
})

router.get('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, p) => {
        if(!err) {
            res.redirect('../list');
        } else {
            console.log("Error in deletion: " + err);
        }
    })
})

module.exports = router