const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Product = require("../models/Product");

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let product = await Product.findById({ _id: req.params.id });
    if (!product) {
      res.status(400).json({ error: "No products found" });
    } else {
        let user = req.session.user;    
      res.render("order", {
        user_name: user.name,
        user_email: user.email,
        product_id: product._id,
        product_name: product.product_name,
        product_description: product.product_description,
        product_amount: parseFloat(product.product_amount),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
