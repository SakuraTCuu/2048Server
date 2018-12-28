var mongoose =require('mongoose');

global.dbHandle = require('./module/dbhandler')
global.db = mongoose.connect("mongodb://localhost:27017/userInfo", {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        console.log('Connection Error:' + err)
    } else {
        console.log('Connection success!')
        var User = global.dbHandle.getModel("user");
        User.findOne({
            name: 'aaa'
        }, function (err, doc) { //通过此model以用户名的条件 查询数据库中的匹配信息
            if (err) {
                console.log('errr---->>', err);
            } else if (!doc) {
                console.log('用户不存在,请注册')
            } else {
                console.log('doc--->>', doc)
            }
        })
    }
});