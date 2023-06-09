const { getAppointment, getAppointments, bookAppointment, destroyAppointments, doctorAppointments, userAppointments, deleteAppointment } = require("../controllers/appointmentController")
const { authProtected } = require("../middlewares/auth")

const router = require("express").Router()

router
    .get("/", getAppointments)
    .get("/:aid", getAppointment)
    .post("/book", authProtected, bookAppointment)
    .delete("/destroy", destroyAppointments)
    .get("/doctor/:doctorId", doctorAppointments)
    .get("/user/:userId", userAppointments)
    .get("/delete/:id", deleteAppointment)


module.exports = router