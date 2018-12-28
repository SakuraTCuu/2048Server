let ItemModel = require('../userModel/ItemModel')
let dbLogic = {
    /**
     * 更新用户道具数量
     */
    userUpdateInfo: function (userId, itemType) {
        return new Promise((resolve, reject) => {
            var User = global.dbHandler.getModel("user");
            User.findById(userId, function (err, result) {
                if (err) {
                    console.log("find user item err-->>", err);
                    reject(err);
                }
                //查询到数据
                console.log('result--->>', result);

                let updateData = {};
                if (itemType == 1) {
                    let num = --result['hummer'];
                    if (num < 0) {
                        num = 0;
                    }
                    updateData = {
                        hummer: num
                    }
                } else if (itemType == 2) {
                    let num = --result['brush'];
                    if (num < 0) {
                        num = 0;
                    }
                    updateData = {
                        brush: num
                    }
                } else if (itemType == 3) {
                    let num = --result['change'];
                    if (num < 0) {
                        num = 0;
                    }
                    updateData = {
                        change: num
                    }
                }
                User.findOneAndUpdate({_id:userId}, updateData, {
                    new: true
                }, (err, doc) => {
                    if (err) {
                        console.log('findByIdAndUpdate-->>', err);
                        reject(err);
                    } else {
                        console.log('修改后的数据:-->>', doc)
                        resolve(doc);
                    }
                })
            });
        })
    },
    //用户初次登录 user集合 插入数据
    userInsert: function (uName, openId) {
        return new Promise((resolve, reject) => {
            var User = global.dbHandler.getModel("user");
            User.create({
                userName: uName,
                openId: openId,
                loginTime: Date.now(),
                hummer: ItemModel.hummerItem,
                brush: ItemModel.brushItem,
                change: ItemModel.changeItem
            }, (err, doc, len) => {
                if (err) {
                    console.log('err-->>', err);
                    reject({
                        error: err
                    });
                    return;
                }
                resolve(doc);
                // console.log(`result :${doc}`);
            });
        })
    },
    // 查询用户是否存在
    queryUser: function (openId) {
        return new Promise((resolve, reject) => {
            let state = {
                init: true
            }
            var User = global.dbHandler.getModel("user");
            User.findOne({
                openId: openId
            }, function (err, doc) { //通过此model以用户名的条件 查询数据库中的匹配信息
                if (err) {
                    console.log('500--->>', err);
                    reject(err);
                } else if (!doc) {
                    console.log("用户不存在,需要注册");
                    resolve(state);
                } else {
                    //返回此数据
                    console.log(doc);
                    console.log("用户已存在");
                    state.init = false;
                    state['data'] = doc;
                    //获取数据
                    resolve(state);
                }
            })
        });
    },
}
module.exports = dbLogic;