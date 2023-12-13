import { TravModel } from '../fixtures/travel.model';
import { test } from '@playwright/test'
import { LoginPage } from '../support/pages/login'
import { TravPage } from '../support/pages/trav'
import travel from '../fixtures/travel.json'

let loginPage: LoginPage
let travPage: TravPage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  travPage = new TravPage(page)

  await loginPage.goToLogin()
})

test.describe('New Employee', () => {
  test.only('Deve criar um novo colaborador', async () => {
    const trav = travel.new as unknown as TravModel

    await travPage.goToEmployees()
    await travPage.fill(trav)
    await travPage.saveEmployee()
    await travPage.successMessage()
  })
  test('Deve convidar um colaborador', async () => {
    const trav = travel.toInvite as unknown as TravModel

    await travPage.goToEmployees()
    await travPage.toInvite()
    await travPage.fillInvite(trav)
    await travPage.sendInvite()
  })

  test('Deve criar uma despesa por distância', async () => {
    const trav = travel.distance as unknown as TravModel

    await travPage.goToEmployees()
    await travPage.saveEmployee()
    await travPage.successMessage()
  })

  test('Deve criar uma despesa por distância não reembolsável', async () => {
    const trav = travel.distanceNotRefundable as unknown as TravModel

    await travPage.goToEmployees()
    await travPage.toInvite()
    await travPage.saveEmployee()
    await travPage.successMessage()
  })

  test('Deve criar uma despesa por distância com pontos no mapa', async () => {
    const trav = travel.mapDistance as unknown as TravModel

    await travPage.goToEmployees()
    await travPage.fillMapDistance(trav)
    await travPage.calculateDistance()
    await travPage.saveEmployee()
    await travPage.successMessage()
  })

  test('Deve criar uma despesa por distância com pontos no mapa sem o recibo', async () => {
    const trav = travel.mapDistanceNoReceipt as unknown as TravModel

    await travPage.goToEmployees()
    await travPage.fillMapDistance(trav)
    await travPage.noReceipt()
    await travPage.saveEmployee()
    await travPage.successMessage()
  })
})
