const router = require('express').Router();
const { verifyTokenAndAdmin } = require('./verifyToken');
const CryptoJS = require('crypto-js');
const Product = require('../models/Product');

//CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE PRODUCT
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true});
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE PRODUCT
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted...');
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET PRODUCT
router.get('/find/:id', async (req,res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL PRODUCTS
router.get('/', async (req,res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    let colors;
    if(queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
      colors = [...new Set(products.map(product => product.color).flat())];
    } else if(queryCategory) {
      products = await Product.find({ 
        categories: {
          $in: [queryCategory],
        },
      });
      colors = [...new Set(products.map(product => product.color).flat())];
    } else {
      products = await Product.find();
      colors = [...new Set(products.map(product => product.color).flat())];
    }
    res.status(200).json({products, colors});
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;