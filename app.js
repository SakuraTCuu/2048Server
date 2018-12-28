let http = require('http');
let fs = require('fs')
let express = require('express');
let app = express();
// let app = require('./module/router.js');
let dbLogic = require('./module/dbLogic.js');
// let cookieParser = require('cookie-parser');
// let session = require('express-session');
let mongoose = require('mongoose');
let https = require("https");

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(cookieParser());
// app.use(session({

// }));

let wxAppid = "wx55ef2a54fabc2e27";
let appsecret = "cf1f631226510cc39e9890d39b20ab6a";

let baseWXUrl = 'https://api.weixin.qq.com/sns/jscode2session?';

app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options') {
        res.send(200); //让options尝试请求快速结束
    } else {
        next();
    }
});

app.get('/login', function (req, res) {
    console.log('get 请求 login');
    console.log(req.url)
    res.end('success');
});

app.post('/userItem', function (req, res) {
    // console.log(req.url);
    console.log('userItem--->>');
    // console.log('headers: ', req.headers);
    let type = req.body['itemType']
    let userId = req.headers['userid'];
    //数据库更新道具数量 --1;
    dbLogic.userUpdateInfo(userId, type).then((result) => {
        res.end(JSON.stringify({
            code: 200,
            data: {
                text: '数据更新成功'
            }
        }));
    }).catch((err) => {
        res.end(JSON.stringify({
            code: -1,
            errMsg: '更新数据未成功'
        }));
    });
});

app.post('/wxCode', function (req, res) {
    // console.log('post 请求 wxCode');
    console.log('server 接收到------>>>', req.body);
    let userName = req.body['userName'];
    // if (!userName) {
    //     //error 未传入用户名
    //     //暂且不报错吧  也不关键
    // }
    if (req.body['code']) {
        let code = req.body['code'];
        //向微信服务器发送请求 验证,获取openId;
        let param = {
            appid: wxAppid,
            secret: appsecret,
            js_code: code,
            grant_type: 'authorization_code'
        }
        getWXInfo(param).then((result) => {
            console.log("result--->>", result)
            let openId = result.openid;
            if (!openId) {
                res.end(JSON.stringify({
                    code: -1,
                    errMsg: "server error"
                }))
                return;
            }
            //获取到 openId
            //查询是否已经登录过
            dbLogic.queryUser(openId).then((state) => {
                console.log("state----->>", state)
                if (state['init']) {
                    //未登录过
                    //初始化  插入数据库
                    dbLogic.userInsert(userName, openId).then((data) => {
                        let userId = data['_id'];
                        //插入成功
                        //再查询数据库,并返回数据
                        let returnData = {
                            userName: data.UserName,
                            userId: userId,
                            hummer: data.hummer,
                            brush: data.brush, //刷子道具
                            change: data.change,
                        }
                        res.end(JSON.stringify({
                            code: 200,
                            data: returnData
                        }))
                    }).catch((err) => {
                        console.log('insert--->>', err)
                        //插入失败
                        res.end(JSON.stringify({
                            code: -1,
                            errMsg: 'userInsert failed'
                        }))
                    });
                } else {
                    //已登录过
                    //获取数据
                    //获取道具数据
                    let data = state['data'];
                    let userId = data['_id'];
                    let returnData = {
                        userName: data.UserName,
                        userId: userId,
                        hummer: data.hummer,
                        brush: data.brush, //刷子道具
                        change: data.change,
                    }
                    res.end(JSON.stringify({
                        code: 200,
                        data: returnData
                    }));
                }
            }).catch((err) => {
                //服务器 mongodb error
                console.log("errr--->>>", err)
                res.end(JSON.stringify({
                    code: -1,
                    errMsg: 'mongodb query failed'
                }));
            });
        }).catch((err) => {
            console.log('errr--->>>', err);
            res.end(JSON.stringify({
                code: -1,
                errMsg: 'wxServer return Failed'
            }));
        });
    } else {
        res.end(JSON.stringify({
            code: -1,
            errMsg: '客户端请传入用户code'
        }));
    }
});

//连接池配置
// var options = {
//     auto_reconnect: true,
//     poolSize: 10
// };
//数据库连接
global.dbHandler = require('./module/dbHandler');
global.db = mongoose.connect("mongodb://localhost:27017/userInfo", {
    useNewUrlParser: true,
    auto_reconnect: true,
    poolSize: 10
}, function (err) {
    if (err) {
        console.log('Connection Error:' + err)
    } else {
        console.log('Connection success!');
    }
});

httpsOption = {
    key: fs.readFileSync("./cert/1469535_www.sakuratree.xyz.key"),
    cert: fs.readFileSync("./cert/1469535_www.sakuratree.xyz.pem")
}
// http.createServer(app).listen(8123);
let server = https.createServer(httpsOption, app).listen(8123);

let obj2Str = function (obj) {
    let paramStr = "";
    for (var k in obj) {
        paramStr += (k + "=" + obj[k]);
        paramStr += "&";
    }
    if (paramStr != "") {
        paramStr = paramStr.slice(0, paramStr.length - 1);
    }
    return paramStr;
}

let getWXInfo = function (param) {
    return new Promise((resolve, reject) => {
        let str = obj2Str(param);
        https.get(baseWXUrl + str, function (res) {
            var datas = [];
            var size = 0;
            res.on('data', function (data) {
                // console.log('data--tos---->>', data.toString());
                datas.push(data);
                size += data.length;
            });
            res.on("end", function () {
                var buff = Buffer.concat(datas, size);
                var result = buff.toString();
                result = JSON.parse(result);
                resolve(result);
            });
        }).on("error", function (err) {
            Logger.error(err.stack)
            reject(err);
        });
    })
}