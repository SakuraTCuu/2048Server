// let models = {
//     // loginSchema: {
//     //     userName: {
//     //         type: String,
//     //         required: true
//     //     },
//     //     openId: {
//     //         type: Number,
//     //         required: true
//     //     },
//     //     loginTime: {
//     //         type: Number,
//     //         required: true
//     //     },
//     // },

//     // signSchema: {
//     //     currentTime: {
//     //         type: Number,
//     //         required: true
//     //     },
//     // }
// }


//废弃

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName: String,
    openId: String,
    loginTime: Number,
    hummer: Number, //锤子道具
    brush: Number, //刷子道具
    change: Number, //换位道具
});

var signSchema = new mongoose.Schema({
    currentTime: Number
})

//道具模型   暂时合并到user集合中
// var ItemSchema = new mongoose.Schema({
//     hummer: Number,
//     brush: Number,
//     change: Number,
//     // currentTime: Number
//     //用数组来存储,还是单个存储  数组更利于扩展  后续再扩展吧
// })

var models = {
    userSchema,
    signSchema,
}
module.exports = models;