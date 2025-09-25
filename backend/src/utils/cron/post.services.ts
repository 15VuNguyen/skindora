import { blogService } from '~/services/blog.services';
import { CronJob } from "cron";

export const checkPostViewsJob = new CronJob('*/5 * * * *', async() => {
    try {
    console.log('[CronJob] Syncing post views from Redis to MongoDB...')
    await blogService.syncPostViews(100)
    console.log('[CronJob] Sync completed')
  } catch (err) {
    console.error('[CronJob] Sync failed', err)
  }
})