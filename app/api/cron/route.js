// pages/api/cron/my-cron-job.js
export default async function handler(req, res) {
    // Your cron job logic here
    console.log('Cron job executed');
    res.status(200).send('Cron job executed');
  }
  