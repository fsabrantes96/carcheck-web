import type { components } from './schema';

type Schemas = components['schemas'];

export type AppointmentStatus = Schemas['AppointmentStatus'];
export type AppointmentAction = Schemas['AppointmentAction'];
export type AppointmentActor = Schemas['AppointmentActor'];
export type Role = Schemas['Role'];

/**
 * Valor que o front usa no lugar de um enum ou code que ele não conhece.
 * Os enums de resposta e o ErrorCode são abertos no contrato ("a lista pode
 * crescer"): valor novo nunca pode quebrar a tela.
 */
export const UNKNOWN = 'UNKNOWN';
export type Unknown = typeof UNKNOWN;

/**
 * Lista em runtime de todos os valores de um enum do contrato (os tipos
 * gerados são só `.d.ts`). Se o contrato ganhar um valor que a lista não
 * tem, o typecheck falha apontando o que falta.
 */
function allValues<T extends string>() {
  return <const L extends readonly T[]>(
    values: L &
      ([T] extends [L[number]]
        ? unknown
        : { faltamValoresDoContrato: Exclude<T, L[number]> }),
  ): L => values;
}

export const APPOINTMENT_STATUSES = allValues<AppointmentStatus>()([
  'REQUESTED',
  'ACCEPTED',
  'AWAITING_PAYMENT',
  'PAID',
  'REPORT_SUBMITTED',
  'DISPUTED',
  'COMPLETED',
  'DECLINED',
  'CANCELLED',
  'EXPIRED',
]);

export const APPOINTMENT_ACTIONS = allValues<AppointmentAction>()([
  'ACCEPT',
  'DECLINE',
  'CONFIRM',
  'CANCEL',
]);

export const APPOINTMENT_ACTORS = allValues<AppointmentActor>()([
  'BUYER',
  'SELLER',
  'INSPECTOR',
  'SYSTEM',
]);

export const ROLES = allValues<Role>()(['USER', 'INSPECTOR', 'ADMIN']);

/**
 * Devolve o valor se ele for conhecido, ou UNKNOWN se não for. Use ao
 * exibir ou decidir por um enum aberto vindo da API.
 */
export function knownOr<T extends string>(
  value: unknown,
  knownValues: readonly T[],
): T | Unknown {
  return typeof value === 'string' &&
    (knownValues as readonly string[]).includes(value)
    ? (value as T)
    : UNKNOWN;
}
