const app = require("./app");
const env = require("./config/env");
const startDeleteExpiredPostsJob = require("./jobs/deleteExpiredPosts");

startDeleteExpiredPostsJob();

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});