import { Page, expect } from '@playwright/test'

require('dotenv').config()

export class LoginPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goToLogin() {
        await this.page.goto('/')

        const username = process.env.EMAIL || ""
        const password = process.env.PASSWORD || ""

        await this.page.type('#email', username)
        await this.page.fill('#password', password)

        await this.page.click('#button-submit')
    }
}



