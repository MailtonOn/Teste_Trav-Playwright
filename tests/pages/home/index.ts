import { Page, expect } from '@playwright/test'

export class HomePage {
    readonly page:Page

    constructor(page: Page){
        this.page = page
    }

    async goTo(payload) {
        await this.page.waitForLoadState('load')

        await this.page.waitForSelector(`li[data-id="${payload.dataIdValue}"]`, { state: 'visible', timeout: 30000 })
        await this.page.hover(`li[data-id="${payload.dataIdValue}"]`)

        await this.page.click(`#nav-sub-item:has-text("${payload.button}")`)

        await this.page.waitForSelector('.title-card', { state: 'visible', timeout: 3000 })
        await expect(this.page.locator('.title-card')).toHaveText(payload.title)
    }
}