const {Scan} = require("../models/scan");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


const createShodanData = async (req, res) => {
    try {

        const flag = req.body.flag;
        const ip = req.body.ip || process.env.ip ;
        const apiKey = "0y7814hB8TSUD7vJjdL4AJYq71JC2PqE";
        const url = `https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`;

        axios({
            method: 'get',
            url: url,
        }).then(function (response) {
            console.log("this is res",response)
            const shodanData = {
                Vulns: response.data.vulns,
                ports: response.data.ports,
                city: response.data.city,
                isp: response.data.isp,
                asn: response.data.asn,
                hostnames: response.data.hostnames,
                domains: response.data.domains,
                countryCode: response.data.country_code,
                org: response.data.org,
                ip:response.data.ip_str,
                domain:ip
            };

            // Creating a new Scan document with Shodan data
            const newScan = new Scan({
                flag: flag,
                ShodanData: shodanData
            });

            // Save the new document to the database
            newScan.save()
                .then(savedScan => {
                    console.log("Scan data saved:", savedScan);
                    res.status(200).json({ message: 'Scan data saved successfully!' });
                })
                .catch(err => {
                    console.error("Error saving scan data:", err);
                    res.status(500).json({ error: 'Internal server error' });
                });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getShodanData=async(req,res)=>{
    const Data=await Scan.find({});
        res.json({Data});
        console.log(Data)
        
}



module.exports = {createShodanData,getShodanData};