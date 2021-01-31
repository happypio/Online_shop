const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopDB', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
},
err => {
    if (!err) {
        console.log("Connection succeeded");
    } else {
        console.log("Error in connection" + err);
    }
});

require('./product.model');
require('./user.model');
require('./order.model');