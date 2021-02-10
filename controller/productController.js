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
var reportdata = "";
var routes = function () {
    router.route('/report')
        .post(function (req, res) {

            console.log("=========Welcome to controller=========");
            var StartDateandtime = req.body.StartDateandtime;
            var Enddateandtime = req.body.Enddateandtime;
            console.log("StartDateandtime :" + StartDateandtime);
            console.log("Enddateandtime :" + Enddateandtime);
            console.log("=====input value============== ");
            var StartDateandtime1 = new Date(StartDateandtime).toISOString(); //OUTPUT : 2015-02-20T13:59:31.238Z 
            var Enddateandtime2 = new Date(Enddateandtime).toISOString(); //OUTPUT : 2015-02-20T13:59:31.238Z 
            console.log("StartDateandtime1 :" + StartDateandtime1);
            console.log("Enddateandtime2 :" + Enddateandtime2);
            requestbody = [{ "interval": StartDateandtime1 + "/" + Enddateandtime2, "order": "asc", "orderBy": "conversationStart", "paging": { "pageSize": 25, "pageNumber": 1 } }]
            console.log("======requestbody ===== :" + JSON.stringify(requestbody));
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
                console.log("========handleTokenCallback entered===========:");
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
                    //console.log("reportbody :" + JSON.stringify(body));
                    if (!error && response.statusCode === 400) {
                        return res.render('reportNodata', { title: "Interval does not exceed 7 days" });
                    }

                    if (!error && response.statusCode === 200) {

                        console.log("=====success============== ");

                        reportdata = "";
                        reportdata = body;

                        if (reportdata == "") {
                            return res.render('reportNodata', { title: "Interval does not exceed 7 days" });
                        }

                        // res.send(body["conversations"][0]["participants"][0]["userId"]);
                        //console.log("conversations :" + JSON.stringify(body["conversations"][0]["participants"][0]["userId"]));
                        //  var userId = "56ac3380-ef23-46ac-a07d-a01df1b09305";
                        //body["conversations"].forEach(element => {
                        // console.log("length :"+reportdata["conversations"].length);
                        getUsernNames();
                        function getUsernNames() {
                            if (reportdata != "" && reportdata != null && reportdata != undefined) {
                              //  if (reportdata.length > 0) {

                                    if (i < reportdata["conversations"].length) {
                                        //console.log("users id: " + element["participants"][0]["userId"]);

                                     //   console.log("=====" + i + "============== ");
                                        if ((reportdata["conversations"][i]["participants"][0]["userId"] != null && reportdata["conversations"][i]["participants"][0]["userId"] != undefined && reportdata["conversations"][i]["participants"][0]["userId"] != "")
                                            && (reportdata["conversations"][i]["evaluations"] != null && reportdata["conversations"][i]["evaluations"] != undefined && reportdata["conversations"][i]["evaluations"] != "")) {
                                            userId = "";
                                            userId = reportdata["conversations"][i]["participants"][0]["userId"];

                                           // console.log("=====under==" + i + "============== ");
                                            //=====================userid =======================

                                            var url = "https://api.mypurecloud.com/api/v2/users/" + userId;
                                            request({
                                                url: url,
                                                headers: {
                                                    'Authorization': tokentype + " " + token
                                                },
                                                method: "GET",
                                            }, function (error, response, body) {
                                                if (!error && response.statusCode === 200) {

                                                    // i++
                                                    console.log(JSON.stringify(body));
                                                    console.log(JSON.parse(body).name);
                                                    //console.log(body["name"]);
                                                    //res.send(body);
                                                    userIdArray.push(JSON.parse(body).name);

                                                    // if (reportdata["conversations"][i]["evaluations"]) {
                                                    console.log("===========Evaluation is there===========");
                                                    evaluateridvalue = "";
                                                    evaluateridvalue = reportdata["conversations"][i]["evaluations"][0]["evaluatorId"];
                                                    console.log("evaluateridvalue :" + evaluateridvalue);
                                                    var url1 = "https://api.mypurecloud.com/api/v2/users/" + evaluateridvalue;
                                                    console.log("url1 :" + url1);
                                                    request({
                                                        url: url1,
                                                        headers: {
                                                            'Authorization': tokentype + " " + token
                                                        },
                                                        method: "GET",
                                                    }, function (error, response, body) {
                                                        if (!error && response.statusCode === 200) {
                                                            console.log("supervisor name :" + JSON.parse(body).name);
                                                            EvaluatoionIdArray.push(JSON.parse(body).name);

                                                            if (reportdata["conversations"][i]["evaluations"][0]["rescored"]) {
                                                                scoreArray.push(reportdata["conversations"][i]["evaluations"][0]["oTotalScore"]);
                                                            } else {
                                                                scoreArray.push("No score");
                                                            }
                                                            i++
                                                            getUsernNames();
                                                        }
                                                        else {
                                                            res.status(500).json({ "success": ' true', error: error });
                                                            console.log("error for supervisor: " + error)
                                                            console.log("response.statusCode: " + response.statusCode)
                                                            console.log("response.statusText: " + response.statusText)
                                                            i++
                                                            getUsernNames();
                                                        }
                                                    })






                                                    // } else {
                                                    //     // EvaluatoionIdArray.push("No EvaluationId");
                                                    //     EvaluatoionIdArray.push("-");
                                                    //     scoreArray.push("-");
                                                    //     i++
                                                    //     getUsernNames();
                                                    // }





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


                                        } else {
                                            i++
                                            getUsernNames();
                                        }

                                        //}
                                        //scoreArray.push(element["participants"][0]["userId"]);


                                    } else {

                                        k = 0;
                                        if (userIdArray != null && userIdArray != undefined && userIdArray != "") {
                                            var sendobject = [{ "userIdArray": userIdArray }, { "EvaluatoionIdArray": EvaluatoionIdArray }, { "scoreArray": scoreArray }];
                                            console.log("sendobject: " + JSON.stringify(sendobject));
                                            //sendobject[0]["userIdArray"]
                                            return res.render('Downloadpage', { sendobject: sendobject });

                                        } else {
                                            return res.render('reportNodata', { title: "No data available between dates" });
                                        }

                                    }
                                // } else {
                                //     console.log("=====No data availaable============== ");
                                //     return res.render('reportNodata', { title: "No data available between dates" });
                                // }
                            } else {
                                console.log("=====No data availaable============== ");
                                return res.render('reportNodata', { title: "No data available between dates" });
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

