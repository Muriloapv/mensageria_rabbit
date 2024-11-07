import amqp from "amqplib";

async function receiveTask() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost");
    const channel = await connection.createChannel();

    const queue = "task_queue";

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1); // Definir o número de mensagens pré-buscadas
    console.log("[*] Aguardando mensagens. Para sair, pressione Ctrl+C");

    channel.consume(queue, (msg) => {
      const secs = msg.content.toString().split('.').length - 1;
      console.log("[x] Recebido '%s'");

      setTimeout(() => {
        console.log("[x] Processado '%s'", msg.content.toString());
        channel.ack(msg);
      }, secs * 1000);
    }, {
        noAck: false
    });
  } catch (err) {
    console.log("Erro:", err);
  }
}

receiveTask();
