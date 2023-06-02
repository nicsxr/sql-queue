export class Task {
    id: number
    description: string
    status: number
    comment: string
    executionTime: number
    
    constructor (id: number, description: string, status: number, comment: string, executionTime: number){
        this.id = id,
        this.description = description,
        this.status = status,
        this.comment = comment,
        this.executionTime = executionTime
    }
}