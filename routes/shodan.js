const cors = require("cors");
const express = require("express");
const router = express.Router();

router.use(cors());

const { createShodanData ,getShodanData} = require("../controllers/shodan");

router.post("/scan", createShodanData);
router.get("/",(req,res)=>{
    res.send("this is shivams pc")
})
router.get("/shodanData",getShodanData)
module.exports = {router};
