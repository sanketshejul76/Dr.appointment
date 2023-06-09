const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    education: [
        {
            name: {
                type: String
            },
            year: {
                type: Date
            },
            college: {
                type: String
            }
        }
    ],
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    mobile: {
        type: String,
    },
    address: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ["doctor", "employee"],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("employee", employeeSchema)
// faker.js
// full calender
// date fns
// errorboundary