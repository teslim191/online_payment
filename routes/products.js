const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const  upload  = require('../middleware/upload');
const apicache = require("apicache")

// init cache middleware
const cache = apicache.middleware
const cacheTime = cache("10 minutes")

// get request to the addproducts page
router.get('/addproducts', cacheTime, (req, res) => {
  res.render('addProducts')
})


router.post('/addproducts', upload.single('product_image'),  (req, res) => {
  const { pname, pdesc, pamount } = req.body;
  try {
    let product = new Product({
      product_name: pname,
      product_description: pdesc,
      product_amount: pamount,
    })
    if (req.file){
      product.product_image = req.file.path;
    }
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
