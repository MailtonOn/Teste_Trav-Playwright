import { test } from '@playwright/test'
import { HomePage } from '../support/pages/home'
import { LoginPage } from '../support/pages/login'
import { TravPage } from '../support/pages/trav'
import { EmployeeModel, TravelModel, GoTravelModel } from '../fixtures/travel.model'
import travel from '../fixtures/travel.json'

let loginPage: LoginPage
let homePage: HomePage
let travPage: TravPage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  homePage = new HomePage(page)
  travPage = new TravPage(page)

  await loginPage.goToLogin()
})

test.describe('Travel test', () => {
  const trips = travel.goTravel as GoTravelModel
  test('Deve criar um novo colaborador', async () => {
    const Employee = travel.new as unknown as EmployeeModel

    await travPage.goToEmployees()
    await travPage.fill(Employee)
    await travPage.saveEmployee()
    await travPage.successMessage()
  })
  test('Deve convidar um colaborador', async () => {
    const Employee = travel.toInvite as unknown as EmployeeModel

    await travPage.goToEmployees()
    await travPage.toInvite()
    await travPage.fillInvite(Employee)
    await travPage.sendInvite()
  })
  test.only('Deve fazer uma reserva de aereo ida e volta', async () => {
    const trip = travel.aereo as TravelModel
    const passe = travel.new as unknown as TravelModel
    await homePage.goTo(trips)
    await travPage.fillPassenger(passe)
    await travPage.fillBookFlight(trip)
    await travPage.searchTicket()
  } )
})
