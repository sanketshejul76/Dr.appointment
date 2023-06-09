const { registerEmployee, getEmployee, getEmployees, destroy, getDoctors, employeeLogin, getBookings } = require("../controllers/employeeController")
const { authProtected } = require("../middlewares/auth")

const router = require("express").Router()

router
    .get("/", getEmployees)
    .get("/doctors", getDoctors)
    .get("/bookings", authProtected, getBookings)
    .post("/register", registerEmployee)
    .post("/login", employeeLogin)
    .delete("/destory", destroy)
    .get("/:eid", getEmployee)


module.exports = router