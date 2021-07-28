const express = require('express');
const https = require('https');
app = express();
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));     // new way to use body-parser This should not introduce any breaking changes into your applications since the code in express.json() is based on bodyparser.json().
app.use(express.json());
const secrets = require("./secrets.js")  

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;

  var data = {
    members: [{
       email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME:fname,
        LNAME:lname
      }
    }]
  };
  var jsonData = JSON.stringify(data);

  var url = "https://us6.api.mailchimp.com/3.0/lists/" + secrets.listID();
  var option = {
    method: "POST",
    headers: {
      "Authorization": "PulkitPandey " + secrets.apiKey(),
    },
    body: jsonData
  };


  const request = https.request(url, option, function(response) {

    console.log(response.statusCode);
    if(response.statusCode == 200)
    {
      res.sendFile(__dirname + "/success.html")
    }
    else{
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data) {
      //console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();

});

app.post("/backToMain", function (req,res){
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("server running");
})

