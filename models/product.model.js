const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    specification: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    img: {
        data: Buffer,
        contentType: String,
    },
})

mongoose.model('Product', productSchema);