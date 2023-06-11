var express = require('express');
var router = express.Router();
var checkUser = require('../middleWare/checkUser');
var {
  getHomePage,
  getLoginPage,
  getRegister,
  doRegister,
  doLogin,
  getmyOrder,
  addtocart,
  singleProduct, 
  checkOut,
  payVarify,
  MyCart,
  Logout
 

} = require('../controllers/userControllers')

/* GET home page. */
router.get('/', getHomePage)
router.get('/Login', getLoginPage)
router.get('/Register',getRegister)
router.post('/Register', doRegister )
router.post('/Login', doLogin)
router.get('/myOrder',checkUser,getmyOrder)
router.get('/buy-now/:id',checkUser,singleProduct)
router.get('/checkOut/:price',checkUser,checkOut)
router.post('/varify',payVarify)
router.get('/Logout',Logout)
router.get('/addtocart/:id',addtocart)
router.get('/Mycart',MyCart)


module.exports = router;
