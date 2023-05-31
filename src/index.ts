import { Database } from "sqlite3";
import { DbManager } from "./dbManager";
import { TaskStatus } from "./enums/taskStatus";

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
        try {
            var taskId = await this.dbManager.addTask(description)
            await execFunc(...args)
            this.dbManager.updateTask(taskId, TaskStatus.Finished)
        } catch (error) {
            this.dbManager.updateTask(taskId, TaskStatus.Failed)
        }
    }

    clear(){
        this.dbManager.clearTasks()
    }
}