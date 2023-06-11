var con = require('../config/config');
const productModel = require('../models/productModel');

const getadminlogin = (req,res)=>
{
    res.render('admin/Login');
}

const login = (req,res)=>
{
 let username = "admin";
 let password = "admin";
 console.log(req.body)
 if
 (req.body.username == username && req.body.password == password)
 {
    console.log("login successfully");
    res.render('admin/adminHome');
 }else
 {
    console.log("failed");
    res.redirect('/admin');
 }
}

const adminHome = (req,res)=>
{
    res.render('admin/adminHome');
}

const addProductpage = (req,res)=>
{ 
    res.render('admin/addProduct');
}

const addProduct = async (req,res)=>
{
    let file = req.files.image;
    const {name} = req.files.image;
    req.body.image = name;
    console.log(req.body);
    try {
        let product = await productModel.create(req.body)
        file.mv('public/images/product/'+product._id,(err)=>{
            if(err){
                console.log(err);
            } 
            res.redirect('/admin/addProduct')
        
    })
    }catch (error) {
        console.log(error) 
    }     
}


module.exports = 
{
    getadminlogin,
    login,
    adminHome,
    addProductpage,
    addProduct
}