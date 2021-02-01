const mongoose = require('mongoose');
var url = process.env.MONGOLAB_URI;
//if you want to deploy app on local host, then use:
//var url = "mongodb://localhost:27017/shopDB";
mongoose.connect(url, {
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
