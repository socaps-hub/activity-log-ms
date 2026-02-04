import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  PrismaClient,
} from '@prisma/client';
import { ActivityLogEvent } from '../interfaces/activity-log-event.interface';
import { AuditResultEnum } from 'src/enums/audit-result.enum';
import { AuditSourceEnum } from 'src/enums/audit-source.enum';
import { ActivityLogFilterInput } from 'src/dto/inputs/activity-log-filter.input';
import { ActivityLogResponse } from 'src/dto/outputs/activity-log-response.output';
import { buildPrismaWhereFromPrimeFilters } from 'src/common/utils/prisma-where-from-prime-filters.builder';
import { AuditActionEnum } from 'src/enums/audit-action.enum';
import { ActivityLogDetailDto } from 'src/dto/outputs/activity-log-detail-output';
import { buildActivityLogWhereFromPrimeFilters } from 'src/common/utils/build-activity-log-where-from-prime-filters.util';

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

  // ==========================
  // * EXPOSICIÓN DE LA INFORMACIÓN
  // ==========================

  public async getActivityLogsFiltrado(
    input: ActivityLogFilterInput
  ): Promise<ActivityLogResponse> {

    const {
      paginado = true,
      page = 1,
      pageSize = 50,
      first,
    } = input;

    const offset = first != null && first >= 0
      ? first
      : (Math.max(1, page) - 1) * pageSize;

    const {
      registrosFiltrados,
      totalFiltrados,
    } = await this._obtenerActivityLogsFiltrados(
      input,
      paginado,
      offset,
      pageSize,
    );

    const effectivePage = first != null
      ? Math.floor(offset / pageSize) + 1
      : Math.max(1, page);

    const totalPages = paginado
      ? Math.ceil(totalFiltrados / pageSize)
      : 1;

    return {
      registros: registrosFiltrados.map(log => ({
        id: log.AL01Id.toString(),
        createdAt: log.AL01CreatedAt.toISOString(),

        service: log.AL01Service,
        module: log.AL01Module,
        action: log.AL01Action as AuditActionEnum,
        result: log.AL01Result as AuditResultEnum,
        source: log.AL01Source as AuditSourceEnum,
        eventName: log.AL01EventName ?? undefined,

        entity: log.AL01Entity,
        entityId: log.AL01EntityId ?? undefined,

        userId: log.AL01UserId ?? undefined,
        userNombre: log.AL01UserNombre ?? undefined,
        userRol: log.AL01UserRol ?? undefined,

        cooperativaId: log.AL01CooperativaId ?? undefined,
        sucursalId: log.AL01SucursalId ?? undefined,

        message: log.AL01Message ?? undefined,
      })),
      page: effectivePage,
      pageSize,
      totalPages,
      totalRegistros: totalFiltrados,
    };
  }

  public async getActivityLogById(
    id: string,
  ): Promise<ActivityLogDetailDto | null> {

    const log = await this.aL01AuditLog.findUnique({
      where: {
        AL01Id: BigInt(id),
      },
    });

    if (!log) return null;

    return {
      id: log.AL01Id.toString(),
      createdAt: log.AL01CreatedAt.toISOString(),

      service: log.AL01Service,
      module: log.AL01Module,

      action: log.AL01Action as AuditActionEnum,
      result: log.AL01Result as AuditResultEnum,
      source: log.AL01Source as AuditSourceEnum,

      eventName: log.AL01EventName ?? undefined,

      entity: log.AL01Entity,
      entityId: log.AL01EntityId ?? undefined,

      userId: log.AL01UserId ?? undefined,
      userNombre: log.AL01UserNombre ?? undefined,
      userRol: log.AL01UserRol ?? undefined,

      cooperativaId: log.AL01CooperativaId ?? undefined,
      sucursalId: log.AL01SucursalId ?? undefined,

      before: log.AL01Before ?? undefined,
      after: log.AL01After ?? undefined,

      meta: {
        ip: log.AL01Ip ?? undefined,
        userAgent: log.AL01UserAgent ?? undefined,
        requestId: log.AL01RequestId ?? undefined,
        correlationId: log.AL01CorrelationId ?? undefined,
      },

      message: log.AL01Message ?? undefined,
      error: log.AL01Error ?? undefined,
    };
  }


  // ==========================
  // * HELPERS
  // ==========================

  private async _obtenerActivityLogsFiltrados(
    input: ActivityLogFilterInput,
    paginado: boolean,
    offset: number,
    pageSize: number,
  ) {

    const where = await this._buildActivityLogWhere(input);

    const skip = paginado ? Math.max(0, offset) : 0;
    const take = paginado ? pageSize : undefined;

    const [totalFiltrados, registrosFiltrados] =
      await this.$transaction([
        this.aL01AuditLog.count({ where }),

        this.aL01AuditLog.findMany({
          where,
          orderBy: { AL01CreatedAt: 'desc' },
          skip,
          take,
        }),
      ]);

    return { registrosFiltrados, totalFiltrados };
  }

  private async _buildActivityLogWhere(
    input: ActivityLogFilterInput,
  ) {
    const {
      service,
      module,
      action,
      result,
      source,
      entity,
      userId,
      cooperativaId,
      fechaInicio,
      fechaFin,
      searchText,
      filters,
    } = input;

    const where: any = {};

    /* =========================
     * FILTROS DIRECTOS
     * ========================= */

    if (service) {
      where.AL01Service = service;
    }

    if (module) {
      where.AL01Module = module;
    }

    if (action) {
      where.AL01Action = action;
    }

    if (result) {
      where.AL01Result = result;
    }

    if (source) {
      where.AL01Source = source;
    }

    if (entity) {
      where.AL01Entity = entity;
    }

    if (userId) {
      where.AL01UserId = userId;
    }

    if (cooperativaId) {
      where.AL01CooperativaId = cooperativaId;
    }

    /* =========================
     * RANGO DE FECHAS
     * ========================= */

    if (fechaInicio || fechaFin) {
      where.AL01CreatedAt = {};

      if (fechaInicio) {
        where.AL01CreatedAt.gte = new Date(fechaInicio);
      }

      if (fechaFin) {
        where.AL01CreatedAt.lte = new Date(fechaFin);
      }
    }

    console.log({fechaInicio, fechaFin});
    

    /* =========================
     * BÚSQUEDA GLOBAL
     * ========================= */

    const OR: any[] = [];

    if (searchText && searchText.trim() !== '') {
      const term = searchText.trim();

      OR.push(
        { AL01UserNombre: { contains: term, mode: 'insensitive' } },
        { AL01Entity: { contains: term, mode: 'insensitive' } },
        { AL01EntityId: { contains: term } },
        { AL01EventName: { contains: term, mode: 'insensitive' } },
        { AL01Message: { contains: term, mode: 'insensitive' } },
        { AL01Service: { contains: term, mode: 'insensitive' } },
        { AL01Module: { contains: term, mode: 'insensitive' } },
      );
    }

    if (OR.length > 0) {
      where.OR = OR;
    }

    /* =========================
     * FILTROS PRIME NG (AND)
     * ========================= */   

    Object.assign(
      where,
      buildActivityLogWhereFromPrimeFilters(filters || undefined),
    );

    return where;
  }


}
