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
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000

var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cookieParser())

app.use(session({
    name: 'SesID',
    resave: false,
    saveUninitialized: false,
    secret: 'SimpleSecretWord123321?!',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: true
    }
}))

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

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

app.listen(port, () => {
    console.log('STARTED');
});

app.use('/product', productController);
app.use('/user', userController);