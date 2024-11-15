import { Director, director, math } from "cc";
import { EDITOR } from "cc/env";
import { Time } from "../Utils/Time";

/**
 * 定时任务管理器
 */
export class TimerMgr {
    private constructor() {
        if (!EDITOR) {
            director.once(Director.EVENT_AFTER_SCENE_LAUNCH, this.startTimer, this);
        }
    }
    static readonly instance: TimerMgr = new TimerMgr();

    // 定时任务ID初始值
    private taskId: number = 100000;
    // 定时任务列表
    private taskMap: Map<number, TimerTask> = new Map();

    /**
     * 启动任务计时器
     */
    private startTimer() {
        setInterval(() => { this.updateTimer(Time.getNowSeconds()); }, 1000);
    }

    /**
     * 定时执行任务
     * @param seconds 当前时间对应的秒
     */
    private updateTimer(seconds: number) {
        this.taskMap.forEach((task, id) => {
            if (task.repeat > 0 && seconds >= task.nextRunTime) {
                task.repeat--;
                task.nextRunTime += task.interval;
                task.handler.call(task.thisObject);
            }

            // 重复执行完毕后清除任务
            if (task.repeat == 0) {
                this.removeTimer(id);
            }
        });
    }

    /**
     * 添加定时任务
     * @param task 定时任务
     */
    addTimer(task: TimerTask) {
        if (!task.nextRunTime) {
            task.nextRunTime = Time.getNowSeconds() + task.interval;
        }
        this.taskMap.set(this.taskId++, task);
    }

    /**
     * 移除定时任务
     * @param taskId 任务ID
     */
    removeTimer(taskId: number) {
        this.taskMap.delete(taskId);
    }
}

export interface TimerTask {
    /**
     * 任务处理函数
     */
    handler: Function;
    /**
     * 执行间隔。单位：秒
     */
    interval: number;
    /**
     * 任务作用域
     */
    thisObject: Object;
    /**
     * 重复执行次数
     */
    repeat: number;
    /**
     * 下次执行时间，可用于设置任务的开始时间
     */
    nextRunTime?: number;
}
