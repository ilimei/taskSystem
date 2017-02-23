/**
 * Created by ZhangLiwei on 2017/2/23.
 */
const TaskLog=require("../../modal/TaskLog.modal");
const Task=require("../../modal/Task.modal");

function getUrgencyName(urgency){
    switch (urgency){
        case 0:return "有空再看";
        case 1:return "正常处理";
        case 2:return "优先处理";
        case 3:return "十万火急";
    }
}
function getTaskDoneName(done){
    switch (done){
        case 0:return "未完成";
        case 1:return "完成";
        case 2:return "归档";
        case 3:return "关闭";
    }
}

module.exports={
    addTask:function(user,task){
        TaskLog.addTaskLog(user,user.id,task.project,task.id,1,"创建任务");
    },
    changeTaskExecutor:function(user,task){
        TaskLog.addTaskLog(user,task.executor,task.project,task.id,2,"改变任务执行者");
    },
    changeTaskEndTime:function(user,task){
        TaskLog.addTaskLog(user,user.id,task.project,task.id,3,"改变任务执行时间为"+Format(new Date(parseInt(task.end_time)),"yyyy-MM-dd"));
    },
    changeTaskUrgency:function(user,task){
        TaskLog.addTaskLog(user,user.id,task.project,task.id,4,"改变任务紧急程度为"+getUrgencyName(task.weight));
    },
    changeTaskDone:function(user,task){
        TaskLog.addTaskLog(user,user.id,task.project,task.id,5,"改变任务状态为"+getTaskDoneName(task.done));
    },
    changeTaskName:function(user,task){
        TaskLog.addTaskLog(user,user.id,task.project,task.id,6,"改变任务标题为"+task.name);
    },
    changeTaskDesc:function(user,task){
        TaskLog.addTaskLog(user,user.id,task.project,task.id,7,"改变任务描述");
    }
}