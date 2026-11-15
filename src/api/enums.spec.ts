import contract from '../../api/openapi.json';
import {
  APPOINTMENT_ACTIONS,
  APPOINTMENT_ACTORS,
  APPOINTMENT_STATUSES,
  knownOr,
  ROLES,
} from './enums';

describe('knownOr', () => {
  it('devolve o valor quando ele é conhecido', () => {
    expect(knownOr('ACCEPTED', APPOINTMENT_STATUSES)).toBe('ACCEPTED');
  });

  it('devolve UNKNOWN quando o valor é desconhecido', () => {
    expect(knownOr('STATUS_NOVO_QUALQUER', APPOINTMENT_STATUSES)).toBe(
      'UNKNOWN',
    );
  });

  it('diferencia maiúsculas de minúsculas', () => {
    expect(knownOr('accepted', APPOINTMENT_STATUSES)).toBe('UNKNOWN');
  });

  it.each([null, undefined, 42, {}])('devolve UNKNOWN para %s', (value) => {
    expect(knownOr(value, ROLES)).toBe('UNKNOWN');
  });
});

describe('listas de valores conhecidos', () => {
  const schemas = contract.components.schemas;

  it.each([
    ['AppointmentStatus', APPOINTMENT_STATUSES, schemas.AppointmentStatus.enum],
    ['AppointmentAction', APPOINTMENT_ACTIONS, schemas.AppointmentAction.enum],
    ['AppointmentActor', APPOINTMENT_ACTORS, schemas.AppointmentActor.enum],
    ['Role', ROLES, schemas.Role.enum],
  ])(
    '%s tem exatamente os valores do contrato',
    (_name, known, contractValues) => {
      expect([...known]).toEqual(contractValues);
    },
  );
});
