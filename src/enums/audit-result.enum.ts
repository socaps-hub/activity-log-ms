import { registerEnumType } from "@nestjs/graphql";

export enum AuditResultEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
registerEnumType(AuditResultEnum, { name: 'AuditResultEnum' });