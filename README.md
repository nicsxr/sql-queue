# sql-queue

Execute and track asynchronous functions with sql-queue.

It uses sqlite database to track wether or not function was successfuly executed.

\
<b>Currently there are 3 states:</b>
- Failed: -1
- In progress: 0
- Finished: 1 (successful)

\
<b>Usage example</b>\
First we need to import and instantiate Queue.
```
const { Queue } = require('sql-queue')

queue = new Queue('./db.db')
```
<b>Now we can add a task to queue:</b>\
It takes several parameters:
- execFuntion - function that needs to be executed asynchronously (required)
- args[] - array of arguments that function takes (optional)
- description - description of task (optional)

```
    var taskId = await queue.add(function delayFunction(delayTime){
        return new Promise(r => setTimeout(r, delayTime));
        console.log("task 10 finish")
    }, [10000], "task#10")
    
```
This is a simple delay function which takes delayTime as argument.\
After we execute said code <b>"taskId"</b> will be equal to id assigned <br>
to task in database. <b>It will not wait for function to finish executing</b> but <br>
when when the task is done the database will be updated with appropriate status. <br>


\
You can also get specific task with id:
```
    var id = await queue.getById(id)
```
Get all Tasks:
```
    var id = await queue.getAll()
```
Clear all rows in database:
```
    var id = await queue.clear()
```
