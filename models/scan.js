const mongoose = require("mongoose");
const counter = require("../models/counter");
const { boolean } = require("webidl-conversions");

const ScanSchema = mongoose.Schema({
    flag: { type: String },
    query: {type:Number,default:0},
    wordpress:{type:Boolean,default:false},
    patchFlag:{type:Boolean,default:false},
    ShodanData: {
        Vulns: [Object],
        ports: [String],
        city: String,
        isp: String,
        asn: String,
        hostnames: [String],
        domains: [String],
        countryCode: String,
        org: String,
        ip: String,
        domain: String
    },
    Portss:[
      {
        port: String,
        service: String,
        version: String
    }
]
});

ScanSchema.pre("save", async function (next) {
    try {
        if(this.patchFlag){

        console.log("Hey, I'm in ScanSchema.pre middleware");
        if (!this.query) {
            const counterData = await counter.findOneAndUpdate(
                { query: '1' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            console.log(this.query,"query iss")
            this.query = counterData.seq;
        }

        next();
    }
    } catch (error) {
        next(error);
    }
});

const Scan = mongoose.model('Scan', ScanSchema);

module.exports = { Scan };
