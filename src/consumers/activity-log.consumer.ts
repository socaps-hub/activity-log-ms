import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ActivityLogEvent } from '../interfaces/activity-log-event.interface';
import { ActivityLogService } from 'src/services/activity-log.service';
import { ActivityLogFilterInput } from 'src/dto/inputs/activity-log-filter.input';

@Controller()
export class ActivityLogConsumer {
  constructor(
    private readonly _activityLogService: ActivityLogService,
  ) {}

  @EventPattern('activity.log.created')
  async handleActivityLog(
    @Payload() event: ActivityLogEvent,
  ) {
    try {
      await this._activityLogService.createFromEvent(event);
    } catch (err) {
      // ⚠️ nunca romper el flujo
      console.error('[ActivityLogConsumer]', err);
    }
  }

  @MessagePattern('activity.log.getActivityLogsFiltrado')
  async handleGetActivityLogsFiltrado(
    @Payload() { input }: { input: ActivityLogFilterInput },
  ) {
    return this._activityLogService.getActivityLogsFiltrado( input );
  }
  
  @MessagePattern('activity.log.getActivityLogById')
  async handleGetActivityLogById(
    @Payload() { id }: { id: string },
  ) {
    return this._activityLogService.getActivityLogById( id );
  }
}
