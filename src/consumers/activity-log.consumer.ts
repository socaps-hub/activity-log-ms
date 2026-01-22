import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ActivityLogEvent } from '../interfaces/activity-log-event.interface';
import { ActivityLogService } from 'src/services/activity-log.service';

@Controller()
export class ActivityLogConsumer {
  constructor(
    private readonly activityLogService: ActivityLogService,
  ) {}

  @EventPattern('activity.log.created')
  async handleActivityLog(
    @Payload() event: ActivityLogEvent,
  ) {
    try {
      await this.activityLogService.createFromEvent(event);
    } catch (err) {
      // ⚠️ nunca romper el flujo
      console.error('[ActivityLogConsumer]', err);
    }
  }
}
