import { test } from '@playwright/test'
import { LoginPage } from '../pages/login'
import { ExpenseModel } from '../fixtures/expense.model'
import { ExpensePage } from '../pages/expense'
import expenses from '../fixtures/expenses.json'

let loginPage: LoginPage
let expensePage: ExpensePage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  expensePage = new ExpensePage(page)

  await loginPage.goToLogin()
})

test.describe('New Expense', () => {
  test('Deve criar uma nova despesa', async () => {
    const expense = expenses.new as ExpenseModel

    await expensePage.goToExpenses()
    await expensePage.fill(expense)
    await expensePage.saveExpense()
    await expensePage.successMessage()
  })
  test('Deve criar uma despesa não reembolsável', async () => {
    const expense = expenses.notRefundable as ExpenseModel

    await expensePage.goToExpenses()
    await expensePage.fill(expense)
    await expensePage.noRefundable()
    await expensePage.saveExpense()
    await expensePage.successMessage()
  })

  test('Deve criar uma despesa por distância', async () => {
    const expense = expenses.distance as ExpenseModel

    await expensePage.goToExpenses()
    await expensePage.fillDistance(expense)
    await expensePage.saveExpense()
    await expensePage.successMessage()
  })

  test('Deve criar uma despesa por distância não reembolsável', async () => {
    const expense = expenses.distanceNotRefundable as ExpenseModel

    await expensePage.goToExpenses()
    await expensePage.fillDistance(expense)
    await expensePage.noRefundable()
    await expensePage.saveExpense()
    await expensePage.successMessage()
  })

  test('Deve criar uma despesa por distância com pontos no mapa', async () => {
    const expense = expenses.mapDistance as ExpenseModel

    await expensePage.goToExpenses()
    await expensePage.fillMapDistance(expense)
    await expensePage.calculateDistance()
    await expensePage.saveExpense()
    await expensePage.successMessage()
  })

  test('Deve criar uma despesa por distância com pontos no mapa sem o recibo', async () => {
    const expense = expenses.mapDistanceNoReceipt as ExpenseModel

    await expensePage.goToExpenses()
    await expensePage.fillMapDistance(expense)
    await expensePage.noReceipt()
    await expensePage.saveExpense()
    await expensePage.successMessage()
  })
})
