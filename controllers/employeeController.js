const asyncHandler = require("express-async-handler")
const Employee = require("../models/Employee")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Appointmnet = require("../models/Appointmnet")
const { format } = require("date-fns")
exports.registerEmployee = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const found = await Employee.findOne({ email })
    if (found) {
        return res.status(400).json({ message: "email aready exist" })
    }
    const hashPass = bcrypt.hashSync(password, 10)

    const result = await Employee.create({ ...req.body, password: hashPass })
    res.json({
        message: "employee register success"
    })
})
exports.getEmployees = asyncHandler(async (req, res) => {
    const result = await Employee.find()
    res.json({
        message: "employees fetch success",
        result
    })
})
exports.getEmployee = asyncHandler(async (req, res) => {
    const result = await Employee.findOne({ _id: req.params.eid })
    res.json({
        message: "employee detail fetch success",
        result
    })
})
exports.getDoctors = asyncHandler(async (req, res) => {
    const result = await Employee.find({ role: "doctor" }).select("name category")
    res.json({
        message: "dector fetch success",
        result
    })
})
exports.destroy = asyncHandler(async (req, res) => {
    const result = await Employee.deleteMany()
    res.json({
        message: "employee destroy success",
        result
    })
})
exports.employeeLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const found = await Employee.findOne({ email })
    if (!found) {
        return res.status(400).json({ message: "email not found" })
    }
    const verify = bcrypt.compareSync(password, found.password)
    if (!verify) {
        return res.status(400).json({ message: "invalid password" })
    }
    const token = jwt.sign({ id: found._id, role: found.role }, process.env.JWT_KEY)
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
exports.getBookings = asyncHandler(async (req, res) => {

    if (!req.body.doctorId) {
        return res.status(401).json({
            message: "unauthorized. Doctor Only Rourte"
        })
    }
    const result = await Appointmnet
        .find({ doctorId: req.body.doctorId })
        .populate("userId", "name")
    const events = result.map(item => {
        return {
            title: item.comment || item.userId,
            date: format(new Date(item.bookingDate), "yyyy-MM-dd")
        }
    })
    const today = result.filter(item => {
        if (format(new Date(item.bookingDate), "dd") === format(new Date(), "dd")) {
            return item
        }
    })

    res.json({
        message: "fetch doctor appoinments success",
        result: {
            events,
            todayBookings: today
        }
    })
})

