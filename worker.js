const Redis = require("ioredis");
const axios = require("axios");
const redis = new Redis();

async function processQueue() {
  const task = JSON.parse(await redis.rpop("queue"));
  if (!task) {
    setImmediate(processQueue);
    return;
  }

  try {
    console.log(`Processing task: ${task.id}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error(`Task failed: ${task.id}`);

    // Incase of Failure, Add task back to the queue
    await redis.lpush("queue", JSON.stringify(task));
  }

  console.log(`Task complete: ${task.id}`);
  // send a notification to the client callbackUrl
  axios.post(task.data.callbackUrl, {
    message: `Task completed ${task.id}`,
  });

  setImmediate(processQueue);
}

processQueue();
