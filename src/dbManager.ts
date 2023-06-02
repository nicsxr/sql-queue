import { Database } from "sqlite3"
import { TaskStatus } from "./enums/taskStatus"
import { Task } from "./models/task"

export class DbManager {
    db: Database
    tableName: string

    constructor(db: Database, tableName: string){
        this.db = db
        this.tableName = tableName
    }

    configureDatabase(){
        this.db.exec(`CREATE TABLE IF NOT EXISTS "${this.tableName}" (
            "id"	INTEGER NOT NULL UNIQUE,
            "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP,
            "description"	TEXT,
            "status"	INTEGER NOT NULL DEFAULT 0,
            "comment"	TEXT,
            "executionTime" INTEGER,
            PRIMARY KEY("id" AUTOINCREMENT)
        )`, (err) => {
            if (err) throw err
        })
    }

    addTask(description=''): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.db.run(`INSERT INTO ${this.tableName} (description) VALUES ("${description}")`, function(err) {
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
                    tasks.push(new Task(row.id, row.description, row.status, row.comment, row.executionTime))
                })
                resolve(tasks)
            })
        })
    }

    getTaskById(id: number): Promise<Task[]> {
        return new Promise<Task[]>((resolve, reject) => {
            let tasks : Task[] = []
            this.db.get(`SELECT * FROM ${this.tableName} where id=${id}`, function(err, row: any) {  
                if(err) reject(err)
                new Task(row.id, row.description, row.status, row.comment, row.executionTime)
                resolve(tasks)
            })
        })
    }

    clearTasks(){
        this.db.run(`DELETE * FROM ${this.tableName}`)
    }
}