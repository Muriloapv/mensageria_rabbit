import amqp from "amqplib"

async function sendTasks(){
    try{

    const connection = await amqp.connect("amqp://admin:admin@localhost");
    const channel    = await connection.createChannel();

    const queue = "task_queue"
    const msg   = process.argv.slice(2).join(' ') || "tarefa padrao"

    await channel.assertQueue( queue, {
        durable:true
    })

    channel.sendToQueue( queue, Buffer.from( msg ), {
        persistent: true
    } )

    console.log( "[x] enviado '%s' ", msg)
    setTimeout(() => {
        connection.close()
        process.exit(0)
    },500);
    
    } catch(err){
        console.log(err)
    }
}  
sendTasks();