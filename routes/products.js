const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get('/addproducts', (req, res) => {
  res.render('addProducts')
})


router.post('/addproducts', async(req, res) => {
  const { pname, pdesc, pamount } = req.body;
  try {
    let product = new Product({
      product_name: pname,
      product_description: pdesc,
      product_amount: pamount,
    })
    product.save((err, product) => {
      if (err) {
        console.log(err)
      }
      else{
        res.redirect('/')
      }
    } )
  } catch (error) {
    console.log(error)
  }
})



module.exports = router;
