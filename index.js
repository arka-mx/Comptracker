const express = require("express")
const path = require("path")
const port =3000;
const app = express();
const login = require("./routes/login.js")
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/login",login);
app.get("/",(req,res)=>{
    res.render("home.ejs")
})
app.get("/dashboard",(req,res)=>{
    res.render("dashboard.ejs")
})
app.listen(port,()=>{
    console.log("Running index.js on port "+port)
})