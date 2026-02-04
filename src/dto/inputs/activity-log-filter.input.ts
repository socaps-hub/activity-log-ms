import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';

import { AuditActionEnum } from 'src/enums/audit-action.enum';
import { AuditResultEnum } from 'src/enums/audit-result.enum';
import { AuditSourceEnum } from 'src/enums/audit-source.enum';

@InputType()
export class ActivityLogFilterInput {

  /* =========================
   * FILTROS EXPLÍCITOS
   * ========================= */

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  service?: string; // supervision-ms, config-ms, auth-ms

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  module?: string; // solicitudes, cooperativas, auth

  @Field(() => AuditActionEnum, { nullable: true })
  @IsEnum(AuditActionEnum)
  @IsOptional()
  action?: AuditActionEnum;

  @Field(() => AuditResultEnum, { nullable: true })
  @IsEnum(AuditResultEnum)
  @IsOptional()
  result?: AuditResultEnum;

  @Field(() => AuditSourceEnum, { nullable: true })
  @IsEnum(AuditSourceEnum)
  @IsOptional()
  source?: AuditSourceEnum;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  entity?: string; // R01Prestamo, R17Cooperativas, BULK_OPERATION

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  userId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  cooperativaId?: string;

  /* =========================
   * RANGO DE FECHAS
   * ========================= */

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fechaInicio?: string; // ISO

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fechaFin?: string; // ISO

  /* =========================
   * BÚSQUEDA GLOBAL
   * ========================= */

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchText?: string;

  /* =========================
   * FILTROS PRIME NG
   * ========================= */

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  filters?: Record<string, any> | null;

  /* =========================
   * PAGINACIÓN
   * ========================= */

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  @IsOptional()
  paginado?: boolean;

  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Int, { defaultValue: 50 })
  @IsNumber()
  @IsOptional()
  pageSize?: number;

  /**
   * Offset real de PrimeNG (event.first)
   * Tiene prioridad sobre page
   */
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  first?: number | null;
}
