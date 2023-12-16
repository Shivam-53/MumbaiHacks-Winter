const cors = require("cors");
const express = require("express");
const router = express.Router();

router.use(cors());

const { createShodanData, getShodanData, findByquery ,addPortssData } = require("../controllers/shodan");

router.post("/scan", createShodanData);
router.get("/", (req, res) => {
    res.send("this is shivams pc")
})
router.get("/shodanData", getShodanData)
router.get("/findId/:id", findByquery)
router.patch("/nmapData/:id",addPortssData)
module.exports = { router };
