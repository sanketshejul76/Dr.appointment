const asyncHandler = require("express-async-handler")
const Appointmnet = require("../models/Appointmnet")
const { format, compareAsc } = require("date-fns")
exports.bookAppointment = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const result = await Appointmnet.create({
        ...req.body,
        bookingDate: new Date(`${req.body.date} ${req.body.time}`)
    })
    res.json({ message: "Booking Success", result })
})
exports.getAppointments = asyncHandler(async (req, res) => {
    const result = await Appointmnet.find()
        .populate("userId", "name mobile")
        .populate("doctorId", "name")
        .sort({ createdAt: -1 })

    const resultData = []
    result.forEach(item => {
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
        message: "all appointments fetch success",
        result: resultData
        // result: {
        //     ...resultData,
        //     date: format(new Date("2022/05/27"), "d/MMMM/yyyy"),
        //     time: format(new Date(), "hh:mm:ss"),
        // }
    })
})
exports.getAppointment = asyncHandler(async (req, res) => {
    const result = await Appointmnet.findOne({ _id: req.params.aid })
    res.json({ message: "appointment deatail fetch  success", result })
})
exports.destroyAppointments = asyncHandler(async (req, res) => {
    const result = await Appointmnet.deleteMany()
    res.json({ message: "appointments destroy success", result })
})
exports.deleteAppointment = asyncHandler(async (req, res) => {
    const result = await Appointmnet.findByIdAndDelete(req.params.id)
    res.json({ message: "appointments delete success", result })
})
exports.doctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const result = await Appointmnet.find({ doctorId })
    res.json({ message: "appointments fetch success", result })
})
exports.userAppointments = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const result = await Appointmnet.find({ userId })
    res.json({ message: "appointments fetch success", result })
})

