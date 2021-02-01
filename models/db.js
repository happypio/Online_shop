const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:<password>@cluster0.azij4.mongodb.net/<ShopDB>?retryWrites=true&w=majority', {
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
