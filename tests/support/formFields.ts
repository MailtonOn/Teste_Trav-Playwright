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
    '.q-placeholder',
    '.q-placeholder'
  ];

export const getEmployeeFields = (payload) => {
  const inviteSelectors = commonSelectors.slice(0, 10);
  return {
    selectors:  inviteSelectors,
    values: [
      faker.person.fullName(),
      faker.person.firstName(),
      faker.person.lastName(),
      generate(),
      payload.nationality,
      faker.finance.accountNumber(),
      faker.internet.email(),
      payload.birthdate,
      faker.finance.accountNumber(),
      payload.function
    ],
    nthIndices: [1, 2, 3, 4, 5, 7, 9, 10, 13, 15]
  };
};

export const getInviteFields = (payload) => {
  const inviteSelectors = commonSelectors.slice(0, 3);
  return {
    selectors: inviteSelectors,
    values: [faker.internet.email(), faker.finance.accountNumber(), payload.function],
    nthIndices: [1, 2, 4]
  };
};

export const getTravelerFields = (payload) => {
  return {
    selectors: commonSelectors,
    values: [
      payload.firstName,
    ],
    nthIndices: [0]
  };
};
