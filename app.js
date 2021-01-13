require('./models/db');
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {
    allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const bodyparser = require('body-parser');

const productController = require("./controllers/productController");
const userController = require("./controllers/userController");

var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.set('views', path.join(__dirname, '/views/'));

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars), // w celu odczytu obiektow z DB
    extname: 'hbs', // skrocona nazwa hbs -> handlebars
    defaultLayout: "MainLayout", // globalny szablon
    layoutsDir: __dirname + "/views/layouts", //biblioteka z szablonami
   })
);

app.set("view engine", "hbs");

app.listen(3000, () => {
    console.log('STARTED');
});

app.use('/product', productController);
app.use('/user', userController);