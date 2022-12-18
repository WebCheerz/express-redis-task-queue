const express = require("express");
const Redis = require("ioredis");
const axios = require("axios");

const app = express();
app.use(express.json());

const redis = new Redis(); // Connect to Redis server

app.post("/add_task", (req, res) => {
  // Generate a unique ID for the task
  const id = Date.now().toString();
  console.log(`Tasked added to queue with id ${id}`);

  // Add a task to the queue
  redis.lpush("queue", JSON.stringify({ id, data: req.body }));

  axios.post(req.body.callbackUrl, {
    message: `Task added to queue with id ${id}`,
  });

  res.send("Task added to queue");
});

app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
