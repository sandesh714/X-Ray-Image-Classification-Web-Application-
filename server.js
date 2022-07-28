const express = require("express");
const multer = require("multer");
const path = require("path")
const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")
app.use(express.static('public'));


app.get('/', async(req, res) => {
    res.render('index');
})



app.listen(3000, () =>{
    console.log("Server started on port 3000...")
})



