import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { AuditActionEnum } from 'src/enums/audit-action.enum';
import { AuditResultEnum } from 'src/enums/audit-result.enum';
import { AuditSourceEnum } from 'src/enums/audit-source.enum';

@ObjectType()
export class ActivityLogDetailDto {

  @Field(() => String)
  id: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  service: string;

  @Field(() => String)
  module: string;

  @Field(() => AuditActionEnum)
  action: AuditActionEnum;

  @Field(() => AuditResultEnum)
  result: AuditResultEnum;

  @Field(() => AuditSourceEnum)
  source: AuditSourceEnum;

  @Field(() => String, { nullable: true })
  eventName?: string;

  /* =========================
   * ENTIDAD
   * ========================= */

  @Field(() => String)
  entity: string;

  @Field(() => String, { nullable: true })
  entityId?: string;

  /* =========================
   * USUARIO
   * ========================= */

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  userNombre?: string;

  @Field(() => String, { nullable: true })
  userRol?: string;

  /* =========================
   * CONTEXTO ORG
   * ========================= */

  @Field(() => String, { nullable: true })
  cooperativaId?: string;

  @Field(() => String, { nullable: true })
  sucursalId?: string;

  /* =========================
   * PAYLOADS
   * ========================= */

  @Field(() => GraphQLJSON, { nullable: true })
  before?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  after?: any;

  /* =========================
   * METADATA TÉCNICA
   * ========================= */

  @Field(() => GraphQLJSON, { nullable: true })
  meta?: {
    ip?: string;
    userAgent?: string;
    requestId?: string;
    correlationId?: string;
  };

  /* =========================
   * MENSAJES / ERRORES
   * ========================= */

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  error?: string;
}
