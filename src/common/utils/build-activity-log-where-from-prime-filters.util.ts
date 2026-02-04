import { mapPrimeConstraintToPrisma } from './prime-prisma-filter.helper';

export const ActivityLogFilterMap: Record<string, string> = {
  service: 'AL01Service',
  module: 'AL01Module',
  action: 'AL01Action',
  result: 'AL01Result',
  source: 'AL01Source',
  eventName: 'AL01EventName',

  entity: 'AL01Entity',
  entityId: 'AL01EntityId',

  userId: 'AL01UserId',
  userNombre: 'AL01UserNombre',
  userRol: 'AL01UserRol',

  cooperativaId: 'AL01CooperativaId',
  sucursalId: 'AL01SucursalId',
};

export function buildActivityLogWhereFromPrimeFilters(
  filters?: Record<string, any>,
): { AND?: any[] } {

  if (!filters) return {};

  const AND: any[] = [];

  for (const [uiField, meta] of Object.entries(filters)) {
    if (!meta) continue;

    const prismaField = ActivityLogFilterMap[uiField];
    if (!prismaField) continue; // 👈 campo no soportado

    const constraints = Array.isArray(meta)
      ? meta
      : meta.constraints ?? [];

    for (const constraint of constraints) {
      if (
        constraint?.value === null ||
        constraint?.value === undefined ||
        constraint?.value === ''
      ) {
        continue;
      }

      /**
       * 🔑 CLAVE:
       * Reutilizamos el helper existente,
       * pero usando el nombre REAL de Prisma
       */
      const mapped = mapPrimeConstraintToPrisma(
        prismaField,
        constraint,
      );

      if (Object.keys(mapped).length) {
        AND.push(mapped);
      }
    }
  }

  return AND.length ? { AND } : {};
}
