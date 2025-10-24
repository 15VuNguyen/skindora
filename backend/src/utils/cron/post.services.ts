import { blogService } from '~/services/blog.services';
import { CronJob } from "cron";

export const checkPostViewsJob = new CronJob('*/5 * * * *', async() => {
    try {
    console.log(`[CronJob] Starting sync at ${new Date().toISOString()}`)
    await blogService.syncPostViews(50)
    console.log(`[CronJob] Sync completed at ${new Date().toISOString()}`)
  } catch (err) {
    console.error('[CronJob] Sync failed', err)
  }
})