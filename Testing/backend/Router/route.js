const express = require("express");
const router = express.Router();
const AxessTechnology = require("../TaskControl/Control.js")
const HomepageContact =require("../TaskControl/HomepageContact.js")


router.post("/api/register", AxessTechnology.Register)
router.post("/api/login" , AxessTechnology.loginpost)
router.get("/:id/verify/:token", AxessTechnology.verifyEmail)
//homepage contact from:
router.post("/api/contact", HomepageContact.Contactpostmethod)


module.exports = router;