const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Type = require('../models/Type');
const Major = require('../models/Major');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const async = require('hbs/lib/async');
const body_parser = require('body-parser');
const saltRounds = 10;
require('../passport-setup')
const Scholarship = require('../models/Scholarship')
const UserController = require('../controller/user.controller');


router.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
  })
)


router.use (passport.initialize ());
router.use (passport.session());


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get('/page', function(req, res, next) {
  res.render('loginsystem/pagelogin');
});

router.get('/content',isLoggedIn, async (req, res, next) => {
  const uemail = await req.user.email
  User.findOne({'uemail':uemail}).exec(doc)
  res.render('contentpage',{user:doc})
  console.log(doc)
});

router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile']})
);

router.get('/login/google/callback',
  passport.authenticate('google' , {
    successRedirect: '/users/protected',
    failureRedirect: '/users/auth/failure',
  })
);

router.get('/protected',isLoggedIn, async (req,res) => {  //
  // res.send(`Hello ${req.user.email}`)
  const email = await req.user.email
  const auth_email = await User.findOne({'uemail':email})
  const emtry = ['null', '[]' ,'""']
  
  if(auth_email == emtry['']){
    console.log('Email is not register')
    console.log(email)
    console.log(auth_email)
    res.render('loginsystem/googlelogin',{uemail:email})

  } else{
    console.log('yes you have an account')
    console.log(email)
    res.redirect('/users/homepage')
    // console.log(auth_email)
    // let rec = await Scholarship.find({stype:auth_email.ustype,sfaculty:{$in:auth_email.ufaculty},sbranch:{$in:auth_email.ubranch},sgpa:{$lte:auth_email.ugpa},sclass:auth_email.uclass}).exec()
    // console.log(rec)
    // res.render('loginsystem/contentpage',{userdata:auth_email,rec:rec})  //homepage
  }

  // res.render('googlelogin',{uemail:email})
  // console.log(email)
})

router.get('/homepage',isLoggedIn, async (req,res) => {
  const email = await req.user.email
  const auth_email = await User.findOne({'uemail':email})
  let rec = await Scholarship.find({stype:auth_email.ustype,sfaculty:{$in:auth_email.ufaculty},sbranch:{$in:auth_email.ubranch},sgpa:{$lte:auth_email.ugpa},sclass:auth_email.uclass}).exec()
  console.log(rec)
  res.render('loginsystem/contentpage',{userdata:auth_email,rec:rec})
})


router.get('/auth/failure', (req,res) => {
  res.send('Some thing is wrong..')
})

router.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/users/page')
})

router.post('/register', async(req, res, next) =>{
  const pass = req.body.pass
  const hash = await bcrypt.hash(pass,10)

  let data = new User({
    uemail:req.body.uemail,
    upass:hash,
    ufname:req.body.ufname,
    ulname:req.body.ulname,
    ustype:req.body.ustype,
    ufaculty:req.body.ufaculty,
    ubranch:req.body.ubranch,
    uclass:req.body.uclass,
    ugpa:req.body.ugpa,
    utoeic:req.body.utoeic,
    uielts:req.body.uielts,
    utoefl:req.body.utoefl,
    pinned:req.body.pinned,
    phonenumber:req.body.phonenumber
  })
  const checkemail = await User.find({uemail:data['uemail']})

  if(checkemail  != ''){
    // res.send('this email is registed !! you can go to login')
    // res.render('/users/page')
  }else{
    console.log(data['uemail'])
    User.saveUser(data)
      res.send('register Succesful ! pleace go to login ')
      // res.render('/users/page')
      console.log('register success')
  }
})

router.post('/loginmobile',UserController.login,);
// router.post('/mobilelogin',UserController.login, async (req, res, next) => {

// router.post('/mobilelogin', async (req, res, next) => {
//   const {uemail, upass} = req.body;
//   console.log(uemail)
//   console.log(upass)

//   const user = await  User.findOne({uemail:uemail});

//   console.log(user)
//   if (user) {
//     const isCorrect = bcrypt.compareSync(upass, user.upass);
//     if(isCorrect) {
//       res.json({status:true});
//       // res.redirect('/users/homepage')
//       // let rec = await Scholarship.find({stype:user.ustype,sfaculty:{$in:user.ufaculty},sbranch:{$in:user.ubranch},sgpa:{$lte:user.ugpa},sclass:user.uclass}).exec()
//       // console.log(rec)
//       // res.render('loginsystem/contentpage',{userdata:user,rec:rec})
//       // req.user = user;
//     } else {
//       res.json({status:true});
//       // res.render('Password is not correct')
//       // res.send('Password is not correct')
//     }
//   } else{
//     res.json({status:true});
//     // res.send('Email not register')
//   }
// })


router.post('/login', async (req, res, next) => {
  const uemail = await req.body.uemail
  const upass = await req.body.upass

  const user = await User.findOne({uemail:uemail});
  console.log(uemail)
  console.log(upass)
  console.log(user)
  if (user) {
    const isCorrect = bcrypt.compareSync(upass, user.upass);
    req.user = user;
    if(isCorrect) {
      // res.redirect('/users/homepage')
      let rec = await Scholarship.find({stype:user.ustype,sfaculty:{$in:user.ufaculty},sbranch:{$in:user.ubranch},sgpa:{$lte:user.ugpa},sclass:user.uclass}).exec()
      console.log(rec)
      res.render('loginsystem/contentpage',{userdata:user,rec:rec})
      // req.user = user;
    } else {
      res.render('Password is not correct')
    }
  } else{
    res.send('Email not register')
  }
})


router.get('/scholarship',(req,res) => {
  Scholarship.find().limit(80).exec().then((doc,err) => {
      res.render('scholarship/scholarshipUserView',{scholarships:doc})
  })
})


router.get('/filter',async (req,res)=> {
  let l_stype = await Scholarship.distinct('stype').exec()
    let l_facu = await Major.distinct('faculty').exec()
    let l_branch = await Major.distinct('branch').exec()
    let l_uni = await Scholarship.distinct('university').exec()
    let l_country = await Scholarship.distinct('country').exec()
  
    res.render('scholarship/userfilter',{scholarshipstype:l_stype,scholarshipsfacu:l_facu,scholarshipsbranch:l_branch,scholarshipsuni:l_uni,l_country:l_country})
  })
  
  router.use('/result', async (req, res) => {
      let ft_stype = await req.body.ft_stype
      let ft_facu = await req.body.ft_facu
      let ft_branch = await req.body.ft_branch
      let ft_uni = await req.body.ft_uni
      let ft_gpa = await req.body.ft_gpa
      let ft_country = await req.body.ft_country
      let ft_sclass = await req.body.ft_sclass
  
      if(ft_sclass == 'all'){
          ft_sclass = ['มัธยม','ปริญญาตรี','ปริญญาโท','ปริญญาเอก']
      }
      await Scholarship.find({stype:ft_stype,sfaculty:{$in:ft_facu},sbranch:{$in:ft_branch},university:ft_uni,sgpa:{$lte:ft_gpa},sclass:ft_sclass,country:ft_country}).exec().then((doc)=> {
          res.render('scholarship/userresultfilter',{scholarships:doc})
          // res.send(doc)
          // console.log(doc)
      })
      // console.log(ft_stype)
      // console.log(ft_facu)
      // console.log(ft_branch)
      // console.log(ft_uni)
      // console.log(ft_gpa) 
    })



router.post('/pinin',isLoggedIn, async (req,res,next) => {
  // const emtry = ['null', '[]' ,'""']
  const email = await req.user.email
  let whatpage = await req.body.whatpage
  let sculs_id = await req.body.pin_id
  let udoc = await User.find({'uemail':email,'pinned':sculs_id}).exec()
  let pincount = await Scholarship.findOne({'_id':sculs_id}).exec()
  console.log(whatpage)

  if(udoc == '' ){
    await User.updateOne({'uemail':email},{$push:{'pinned':sculs_id}})
    console.log('pinned!!')
    console.log(udoc)
    let resultcount = pincount['pinnedcount'] + 1;
    await Scholarship.updateOne({'_id':sculs_id},{$set:{'pinnedcount':resultcount}})
    switch(whatpage){
      case 'page0':
        res.redirect('/users/pinscholarship')
        break;
      case 'page1':
        res.redirect('/users/scholarship')
        break;
    }
  } else{
    await User.updateOne({'uemail':email,'pinned':sculs_id},{$pull:{'pinned':sculs_id}})
    console.log('unpined!!')
    // console.log(udoc)
    let resultcount = pincount['pinnedcount'] - 1;
    await Scholarship.updateOne({'_id':sculs_id},{$set:{'pinnedcount':resultcount}})
    switch(whatpage){
      case 'page0':
        res.redirect('/users/pinscholarship')
        break;
      case 'page1':
        res.redirect('/users/scholarship')
        break;
    }
  }
})


router.get('/pinscholarship',isLoggedIn,async (req,res) =>{
  const email = await req.user.email
  let scholarship_id = await User.findOne({'uemail':email}).exec()
  let id_list = scholarship_id['pinned']
  console.log(id_list)
  await Scholarship.find({'_id':id_list}).exec().then((saerch_result)=>{
    console.log(saerch_result)
    res.render('scholarship/pinscholarship',{scholarships:saerch_result})
  })
})



router.post('/useredit', async (req,res) => {
  const edit_id = await req.body.edit_id
  let l_stype = await Type.distinct('scholarship_type').exec()
  let l_facu = await Major.distinct('faculty').exec()
  let l_branch = await Major.distinct('branch').exec()
  console.log(edit_id)
  await User.findOne({'_id':edit_id}).exec().then((doc,err) => {
      res.render('loginsystem/editprofile',{userdata:doc,scholarshipstype:l_stype,l_facu:l_facu,l_branch:l_branch})
  })
})

router.post('/userupdate',(req, res) =>{
  const update_id = req.body.update_id
  let data = {
      ufname:req.body.ufname,
      ulname:req.body.ulname,
      ufaculty:req.body.ufaculty,
      ubranch:req.body.ubranch,
      uclass:req.body.uclass,
      ugpa:req.body.ugpa,
      utoeic:req.body.utoeic,
      uielts:req.body.uielts,
      utoefl:req.body.utoefl,
      phonenumber:req.body.phonenumber,
      ustype:req.body.ustype,
  }
  User.findByIdAndUpdate(update_id,data).exec().then((err) => {
      res.redirect('/users/protected')
      console.log('Edited!!')
  })
})


module.exports = router;
