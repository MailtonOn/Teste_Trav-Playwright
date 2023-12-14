import { EmployeeModel } from '../fixtures/travel.model';
import { test } from '@playwright/test'
import { LoginPage } from '../support/pages/login'
import { TravPage } from '../support/pages/trav'
import traveler from '../fixtures/travel.json'

let loginPage: LoginPage
let travPage: TravPage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  travPage = new TravPage(page)

  await loginPage.goToLogin()
})

test.describe('New Employee', () => {
  test.only('Deve criar um novo colaborador', async () => {
    const Employee = traveler.new as unknown as EmployeeModel

    await travPage.goToEmployees()
    await travPage.fill(Employee)
    await travPage.saveEmployee()
    await travPage.successMessage()
  })
  test('Deve convidar um colaborador', async () => {
    const Employee = traveler.toInvite as unknown as EmployeeModel

    await travPage.goToEmployees()
    await travPage.toInvite()
    await travPage.fillInvite(Employee)
    await travPage.sendInvite()
  })
})
