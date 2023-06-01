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
            "executionTime" INTEGER,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`, (err) => {
            if (err) throw err
        })
    }

    addTask(description=''): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            this.db.run(`INSERT INTO ${this.tableName} (description) VALUES ("${description}")`, function(err) {
                if (err) reject(err)
                resolve(this.lastID.toString())
            })
        })
    }

    updateTask(id: string, status: TaskStatus, executionTime: number){
        this.db.run(`UPDATE ${this.tableName} SET status=${status} WHERE id=${id}`, function(err) {
            if (err) throw err
        })
    }

    clearTasks(){
        this.db.run(`DELETE * FROM ${this.tableName}`)
    }
}