//initial Setup
var express = require("express");
var app = express();

app.set("view engine", "ejs");

//data
var footballers = [
        {name: "Hagi", image: "https://s1.fifaaddict.com/fo4/players/qzgvrvrj.png?20181121"},
        {name: "Bulent", image: "http://s.weltsport.net/bilder/spieler/gross/1520.jpg"}
    ]

//routers
app.get("/", function(req, res){
   res.redirect("footballers"); 
});

app.get("/footballers", function(req, res){
   res.render("footballers", {footballers: footballers}); 
});

//server code
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server has started..."); 
});