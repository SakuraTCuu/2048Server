var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/userInfo"; //创建user数据库

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log(err);
    }
    console.log('数据库创建成功');
    // db.close();
    var dbase = db.db("userInfo");
    dbase.createCollection('user', function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('创建user集合成功', result);
        // db.close();
        let mySchema = {
            userName: 'Sakura',
            openId: 1,
            loginTime: Date.now()
        }
        dbase.collection('user').insertOne(mySchema, function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log('插入成功,', res);
            db.close();
        })
    })
})