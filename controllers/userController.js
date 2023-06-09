const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const Appointmnet = require("../models/Appointmnet")
const { format, compareAsc } = require("date-fns")
exports.register = asyncHandler(async (req, res) => {
    // validation
    const { password, email } = req.body
    const found = await User.findOne({ email })
    if (found) {
        return res.status(400).json({
            message: "email already exist"
        })
    }
    const hashPass = bcrypt.hashSync(password, 10)
    const result = await User.create({ ...req.body, password: hashPass, role: "user" })
    res.json({
        message: "user register success"
    })
})
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const found = await User.findOne({ email })
    if (!found) {
        return res.status(400).json({ message: "email not found" })
    }
    const verify = bcrypt.compareSync(password, found.password)
    if (!verify) {
        return res.status(400).json({ message: "invalid password" })
    }
    const token = jwt.sign({ id: found._id, role: found.role }, process.env.JWT_KEY)
    // res.cookie("token", token, {})
    res.cookie("token", token)
    res.json({
        message: "user login success",
        result: {
            id: found._id,
            name: found.name,
            email: found.email,
            role: found.role
        }
    })
})
exports.continueWithGoogle = asyncHandler(async (req, res) => {
    res.json({
        message: "continue with google success"
    })
})
exports.handleAccount = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await User.findByIdAndUpdate(id, { active: req.body.active }, { new: true })
    res.json({
        message: "account block/unblock success",
        result
    })
})
exports.readUsers = asyncHandler(async (req, res) => {
    const result = await User.find()
    res.json({
        message: "all user fetch success",
        result
    })
})
exports.readUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await User.findById(id)
    if (!result) {
        res.status(400).json({
            message: "invalid id"
        })
    }
    res.json({
        message: "user fetch success",
        result
    })
})
exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await User.findByIdAndUpdate(id, req.body, { new: true })
    if (!result) {
        res.status(400).json({
            message: "invalid id"
        })
    }
    res.json({
        message: "user update success",
        result
    })
})
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await User.findByIdAndDelete(id)
    if (!result) {
        return res.status(400).json({
            message: "invalid id"
        })
    }
    res.json({
        message: "user delete success"
    })
})
exports.destroyUsers = asyncHandler(async (req, res) => {
    const result = await User.deleteMany()
    res.json({
        message: "user destroy success",
        result
    })
})
exports.searchUser = asyncHandler(async (req, res) => {
    // const result = await Appointmnet.find({ name: { $regex: req.body.term } })
    const result = await Appointmnet
        .find()
        .populate("doctorId")
        .populate({
            path: "userId",
            match: { name: { $regex: req.body.term } }
        })
        .sort({ createdAt: -1 })
    const filtered = result.filter(item => item.userId !== null)


    const resultData = []
    filtered.forEach(item => {
        resultData.push({
            _id: item._id,
            name: item.userId.name,
            doctor: item.doctorId.name,
            status: item.status,
            date: format(new Date(item.bookingDate), "dd/MM/yyyy"),
            time: format(new Date(item.bookingDate), "hh:mm"),
            isActive: compareAsc(new Date(), item.bookingDate) === -1 ? true : false
        })
    })
    res.json({
        message: "user search success",
        filtered,
        result: resultData
    })
})