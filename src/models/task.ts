export class Task {
    id: string
    info: string
    status: number
    comment: string
    executionTime: number
    
    constructor (id: string, info: string, status: number, comment: string, executionTime: number){
        this.id = id,
        this.info = info,
        this.status = status,
        this.comment = comment,
        this.executionTime = executionTime
    }
}