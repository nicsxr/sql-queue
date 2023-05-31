import { Database } from "sqlite3";
import { TaskStatus } from "./enums/taskStatus";

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
            "description"	TEXT,
            "status"	INTEGER NOT NULL DEFAULT 0,
            "comment"	TEXT,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`, (err) => {
            if (err) throw err
        })
    }

    async addTask(description=''): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            this.db.run(`INSERT INTO ${this.tableName} (description) VALUES ("${description}")`, function(err) {
                if (err) reject(err)
                resolve(this.lastID.toString())
            })
        })
    }

    updateTask(id: string, status: TaskStatus){
        this.db.run(`INSERT INTO ${this.tableName} (status) VALUES (${status})`, function(err) {
            if (err) throw err
        })
    }

    clearTasks(){
        this.db.run(`DELETE * FROM ${this.tableName}`)
    }
}