import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  PrismaClient,
} from '@prisma/client';
import { ActivityLogEvent } from '../interfaces/activity-log-event.interface';
import { AuditResultEnum } from 'src/enums/audit-result.enum';
import { AuditSourceEnum } from 'src/enums/audit-source.enum';

@Injectable()
export class ActivityLogService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('ActivityLogService')

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Base de datos conectada');
    }

  async createFromEvent(event: ActivityLogEvent) {
    return this.aL01AuditLog.create({
      data: {
        AL01Service: event.service,
        AL01Module: event.module,
        AL01Action: event.action,
        AL01Source: event.source ?? AuditSourceEnum.API,
        AL01Result: event.result ?? AuditResultEnum.SUCCESS,
        AL01EventName: event.eventName,

        AL01Entity: event.entity,
        AL01EntityId: event.entityId,

        AL01UserId: event.user?.id,
        AL01UserNombre: event.user?.nombre,
        AL01UserRol: event.user?.rol,

        AL01CooperativaId: event.org?.cooperativaId,
        AL01SucursalId: event.org?.sucursalId,

        AL01Before: event.before,
        AL01After: event.after,

        AL01Ip: event.meta?.ip,
        AL01UserAgent: event.meta?.userAgent,
        AL01RequestId: event.meta?.requestId,
        AL01CorrelationId: event.meta?.correlationId,

        AL01Message: event.message,
        AL01Error: event.error,
      },
    });
  }
}
