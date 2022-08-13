const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const app = express();
const _ = require("lodash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const apicache = require('apicache')
dotenv.config({ path: "./config/.env" });

// bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db connection
connectDB();
// static folder
app.use(express.static("public"));

// helpers
const { number_format,stripTags, truncate } = require('./helpers/format')
// register helpers in handlebars
// handlebars middleware
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: { number_format,stripTags, truncate },
  })
);
app.set("view engine", ".hbs");

// init cache middleware
// const cache = apicache.middleware

// app.use(cache('10 minutes'))

// session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use("/", require("./routes/index"));
app.use("/products", require("./routes/products"));
app.use("/order", require("./routes/order"));

// accessing the image publicly
app.use('/public/images', express.static('public/images'));
app.use('/order/public/images', express.static('public/images'));

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
