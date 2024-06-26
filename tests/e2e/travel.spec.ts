import { test } from '@playwright/test'
import { HomePage } from '../pages/home'
import { LoginPage } from '../pages/login'
import { TravPage } from '../pages/travel'
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
    const employee = travel.employee as EmployeeModel

    await travPage.goToEmployees()
    await travPage.toEmployees()
    await travPage.fillEmployees(employee)
    await travPage.saveEmployee()
    await travPage.successMessage()
  })
  test('Deve convidar um colaborador', async () => {
    const employee = travel.employee as EmployeeModel
    await travPage.goToEmployees()
    await travPage.toInvite()
    await travPage.fillInvite(employee)
    await travPage.sendInvite()
  })
  test('Deve fazer uma reserva de aereo ida e volta', async () => {
    const trip = travel.aereo as TravelModel
    const employee = travel.employee as EmployeeModel
    await homePage.goTo(trips)
    await homePage.goFlight(trips)
    await travPage.fillBookFlight(trip)
    await travPage.searchTicketFlight()
    await travPage.fillTraveler(employee)
  })
  test.only('Deve fazer um reserva de Automóvel', async () => {
    const employee = travel.employee as EmployeeModel
    const trip = travel.aereo as TravelModel
    await homePage.goTo(trips)
    await homePage.goAutomobile(trips)
    await travPage.fillBookAuto(trip)
    await travPage.searchTicketAuto()
    
  })


})
