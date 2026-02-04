import { registerEnumType } from "@nestjs/graphql";

export enum AuditSourceEnum {
    API = 'API',
    SYSTEM = 'SYSTEM',
    JOB = 'JOB',
    MIGRATION = 'MIGRATION',
}

registerEnumType(AuditSourceEnum, { name: 'AuditSourceEnum' });