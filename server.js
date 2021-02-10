var express = require('express');
var app = express();
var port = process.env.port || 2255;
var request = require('request');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

app.set('Views', __dirname + '/Views');
app.set('view engine', 'ejs');
app.set('Views',path.join(__dirname,'Views'));
//app.use(express.static("public")); 
// app.set('js', __dirname + '/js');
// app.set('js',path.join(__dirname,'js'));
// app.use('/js', express.static('pure cloud report'))
 app.get('/', (req, res) => {
  app.use(express.static("public")); 
   var now = new Date(); 
   var isoDate = new Date(now).toISOString();
    //OUTPUT : 2015-02-20T13:59:31.238Z 
    console.log("isoDate :"+isoDate);
  //  var name = req.body.bar
        //   var name =  req.body.name ;
        //   console.log("name"+name);
        //  res.sendFile( path.join(__dirname, './controller/welcome.html') )
         // var name = 'hello';
          //res.sendFile(__dirname , './controller/welcome.html', {name:name});
          return res.render('home',{title : "Tonik"});
          
         // res.render(__dirname + "./controller/welcome.html", {name:name});
        });


// app.use(express.static( path.join(__dirname, './controller/') ))
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app .get('/', (req, res) => {
//       res.name = "manoj";
//       res.sendFile( path.join(__dirname, './controller/welcome.html') )
//       var name = 'hello';
//       //res.sendFile(__dirname , './controller/welcome.html', {name:name});
//       res.render(__dirname + "./controller/welcome.html", {name:name});
//     });

//     module.exports = {
//         entry: './controller/index.js',
//         output: {
//           path: path.resolve(__dirname, './controller'),
//           filename: 'server.js'
//         },
//         node: {
//             __dirname: false,
//           },
//         mode: 'production',
//         devtool: false,
//         target: 'node',
//         externals: [nodeExternals({
//               modulesFromFile: true,
//           })],
//       }




var productController = require('./controller/productController')();



var bodyParser = require('body-parser');
const { response } = require('express');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json());


// app.get('/emergency/:', function (req, res, next) 
// { var id = req.params.id; console.log('The id: ' + id); });
app.use("/cloud", productController);

app.use(function(req, res, next) { 
res.header("Access-Control-Allow-Origin", "*"); 
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
next(); 
});

// app.get('/ticketing/:id', function (req, res, next){
//     console.log(req.params.id);
//     res.send({"message :":"success"})
// });


// function handleTokenCallback(body) {
    
//     console.log("body token request :"+JSON.stringify(body));
//     app.use("/leadupload", productController);
    
//     // var options = {
//     //     url: 'https://api.mypurecloud.com/api/v2/authorization/roles',
//     //     headers: {
//     //         'Authorization': body.token_type + " " + body.access_token
//     //     }
//     // };

//     // request(options, function (error, response, body) {
//     //     if (!error && response.statusCode == 200) {
//     //         console.log(JSON.stringify(JSON.parse(body), null, 2));
//     //     } else {
//     //         console.log(error)
//     //     }
//     // });
// }
// var htmlpath = require('./controller/')();
// app.get("/",(req, res) => {
//     res.sendFile(__dirname  + "./controller/welcome.html");
// });
app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + "Started at :- " + datetime;
    console.log(message);
});
