require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
const cors = require("cors");
const cookiParser = require("cookie-parser")
const dbConfig = require("./db/db.config");
const mongoose = require("mongoose");
const path = require('path');

console.log("mongoose",dbConfig.URI )

mongoose.connect(dbConfig.URI, {
    serverSelectionTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on("error", (error) => {
    console.log(error);
    console.log("Error while connecting to db");
  });
  db.once("open", () => {
    console.log("connected to db");
  });

// app.get("/",(req,res)=>{
//     res.status(201).json("server created")
// });

app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use(router);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});