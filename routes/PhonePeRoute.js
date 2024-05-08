const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const { request } = require("http");


function generateTransactionID(){
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random()*1000000);
    const merchantPrefix = 'T';
    const transactionID = `${merchantPrefix}${timestamp}${randomNum}`;
    return transactionID;
}


//payment route

router.post("/payment", async (req, res) => {
    try {
        const { name, number, amount } = req.body;
        const data = {
            merchantId: 'PGTESTPAYUAT',
            merchantTransactionId: generateTransactionID(), // Call the function to generate transaction ID
            merchantUserId: 'MUID123',
            name: name,
            amount: 1 * 100,
            redirectUrl: `https://localhost:3002/api/phonepe/status`,
            redirectMode: 'POST',
            mobileNumber: number,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        const keyIndex = 1;
        const string = payloadMain + 'pg/v1/pay' + key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

        const options = {
            method: 'POST',
            url: URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options)
            .then(function (response) {
                console.log(response.data);
                res.status(200).send(response.data); // Send response back to client
            })
            .catch(function (error) {
                console.error(error);
                res.status(500).send(error.message); // Send error response back to client
            });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
});

// payment status

router.post('/status', async (req, res) => {
    const merchantTransactionId = req.body.transactionId;
    const merchantId = req.body.merchantId;
    const keyIndex = 1;
    const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const options = {
        method: 'GET',
        url: URL,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': merchantId
        },
    };

    axios.request(options).then(async(response)=>{
        console.log(response)
    }).catch((error)=>{
        console.error(error);
    })
});

module.exports = router;
