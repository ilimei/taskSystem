/**
 * Created by ZhangLiwei on 2017/2/9.
 */

const Query = require("../../server/lib/query.class.js");
const DB = require("../../server/lib/transactionDB.class.js");
const co = require("co");
const User = require("../../server/modal/User.modal.js");
const Doc = require("../../server/modal/Doc.modal");
const Task = require("../../server/modal/Task.modal");
const {getTestPool}=require("../config");

module.exports = {
    "test update": function (test) {
        var pool = getTestPool();
        var db = new DB(pool);
        co(function*() {
            yield db.startTransaction();
            yield new Query(db).update(User).set({
                name: "123"
            }).exec();
            var user = yield new User().find(undefined, db).one();
            test.equal("123", user.name, "the update method exec fail");
        }).then(result => {
            db.rollback();
            test.done();
        }).catch(err => {
            db.rollback();
            console.error(err);
            test.fail(err);
            test.done();
        });
    },
    "test insert": function (test) {
        var pool = getTestPool();
        var db = new DB(pool);
        co(function*() {
            yield db.startTransaction();
            var name = "123" + (+new Date());
            yield new Query(db).insert(User).value({
                name: name
            }).exec();
            var user = yield new User().find(undefined, db).where({
                name: name
            }).one();
            test.equal(name, user.name, "the insert method exec fail");
        }).then(result => {
            db.rollback();
            test.done();
        }).catch(err => {
            db.rollback();
            console.error(err);
            test.fail(err);
            test.done();
        });
    },
    "test multiTable": function (test) {
        new Query().select([[Doc, "a"], [Task, "b"]])
            .find(["a.*", "b.end_time end_time", "b.weight weight", "b.done done"])
            .where("a.editor=b.id")
            .orderBy(["weight desc","end_time desc","done"])
            .exec()
            .then(function (data) {
                test.done();
            })
            .catch(e => {
                test.fail(e);
                test.done();
            });
    }
}