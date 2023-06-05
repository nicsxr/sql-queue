import { Database } from "sqlite3"
import { DbManager } from "./dbManager"
import { TaskStatus } from "./enums/taskStatus"
import { performance } from 'perf_hooks'
import { executeFunction } from "./executer"

/**
 * @classdesc Represents a queue.
 * @class Queue
 */
export class Queue {
    protected dbPath: string
    protected tableName: string
    protected db: Database
    protected dbManager: DbManager

    /**
     * Creates an instance of Queue.
     * @param {string} dbPath - The path to the database file.
     * @param {string} [tableName] - The name of the table in the database. Default name is 'tasks' (optional).
     */
    constructor(dbPath: string, tableName?: string){
        this.dbPath = dbPath

        this.db = new Database(dbPath)
        this.tableName = tableName ? tableName : "tasks"
        this.dbManager = new DbManager(this.db, this.tableName)
        this.dbManager.configureDatabase()
    }

    /**
     * Adds a task to the queue.
     * @param {Function} execFunc - The function to execute as the task.
     * @param {any[]} args - The arguments to pass to the function. (optional)
     * @param {string} [info=''] - Information about the task. (optional)
     * @returns {Promise<void>}
     */
    async add(execFunc: any, args: any[] = [], info: string = ''): Promise<string> {
        var startTime = performance.now()
        var taskId = ''
        try {
            var taskId = await this.dbManager.addTask(info)
        } catch (error) {
            
        }

        if (taskId != ''){
            executeFunction(taskId, execFunc, args, info).then((res: boolean) => {
                var executionTime = performance.now() - startTime
                if (res == true) 
                    this.dbManager.updateTask(taskId, TaskStatus.Finished, executionTime)
                else
                    this.dbManager.updateTask(taskId, TaskStatus.Failed, executionTime)
            })
        }else{
            this.dbManager.updateTask(taskId, TaskStatus.Finished, 0)
        }

        return taskId
    }


    /**
     * Gets all tasks
     */
    async getAll(){
        return await this.dbManager.getAllTasks()
    }

    /**
     * Gets specific task by id
     * @param {number} id - id of task.
     */
    async getById(id: number){
        return await this.dbManager.getTaskById(id)
    }

    /**
     * Clears all tasks from the queue.
     */
    clear(): void {
        this.dbManager.clearTasks()
    }
}