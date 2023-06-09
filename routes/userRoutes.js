const { readUser, readUsers, register, login, continueWithGoogle, handleAccount, updateUser, deleteUser, destroyUsers, searchUser } = require("../controllers/userController")
const { limiter } = require("../middlewares/limiter")

const router = require("express").Router()

router
    .get("/", limiter, readUsers)
    .post("/register", register)
    .post("/login", login)
    .post("/continue-with-google", continueWithGoogle)
    .put("/account/:id", handleAccount)
    .put("/update/:id", updateUser)
    .delete("/destroy", destroyUsers)
    .delete("/:id", deleteUser)
    .post("/search", searchUser)
    .get("/:id", readUser)


module.exports = router