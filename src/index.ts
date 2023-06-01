import { Database } from "sqlite3";
import { DbManager } from "./dbManager";
import { TaskStatus } from "./enums/taskStatus";
import { performance } from 'perf_hooks'

export class Queue {
    dbPath: string
    tableName: string
    db: Database
    dbManager: DbManager

    constructor(dbPath: string, tableName?: string){
        this.dbPath = dbPath

        this.db = new Database(dbPath)
        this.tableName = tableName ? tableName : "tasks"
        this.dbManager = new DbManager(this.db, this.tableName)
        this.dbManager.configureDatabase()
    }


    async add(execFunc: any, args: any[], description: string = '') {
        var startTime = performance.now()
        try {
            var taskId = await this.dbManager.addTask(description)
            await execFunc(...args)
            var executionTime = performance.now() - startTime
            console.log("task finished - " + taskId)
            this.dbManager.updateTask(taskId, TaskStatus.Finished, executionTime)
        } catch (error) {
            var executionTime = performance.now() - startTime
            this.dbManager.updateTask(taskId, TaskStatus.Failed, executionTime)
        }
    }

    clear(){
        this.dbManager.clearTasks()
    }
}