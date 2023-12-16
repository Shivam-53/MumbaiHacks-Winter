const { Scan } = require("../models/scan");
const axios = require("axios");
const dotenv = require("dotenv");
const dns = require("dns");
dotenv.config();

const ipAddressRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const createShodanData = async (req, res) => {
    try {
        const flag = req.body.flag;
        let target = req.body.domain || process.env.ip;

        if (ipAddressRegex.test(target)) {
            await runShodanWithIP(target, flag, res);
        } else {
            dns.resolve4(target, async (err, addresses) => {
                let domainn=target;
                if (err) {
                    console.error("Error resolving domain to IP:", err);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                const ip = addresses[0]; 
                await runShodanWithIP(ip, flag, res,domainn);
            });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// const runShodanWithIP = async (ipp, flag, res,domainn) => {
//     const apiKey = "0y7814hB8TSUD7vJjdL4AJYq71JC2PqE";
//     const url = `https://api.shodan.io/shodan/host/${ipp}?key=${apiKey}`;

//     try {
        
//         const response = await axios.get(url);
//         const shodanData = {
//             Vulns: response.data.vulns,
//             ports: response.data.ports,
//             city: response.data.city,
//             isp: response.data.isp,
//             asn: response.data.asn,
//             hostnames: response.data.hostnames,
//             domains: response.data.domains,
//             countryCode: response.data.country_code,
//             org: response.data.org,
//             ip: response.data.ip_str,
//             domain: ipp ,
//             domainn:domainn // Assuming for IP, domain will also be the IP address
//         };

//         const newScan = new Scan({
//             flag: flag,
//             patchFlag:true,
//             ShodanData: shodanData
//         });

//         const savedScan = await newScan.save();
//         console.log("Scan data saved:", savedScan);
//         res.status(200).json({ message: 'Scan data saved successfully!' });
//     } catch (error) {
//         console.error("Error fetching Shodan data:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


const runShodanWithIP = async (ipp, flag, res, domainn) => {
    const apiKey = "0y7814hB8TSUD7vJjdL4AJYq71JC2PqE";
    const url = `https://api.shodan.io/shodan/host/${ipp}?key=${apiKey}`;

    try {
        const response = await axios.get(url);

        // Extracting CVE details from the Shodan API response
        //console.log(response.data.data[1].vulns)
        console.log(response)
        const cveDetails = response.data.data[1].vulns;
        console.log(cveDetails,"cveee")
        // Extracting references from the CVE details
        const references = Object.keys(cveDetails).map(cve => ({
            CVE: cve,
            references: cveDetails[cve].references,
            summary:cveDetails[cve].summary
        }));
        console.log("referencessss",references)

        const shodanData = {
            Vulns: response.data.data[1].vulns, // Storing references in the Vulns array
            ports: response.data.ports,
            city: response.data.city,
            isp: response.data.isp,
            asn: response.data.asn,
            hostnames: response.data.hostnames,
            domains: response.data.domains,
            countryCode: response.data.country_code,
            org: response.data.org,
            ip: response.data.ip_str,
            domain: ipp,
            domainn: domainn // Assuming for IP, domain will also be the IP address
        };

        const newScan = new Scan({
            flag: flag,
            patchFlag: true,
            wordpress:false,
            ShodanData: shodanData
        });

        const savedScan = await newScan.save();
        console.log("Scan data saved:", savedScan);
        res.status(200).json({data:newScan });
    } catch (error) {
        console.error("Error fetching Shodan data:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getShodanData = async (req, res) => {
    try {
        const Data = await Scan.find({});
        res.json({ Data });
        console.log(Data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




const findByquery = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("ID:", id);

        const foundData = await Scan.findOne({ query: id });
        if (foundData) {
            res.json({ data: foundData });
        } else {
            res.json({ msg: "The given ID does not exist" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// const addPortssData = async (req, res) => {
//     console.log("heheh");
//     try {
//         const query = req.params.id;
//         console.log(typeof(query),"--------------------->")
//         const portssData = req.body.portssData; // Assuming portssData is an array of objects
//         console.log(query)
//         const foundScan = await Scan.findOne({ query });
//         console.log(foundScan)
//         if (!foundScan) {
//             res.status(404).json({ message: 'Scan not found' });
//             return;
//         }

//         // Assuming 'Portss' is an array within the document and you want to replace with new data
//         foundScan.Portss = portssData;

//         const updatedScan = await foundScan.save();

//         res.status(200).json({ message: 'Portss data added successfully!', updatedScan });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


const addPortssData = async (req, res) => {
    console.log("heheh");
    try {
        const query = req.params.id;
        console.log(query,"hyeyeyyyyey")
        if (!query) {
            res.status(400).json({ message: 'Invalid ID provided' });
            return;
        }

        console.log(typeof(query), "--------------------->");
        const portssData = req.body.portssData; // Assuming portssData is an array of objects
        console.log(query);
        const foundScan = await Scan.findOne({ query });
        console.log(foundScan);
        if (!foundScan) {
            res.status(404).json({ message: 'Scan not found' });
            return;
        }

        // Assuming 'Portss' is an array within the document and you want to replace it with new data
        foundScan.Portss = portssData;

        const updatedScan = await foundScan.save();

        res.status(200).json({ message: 'Portss data added successfully!', updatedScan });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createShodanData, getShodanData, findByquery,addPortssData};
