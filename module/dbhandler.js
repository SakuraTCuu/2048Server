// const mongoose = require("mongoose")
// var models = require('./model.js')

// let userDB = mongoose.createConnection('mongodb://localhost:27017/userInfo', {
//     useNewUrlParser: true
// });

// userDB.on('error', function (err) {
//     console.log('userDB connect error--->>', err);
// });

// userDB.on('connected', function () {
//     console.log('connect success')
// })

// userDB.on('disconnected', function () {
//     console.log('MoogoDB connect disconnected');
// })

// userDB.once('open', function () {
//     console.log("userDB connect success");

//     let schema = new mongoose.Schema(models.userSchema);
//     //第三个参数是集合名(表名),如果不指定第三个参数,则创建集合名为第一个参数+s 作为集合名,
//     let user = userDB.model('user', schema, 'user');

//     //save 保存
//     // let data = new user({
//     //     userName: 'wang',
//     //     openId: 2,
//     //     loginTime: 1000
//     // });
//     // console.log('data-->>', data)
//     // data.save().then((doc, len, err) => {
//     //     console.log(`result :${doc}`);
//     //     console.log(`err: ${err}`);
//     //     console.log(`three : ${len}`);
//     // });

//     //create 保存
//     // user.create({
//     //     userName: 'qzj',
//     //     openId: 0,
//     //     loginTime: 1111
//     // }, (err, doc, len) => {
//     //     console.log(`result :${doc}`);
//     //     console.log(`err: ${err}`);
//     //     console.log(`three : ${len}`);
//     // });

//     // //回调第一个参数是结果，第二个参数是数据条数，第三个参数是异常
//     // user.create({
//     //     userName: 'qzj',
//     //     openId: 0,
//     //     loginTime: 1111
//     // }).then((err, doc, len) => {
//     //     console.log(`result :${doc}`);
//     //     console.log(`err: ${err}`);
//     //     console.log(`three : ${len}`);
//     // });


//     //----------------修改数据update()和updateMany()
//     // user.updateMany({
//     //     userName: 'qzj'
//     // }, {
//     //     $set: {
//     //         openId: 333
//     //     }
//     // }, (err, doc) => {
//     //     if (err) {
//     //         console.log(err)
//     //     } else {
//     //         console.log('err-->>', err);
//     //         console.log('doc-->>', doc);
//     //     }
//     // })

//     //----------------查找数据find()和findOne();
//     user.findOne({
//         userName: 'qzj'
//     }, (err, data) => {
//         console.log('err--->>>', err);
//         console.log("find----->>", data)
//     })


//     //     // -------------------删除数据remove()     
//     //     // DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
//     //     //remove 过时了 应该用 deleteOne deleteMany  代替
//     //     user.remove({
//     //         userName: 'qzj'
//     //     }, (err, data, len) => {
//     //         console.log(err);
//     //         console.log(data);
//     //     })

//     //     /**

//     // 总结：以上所有操作数据库的方法都分为方法内部回调和方法结束后promise回调两种模式：
//     // 如果是内部回调，回调接受的三个参数分别是：异常、返回的数据结果、返回数据结果的条数

//     // 如果是promise回调，接受的三个参数分别依次为：结果、数据条数、异常
//     //     */
// })

var mongoose = require('mongoose');
var schema = mongoose.Schema;
let models = {
    user: {
        userName: {
            type: String,
            required: true
        },
        openId: {
            type: String,
            required: true
        },
        loginTime: {
            type: Number,
            required: true
        },
        hummer: {
            type: Number,
            required: true
        },
        brush: {
            type: Number,
            required: true
        },
        change: {
            type: Number,
            required: true
        },
    },

    sign: {
        currentTime: {
            type: Number,
            required: true
        },
    }
}

for (const m in models) {
    mongoose.model(m, new schema(models[m]));
}

module.exports = {
    getModel: function (type) {
        return _getModel(type);
    }
};
var _getModel = function (type) {
    return mongoose.model(type);
}