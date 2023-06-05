const session = require('express-session');
var con = require('../config/config');
let Razorpay = require('../payment/Razorpay');
const userModel = require('../models/userModel');
let productModel = require('../models/productModel');
let CartModel = require('../models/CartModel');
const { triggerAsyncId } = require('async_hooks');

const getHomePage = async(req,res)=>{
    let product = await productModel.find();
     if(req.session.user){
        console.log(product);
         let user = req.session.user;
          res.render('index',{user,product});
     }else{
         res.render('index',{product});
     }
    
   
    // let sql = "select * from product" 
    // con.query(sql,(err,row)=>
    // {
    //     console.log(row);
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(req.session.user){
    //             let user = req.session.user;
    //             let id = user.id;
    //             console.log(user);
    //             let cartQry = "select count (*) cartNumber from cart where userid = ?;"
    //             con.query(cartQry,[id],(err,result)=>
    //             {
    //                 if(err){
    //                     console.log(err);
    //                 }else{
    //                     console.log(result[0].cartNumber,"cart");
    //                     let cart = result[0].cartNumber;
    //                     res.render('index',{user,row,cart});
    //                 }
    //             })
    //             // res.render('index',{user,row});
    //         }else
    //         {
    //             res.render('index',{row});
    //         }
    //     }
    // })   
}

const getLoginPage = (req,res)=>{
    res.render('User/Login');
}

const getmyOrder = (req,res)=>{
    let user = req.session.user;
    res.render('User/myOrder',{user});
}

const getRegister = (req,res)=>{
    res.render('User/Register');
}

const doLogin = async(req,res)=>
{
    let users = await userModel.find({email:req.body.email,password:req.body.password})
    if(users.length>0){
         console.log("successfully login"); 
         req.session.user = users[0]
         res.redirect('/')
    }else{
        console.log("invalid user");
        res.redirect('/login')
    }
//       
    
//       {
//         console.log("successfully login");
// let {email} = req.body;
// let {password} = req.body;
// let check = "select * from user where email =  ? and password = ?" 
// con.query(check,[email,password],(err,result)=>{
//     if(err){
//         console.log(err);  
//     }else
//     {
//       console.log(result);
//       if(result.length>0)
//       {
//         console.log("successfully login");
//         req.session.user = result[0];
//         console.log(req.session.user,"from session data");
//         res.redirect('/')
//       }else{
//         console.log("invalid user");
//         res.redirect('/login')
//       }
//     }
// })
}  

const Logout = (req,res)=>
{
    req.session.destroy()
    res.redirect('/') 
}


const doRegister = async(req,res)=>{
    console.log(req.body);
    try {
        await userModel.create(req.body)
        console.log("user created");
        res.redirect('/login')  
    } catch (error) {
        console.log(error)   
    }
//     let qry = "insert into user set ?"
//     con.query(qry,req.body,(err,result)=>{
//         if(err){
//             console.log(err);
//         }else
//         {
//             console.log("value instered");
//             res.redirect('/login')
//         }
//     })  
// }
}

const addtocart = async (req,res)=>
{
     let {user} = req.session;
     let {id} = req.params;
    try {
        let product = await productModel.findOne({_id: id});
        product.id = id;
        let obj ={
            item:product,
            quantity:1
        }
        let cart = await CartModel.findOne({userId:user._id})
        if(cart){
            console.log(cart);
            let proExist = cart.products.findIndex(product=> product.item._id == id)
            console.log(proExist);
            if (proExist != -1){
                await CartModel.findOneAndUpdate({
                    "products.item._id":product._id
                },
                {
                    $inc:{'products.$.quantity': 1}
                }
                )
                // res.redirect("users/cart")
            }else {
                await CartModel.findOneAndUpdate({ userId: user._id },
                    {
                        $push: {
                            products: obj
                        }
                    }
                )
                // res.redirect("users/cart")
            }
        }else{
            let cartObj = {
                userId:user._id,
                products:[obj]
            } 
            console.log("cart",cartObj)
            await CartModel.create(cartObj);
            // res.redirect("/users/cart")
        }
        
    } catch (error) {
        console.log(error);
        res.redirect("/user/index")
    }
}

const singleProduct = async(req,res)=>
{
    let pid = req.params.id;
    try {
        let product = await productModel.find({_id:pid})
        console.log(product);
        product = product[0];
        let user = req.session.user;
        res.render('User/singlePage',{product,user})
    } catch (error) {
        
        console.timeLog(error)
    }
}

const checkOut = (req,res)=>{
    let pid = req.params.id;
    let price = parseInt(req.params.price);
    console.log(pid,price);
    var options = {
        amount:price,
        currency: "INR",
        receipt: "Order_reptid_11"
    };
    Razorpay.orders.create(options,(err,order)=>{
        if(err){
            console.log(err)
        }else{
            console.log(order)
            res.render('User/checkOut',{order})
            }
            })
        }
        const MyCart = (req,res)=>{
            res.render('User/MyCart')
        }


     const payVarify = async(req,res)=>{
        console.log(req.body)
        let data = req.body;
        var crypto = require('crypto')
        var order_id = data['response[razorpay_order_id]']
        var payment_id = data[ 'response[razorpay_payment_id]']
        const razorpay_signature = data[ 'response[razorpay_signature]']
        const key_secret = '0dQCoDwMSkITlrqCmlNKuXoG';
        let hmac = crypto.createHmac('sha256', key_secret); 
        await hmac.update(order_id + "|" + payment_id);
        const generated_signature = hmac.digest('hex');
        if(razorpay_signature===generated_signature){
            console.log("Verified");
        }
        else{
            console.log("Failed")
        }

     }




// const doLogin = (req,res)=>{
//     console.log(req.body);
// }
module.exports = {
    getHomePage,
    getLoginPage,
    getRegister,
    doRegister ,
    doLogin,
    getmyOrder,
    addtocart,
    singleProduct,
    checkOut,
    payVarify,
    MyCart,
    Logout
}