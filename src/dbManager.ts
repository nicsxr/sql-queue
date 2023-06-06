import { Database } from "sqlite3"
import { TaskStatus } from "./enums/taskStatus"
import { Task } from "./models/task"

export class DbManager {
    db: Database
    tableName: string
    autoId: boolean // generate int ids automatically

    constructor(db: Database, tableName: string, autoId=true){
        this.db = db
        this.tableName = tableName
        this.autoId = autoId
    }

    configureDatabase(){
        this.db.exec(`CREATE TABLE IF NOT EXISTS "${this.tableName}" (
            "id" ${this.autoId ? 'INTEGER NOT NULL UNIQUE' : 'TEXT NOT NULL'},
            "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP,
            "info"	TEXT,
            "status"	INTEGER NOT NULL DEFAULT 0,
            "comment"	TEXT,
            "executionTime" INTEGER,
            PRIMARY KEY("id" ${this.autoId ? 'AUTOINCREMENT' : ''})
        )`, (err) => {
            if (err) throw err
        })
    }

    addTask(info='', id?: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let query = id ? `INSERT INTO ${this.tableName} (info, id) VALUES ("${info}", "${id}")` : `INSERT INTO ${this.tableName} (info) VALUES ("${info}")`
            console.log(query)
            this.db.run(query, function(err) {
                if (err) reject(err)
                resolve(this.lastID.toString())
            })
        })
    }

    updateTask(id: string, status: TaskStatus, executionTime: number){
        this.db.run(`UPDATE ${this.tableName} SET status=${status}, executionTime=${Math.floor(executionTime)} WHERE id=${id}`, function(err) {
            if (err) throw err
        })
    }

    getAllTasks(): Promise<Task[]> {
        return new Promise<Task[]>((resolve, reject) => {
            let tasks : Task[] = []
            this.db.all(`SELECT * FROM ${this.tableName}`, function(err, rows: any) {  
                if(err) reject(err)
                rows.forEach(function (row: any) {  
                    tasks.push(new Task(row.id.toString(), row.info, row.status, row.comment, row.executionTime))
                })
                resolve(tasks)
            })
        })
    }

    getTaskById(id: number): Promise<Task[]> {
        return new Promise<Task[]>((resolve, reject) => {
            let tasks : Task[] = []
            this.db.get(`SELECT * FROM ${this.tableName} where id="${id}"`, function(err, row: any) {  
                if(err) reject(err)
                new Task(row.id.toString(), row.info, row.status, row.comment, row.executionTime)
                resolve(tasks)
            })
        })
    }

    clearTasks(){
        this.db.run(`DELETE * FROM ${this.tableName}`)
    }
}