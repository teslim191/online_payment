const express = require("express");
const router = express.Router();
const request = require("request");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { initializePayment, verifyPayment } =
  require("../config/Paystack")(request);
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// get request to the register page
router.get("/register", ensureGuest, (req, res) => {
  res.render("register");
});

// post request to register users
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ error: "Please fill in all fields" });
    } else {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ error: "user exists already" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        user = await User.create({
          name,
          email,
          password: hashPassword,
        });
        res.redirect("login");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// get request to the login page
router.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});

// post request to login users
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ error: "Please fill in all fields" });
    } else {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: "user does not exist" });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(400).json({ error: "incorrect password" });
        } else {
          req.session.user = user;
          res.redirect("/");
          // res.json({welcome: `logged in as ${user.name}`})
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// a get request to the index page
router.get("/", ensureAuth, async (req, res) => {
  try {
    let user = await User.findById(req.session.user._id);
    let product = await Product.find().lean();
    // console.log(user.name, user.email)
    res.render("index", {
      name: user.name,
      email: user.email,
      product,
    });
  } catch (error) {
    console.log(error);
  }
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

router.post("/paystack/pay", (req, res) => {
  const form = _.pick(req.body, ["name", "email", "amount"]);
  form.metadata = {
    name: form.name,
  };
  form.amount *= 100;

  // global variable for amount to use in the order model
  // productAmount = () => {
  //   globalThis.productAmount = req.body.amount;
  //   productAmount /= 1;
  //   return productAmount;
  // }
  // order_productAmount = productAmount();
  // global variable to use in the order model
  productName = () => {
    globalThis.product_name = req.body.product_name
    return product_name
  }
  order_product_name = productName()
  initializePayment(form, (error, body) => {
    if (error) {
      //handle errors
      console.log(error);
      return res.redirect("/error");
    }
    response = JSON.parse(body);
    res.redirect(response.data.authorization_url);
  });
});

router.get("/paystack/callback", (req, res) => {
  const ref = req.query.reference;
  verifyPayment(ref, (error, body) => {
    if (error) {
      //handle errors appropriately
      console.log(error);
      return res.redirect("/error");
    }
    response = JSON.parse(body);

    const data = _.at(response.data, [
      "reference",
      "amount",
      "customer.email",
      "metadata.user_name",
    ]);

    [reference, amount, user_email, user_name] = data;
    try {
      const order = new Order({
        product_name: order_product_name,
        reference,
        amount: amount / 100,
        email:user_email,
        name:req.session.user.name,
      })
      console.log(order.amount)
      console.log(order.product_name)
      order.save((err,order) => {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/receipt/' + order._id)
        }
      })
      
    } catch (error) {
      console.log(error)
    }
  });
});

router.get("/receipt/:id", async (req, res) => {
  try {
    const order = await Order.findById({_id:req.params.id});
    if (!order) {
      res.json({ error: "error processing order" });
    }
    res.render('success', {
      name: order.name,
      product_name: order.product_name,
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get("/logout", (req, res) => {
//   req.logout();
//   req.flash("success_msg", "you are logged out");
//   res.redirect("/users/login");
// });

module.exports = router;
