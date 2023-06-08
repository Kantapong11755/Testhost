const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Type = require('../models/Type');
const Major = require('../models/Major');
const passport = require('passport');
const session = require('express-session')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const async = require('hbs/lib/async');
const saltRounds = 10;
require('../passport-setup')
const Scholarship = require('../models/Scholarship')


router.get('/list',(req,res) => {
    Scholarship.find().limit(80).exec().then((doc,err) => {
        res.render('admins/scholarshiplist',{scholarships:doc})
    })
})


router.get('/insertdata', async (req, res, next) => {
    let l_stype = await Type.distinct('scholarship_type').exec()
    let l_facu = await Major.distinct('faculty').exec()
    let l_branch = await Major.distinct('branch').exec()
        res.render('admins/insertscholarship',{scholarshipstype:l_stype,l_facu:l_facu,l_branch:l_branch})
  })


router.post('/insert',(req, res, next) =>{
    let data = new Scholarship({
        sid:req.body.sid,
        sname:req.body.sname,
        stype:req.body.stype,
        opendate:req.body.opendate,
        closedate:req.body.closedate,
        sfaculty:req.body.sfaculty,
        sclass:req.body.sclass,
        sbranch:req.body.sbranch,
        sgpa:req.body.sgpa,
        country:req.body.country,
        university:req.body.university,
        costoflive:req.body.costoflive,
        costoflean:req.body.costoflean,
        costofabode:req.body.costofabode,
        stoeic:req.body.stoeic,
        sielts:req.body.sielts,
        stoefl:req.body.stoefl,
        sgiver:req.body.sgiver,
        url:req.body.url,
        pinnedcount:req.body.pinnedcount,
        scrapdate:req.body.scrapdate
    })
    Scholarship.saveScholarship(data)
        res.redirect('/')
        console.log('insert success!!')
})


router.put('/:id', async (req, res, next) =>{
    let updateSchoolars = await Scholarship.findByIdAndUpdate(req.params.id, req.body);
    res.json(updateSchoolars);
})

router.get('/filter',async (req,res)=> {
let l_stype = await Scholarship.distinct('stype').exec()
  let l_facu = await Major.distinct('faculty').exec()
  let l_branch = await Major.distinct('branch').exec()
  let l_uni = await Scholarship.distinct('university').exec()
  let l_country = await Scholarship.distinct('country').exec()

  res.render('admins/filter',{scholarshipstype:l_stype,scholarshipsfacu:l_facu,scholarshipsbranch:l_branch,scholarshipsuni:l_uni,l_country:l_country})
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

    console.log(ft_sclass) 
    // await Scholarship.find({stype:{$in:ft_stype},sfaculty:{$in:ft_facu},sbranch:{$in:ft_branch},university:ft_uni,sgpa:{$lte:ft_gpa}}).exec().then((doc)=> {
    //     res.render('admins/resultfilter',{scholarships:doc})
    //     // res.send(doc)
    //     console.log(doc)
    // })
    await Scholarship.find({stype:ft_stype,sfaculty:{$in:ft_facu},sbranch:{$in:ft_branch},university:ft_uni,sgpa:{$lte:ft_gpa},sclass:ft_sclass,country:ft_country}).exec().then((doc)=> {
        res.render('admins/resultfilter',{scholarships:doc})
        // res.send(doc)
        // console.log(doc)
    })
    console.log(ft_stype)

    // console.log(ft_facu)
    // console.log(ft_branch)
    // console.log(ft_uni)
    // console.log(ft_gpa) 
  })

router.get('/delete/:id',(req,res) => {
    Scholarship.findByIdAndDelete(req.params.id).exec()
        res.redirect('/scholarships/list')
        console.log('deleted!!')
})


router.post('/edit',(req,res) => {
    const edit_id = req.body.edit_id
    Scholarship.findOne({_id:edit_id}).exec().then((doc,err) => {
        res.render('admins/editscholarship',{scholarships:doc})
    })
})


router.post('/update',(req, res) =>{
    const update_id = req.body.update_id
    let data = {
        sid:req.body.sid,
        sname:req.body.sname,
        stype:req.body.stype,
        opendate:req.body.opendate,
        closedate:req.body.closedate,
        sfaculty:req.body.sfaculty,
        sbranch:req.body.sbranch,
        sclass:req.body.sclass,
        sgpa:req.body.sgpa,
        country:req.body.country,
        university:req.body.university,
        costoflive:req.body.costoflive,
        costoflean:req.body.costoflean,
        costofabode:req.body.costofabode,
        stoeic:req.body.stoeic,
        sielts:req.body.sielts,
        stoefl:req.body.stoefl,
        sgiver:req.body.sgiver,
        url:req.body.url,
        pinnedcount:req.body.pinnedcount,
        scrapdate:req.body.scrapdate
    }
    Scholarship.findByIdAndUpdate(update_id,data).exec().then((err) => {
        res.redirect('/scholarships/list')
        console.log('Edited!!')
    })
})


router.get('/users/delete/:id',(req,res) => {   //delete
    User.findByIdAndDelete(req.params.id).exec()
        res.redirect('/scholarships/userlist')
        console.log('User deleted!!')
})


router.get('/userlist',(req,res) => {
    User.find().exec().then((doc,err) => {
        res.render('admins/userlist',{userdata:doc})
    })
})


router.get('/thisuser/:id',(req,res) => {
    const this_id = req.params.id
    User.findOne({_id:this_id}).exec().then((doc,err) => {
        console.log(doc)
        res.render('admins/thisuser',{userdata:doc})
    })
})


router.get('/this/:id',(req,res) => {
    const this_id = req.params.id
    Scholarship.findOne({_id:this_id}).exec().then((doc,err) => {
        console.log(doc)
        res.render('admins/thisscholarship',{scholarships:doc})
    })
})


router.post('/addcomptype',async (req,res)=>{
    const id = '6448df9b06e8692cf6283779'
    let scholarship_type = await req.body.scholarship_type
    let compdoc = await Type.findOne({_id:id,scholarship_type:scholarship_type}).exec()
    if(compdoc != null){
        console.log('this type is have in database !!')
        res.redirect('/scholarships/addcomp')
    }else{
        await Type.updateOne({_id:id},{$push:{scholarship_type:scholarship_type}})
        console.log('Add type success !!!')
        res.redirect('/scholarships/addcomp')
    }
    // console.log(scholarship_type)
    // console.log(compdoc)
})


router.post('/addcompfaculty',async (req,res)=>{
    let data = new Major({
        faculty:req.body.faculty,
        branch:[]
    })
    let check = await Major.findOne({faculty:data['faculty']}).exec()
    // console.log(check)
    if(check != null ){
        res.send('this faculty is have !!')
    }else{
        Major.savemajor(data);
        console.log('new faculty success!!')
        res.redirect('/scholarships/addcomp')
    }
})


router.post('/addcompbranch',async (req,res)=>{
    let branch = await req.body.branch
    let faculty_id = await req.body.faculty_id
    let branchdoc = await Major.findOne({_id:faculty_id,branch:branch}).exec()
    console.log(branchdoc)
    console.log(branch)
    console.log(faculty_id)
    if(branchdoc != null){
        res.send('this data is have !!')
        console.log('This branch is have !!')
    }else{
        await Major.updateOne({_id:faculty_id},{$push:{branch:branch}})
        console.log('Add new branch !!')
        res.redirect('/scholarships/addcomp')
    }
})


router.post('/selectbranch', async (req,res) =>{
    let selcter = await req.body.branchselect
    let faculty_list = await Major.findOne({faculty:selcter}).distinct('branch').exec()
    console.log(faculty_list)
    if(faculty_list != ''){
        res.render('admins/deletebranch',{faculty_list:faculty_list,selcter:selcter})
    }else{
        res.send('this faculty not this branch')
    }
})


router.get('/addcomp', async(req,res)=>{
    let majordoc = await Major.find().exec()
    let majordocs = await Major.find().exec()
    let listtype = await Type.distinct('scholarship_type').exec()

    res.render('admins/addcomp',{faculty:majordoc,listtype:listtype,facultys:majordocs})
    console.log(majordoc)
})


router.post('/typedelete', async(req,res) => {   //delete
    let type_name = await req.body.nametype
    await Type.updateOne({scholarship_type:type_name},{$pull:{scholarship_type:type_name}})
    console.log(type_name)
    res.redirect('/scholarships/addcomp')
})


router.post('/facultydelete', async(req,res) => {   //delete
    let facultyname = await req.body.facultyname
    await Major.deleteOne({faculty:facultyname})
    res.redirect('/scholarships/addcomp')
    console.log('faculty deleted!!')
})


router.post('/branchdelete', async(req,res) => {   //delete
    let branchname = await req.body.branchname
    let facultyname = await req.body.facultyname
    // console.log(branchname)
    // console.log(facultyname)
    await Major.updateOne({faculty:facultyname},{$pull:{branch:branchname}})
    res.redirect('/scholarships/addcomp')
    console.log('branch deleted!!')
})


module.exports = router;