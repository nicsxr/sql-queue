export async function executeFunction(taskId: string ,execFunc: any, args: any[] = [], description: string = ''): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("func start")
            await execFunc(...args)
            console.log("func end")
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
}