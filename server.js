const express = require("express");
const app = express();
const port = 3002;
const cors = require("cors");
app.use(express.json());
app.use(cors());


//Phone pe route
const phonepeRoute = require("./routes/PhonePeRoute");
app.use("/api/phonepe",phonepeRoute);



app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})