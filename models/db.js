const mongoose = require('mongoose');
var url = process.env.MONGOLAB_URI;
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
