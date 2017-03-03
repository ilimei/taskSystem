/**
 * Created by ZhangLiwei on 2017/3/2.
 */
const Msg = require("../../modal/Msg.modal");
const Task = require("../../modal/Task.modal");
const Comment = require("../../modal/Comment.modal");
const Query = require("../../lib/query.class");
const co = require("co");

module.exports = {
    hasNewReply: function (taskId) {
        co(function*() {
            let task = yield new Task().find().where({id: taskId}).one();
            let list = yield new Comment().find("creator").where({task_id: taskId}).all();
            let users = [];
            let map = {};
            let setFunc=creator=>{
                if (!map[creator]) {
                    map[creator]=1;
                    users.push(creator);
                }
            };
            [task.creator,task.executor].forEach(creator => setFunc(creator));
            list.forEach(({creator}) => setFunc(creator));
            var time = new Date - 0;
            var insertValues = users.map(user => {
                return {
                    user_id: user,
                    task_id: task.id,
                    project_id: task.project,
                    type: 1,
                    up_time: time,
                    has_read: 0,
                    content: "任务收到新的评论"
                }
            });
            new Query().insert(Msg).values(insertValues).exec();
        });
    }
}