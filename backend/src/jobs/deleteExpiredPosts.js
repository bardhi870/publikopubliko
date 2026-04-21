const cron = require("node-cron");
const pool = require("../config/db");

function startDeleteExpiredPostsJob() {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const result = await pool.query(`
        DELETE FROM posts
        WHERE is_unlimited = false
          AND active_until IS NOT NULL
          AND active_until < NOW() - INTERVAL '24 hours'
        RETURNING id, title
      `);

      if (result.rows.length > 0) {
        console.log(
          `U fshinë automatikisht ${result.rows.length} postime të skaduara pas 24 orëve.`
        );
      }
    } catch (error) {
      console.error("Gabim në auto-delete të postimeve:", error);
    }
  });
}

module.exports = startDeleteExpiredPostsJob;