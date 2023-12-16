const mongoose = require("mongoose");

const ScanSchema = mongoose.Schema({
    flag: { type: String },
    ShodanData: {
        Vulns: [String], 
        ports: [String],
        city: String, 
        isp: String, 
        asn: String, 
        hostnames: [String], 
        domains: [String], 
        countryCode: String, 
        org: String ,
        ip:String,
        domain:String
    }
});

const Scan = mongoose.model('Scan', ScanSchema);

module.exports = {Scan};
