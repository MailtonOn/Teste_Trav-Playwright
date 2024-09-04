import { faker } from '@faker-js/faker';
import { generate } from 'gerador-validador-cpf';

const commonSelectors = [
  '.q-placeholder',
  '.q-placeholder',
  '.q-placeholder',
  '.q-placeholder',
  '.q-placeholder',
  '.q-placeholder',
  '.q-placeholder',
  '.q-placeholder',
  '.q-placeholder'
];

export const getEmployeeFields = (payload) => {
  const inviteSelectors = commonSelectors.slice(0, 9);
  return {
    selectors: inviteSelectors,
    values: [
      faker.person.fullName(),
      faker.person.firstName(),
      faker.person.lastName(),
      generate(),
      payload.nationality,
      faker.finance.accountNumber(),
      faker.internet.email(),
      payload.birthdate,
      payload.function
    ],
    nthIndices: [1, 2, 3, 4, 5, 7, 9, 10, 13 ]
  };
};

export const getInviteFields = (payload) => {
  const inviteSelectors = commonSelectors.slice(0, 2);
  return {
    selectors: inviteSelectors,
    values: [faker.internet.email(), payload.function],
    nthIndices: [1, 2]
  };
};

export const getTravelerFields = (payload) => {
  const inviteSelectors = commonSelectors.slice(0, 2);
  return {
    selectors: inviteSelectors,
    values: [payload.lastName, payload.firstName],
    nthIndices: [8, 0]
  };
};
