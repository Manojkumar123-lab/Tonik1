var express = require('express');
const { post } = require('request');
var router = express.Router();
var request = require('request');
var app = express();
var sleep = require('system-sleep');
var path = require('path');
app.set('Views', __dirname + '/Views');

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'));

//var sql = require("mssql");
//var conn = require("../connection/connection")();
var requestbody = null;

var tokenobject = "";
var token = "";
var tokentype = "";
var userId = '';
var userIdArray = [];
var EvaluatoionIdArray = [];
var scoreArray = [];
var userboolean = false;
var i = 0;
var k = 0;
var evaluateridvalue = ""
var routes = function () {
    router.route('/report')
        .post(function (req, res) {
            var reportrequestbody = req.body.bar;
            var trimh = reportrequestbody.trim();
            var obj = JSON.parse(trimh);
           // console.log("reportrequestbody"+reportrequestbody);
            console.log("trimh :"+trimh);
            console.log('req body: ' + obj);
            //requestbody = req.body;
            // requestbody = [{
            //     "interval": "2021-01-28T18:30:00.000Z/2021-01-29T18:30:00.000Z",
            //     "order": "asc",
            //     "orderBy": "conversationStart",
            //     "paging": {
            //         "pageSize": 25,
            //         "pageNumber": 1
            //     }
            // }] 
            
            requestbody = obj;

            secret = "WZtz-wWkRSx1BpiBsEugNDG35wgEaU6o5ACbK36CbSo";
            id = "3b807f76-5ef5-4287-9846-6ab1b227f0ec";

            request.post({ url: 'https://login.mypurecloud.com/oauth/token', form: { grant_type: 'client_credentials' } }, function (err, httpResponse, body) {
                if (err == null) {

                    console.log("body token request :" + JSON.stringify(body));
                    tokenobject = JSON.parse(body);
                    token = tokenobject.access_token;
                    tokentype = tokenobject.token_type;
                    console.log("token :" + token);
                    console.log("tokentype :" + tokentype);
                    handleTokenCallback(token, tokentype, requestbody);
                }

            }).auth(id, secret, true)

            function handleTokenCallback(token, tokentype, requestbody) {

                var url = "https://api.mypurecloud.com/api/v2/analytics/conversations/details/query";
                request({
                    url: url,
                    headers: {
                        'Authorization': tokentype + " " + token
                    },
                    json: true,
                    method: "POST",
                    json: requestbody[0],
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        //console.log(body);
                        reportdata = body;
                        // res.send(body["conversations"][0]["participants"][0]["userId"]);
                        //console.log("conversations :" + JSON.stringify(body["conversations"][0]["participants"][0]["userId"]));
                        //  var userId = "56ac3380-ef23-46ac-a07d-a01df1b09305";
                        //body["conversations"].forEach(element => {
                        getUsernNames();
                        function getUsernNames() {
                            if (i < reportdata["conversations"].length) {
                                //console.log("users id: " + element["participants"][0]["userId"]);


                                if (reportdata["conversations"][i]["participants"][0]["userId"]) {
                                    userId = "";
                                    userId = reportdata["conversations"][i]["participants"][0]["userId"];


                                    // userIdArray.push(element["participants"][0]["userId"]);

                                    // 
                                    //if(userboolean){
                                    // userboolean = false;


                                    //getUsernNames(userId);

                                    //function getUsernNames() {
                                    // if (k < activeLoginBreakHrs.length) {
                                    //=====================userid =======================

                                    var url = "https://api.mypurecloud.com/api/v2/users/" + userId;
                                    request({
                                        url: url,
                                        headers: {
                                            'Authorization': tokentype + " " + token
                                        },
                                        //async: true,
                                        // json: true,
                                        method: "GET",
                                        // json: requestbody[0],
                                    }, function (error, response, body) {
                                        if (!error && response.statusCode === 200) {
                                            userboolean = true;
                                            // i++
                                            // console.log(JSON.parse(body));
                                            console.log(JSON.parse(body).name);
                                            //console.log(body["name"]);
                                            //res.send(body);
                                            userIdArray.push(JSON.parse(body).name);

                                            if (reportdata["conversations"][i]["evaluations"]) {

                                                evaluateridvalue = "";
                                                evaluateridvalue =  reportdata["conversations"][i]["evaluations"][0]["evaluationId"]
                                                var url1 = "https://api.mypurecloud.com/api/v2/users/" + evaluateridvalue;
                                                request({
                                                    url: url1,
                                                    headers: {
                                                        'Authorization': tokentype + " " + token
                                                    },
                                                    //async: true,
                                                    // json: true,
                                                    method: "GET",
                                                    // json: requestbody[0],
                                                }, function (error, response, body) {
                                                    if (!error && response.statusCode === 200) {
                                                        
                                                        EvaluatoionIdArray.push(reportdata["conversations"][i]["evaluations"][0]["evaluationId"]);
                                                    }
                                                    else {
                                                        res.status(500).json({ "success": ' true', error: error });
                                                        console.log("error: " + error)
                                                        console.log("response.statusCode: " + response.statusCode)
                                                        console.log("response.statusText: " + response.statusText)
                                                    }
                                                })







                                              

                                                if (reportdata["conversations"][i]["evaluations"][0]["rescored"]) {
                                                    scoreArray.push(reportdata["conversations"][i]["evaluations"][0]["oTotalScore"]);
                                                } else {
                                                    scoreArray.push(0);
                                                }


                                            } else {
                                                // EvaluatoionIdArray.push("No EvaluationId");
                                                EvaluatoionIdArray.push("No EvaluationId");
                                                scoreArray.push("No score");
                                            }


                                            i++
                                            getUsernNames();


                                        }
                                        else {
                                            res.status(500).json({ "success": ' true', error: error });
                                            console.log("error: " + error)
                                            console.log("response.statusCode: " + response.statusCode)
                                            console.log("response.statusText: " + response.statusText)
                                        }
                                    })

                                    //await sleep(3000);
                                    //=====================userid =======================


                                    // }


                                }else{
                                    i++
                                    getUsernNames();
                                }

                                //}
                                //scoreArray.push(element["participants"][0]["userId"]);


                            } else {

                                k = 0;
                                var sendobject = [{ "userIdArray": userIdArray }, { "EvaluatoionIdArray": EvaluatoionIdArray }, { "scoreArray": scoreArray }];
                                console.log("sendobject: " + JSON.stringify(sendobject));
                                //sendobject[0]["userIdArray"]
                                return res.render('practice', { sendobject: sendobject });
                            }
                        }


                        //if(userIdArray.length == EvaluatoionIdArray.length){

                        // }

                        // console.log("userIdArray: " + userIdArray)
                        // console.log("EvaluatoionIdArray: " + EvaluatoionIdArray)
                        // console.log("scoreArray: " + scoreArray)

                        // 56ac3380-ef23-46ac-a07d-a01df1b09305
                        //console.log("userIdArray: " + userIdArray);
                    }
                    else {
                        res.status(500).json({ "success": ' true', error: error });
                        console.log("error: " + error)
                        console.log("response.statusCode: " + response.statusCode)
                        console.log("response.statusText: " + response.statusText)
                    }
                })




            }










        });

    return router;


};
module.exports = routes;

