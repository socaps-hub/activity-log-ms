import { Field, ObjectType } from '@nestjs/graphql';
import { AuditActionEnum } from 'src/enums/audit-action.enum';
import { AuditResultEnum } from 'src/enums/audit-result.enum';
import { AuditSourceEnum } from 'src/enums/audit-source.enum';

@ObjectType()
export class ActivityLogRowDto {

  @Field(() => String)
  id: string; // AL01Id (stringificado)

  @Field(() => String)
  createdAt: string; // ISO string

  @Field(() => String, { nullable: true })
  service?: string;

  @Field(() => String, { nullable: true })
  module?: string;

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
   * MENSAJE
   * ========================= */

  @Field(() => String, { nullable: true })
  message?: string;
}
