import { Page, expect, Locator } from '@playwright/test'

export class ExpensePage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goToExpenses() {
        await this.page.waitForLoadState('load')
        await this.page.waitForSelector('li[data-id="2"]', { state: 'visible', timeout: 30000 })
        await this.page.hover('li[data-id="2"]')

        await this.page.click('#nav-sub-item:has-text("Despesas")')

        await this.page.click('.q-btn__wrapper:has-text("Despesa")')
    }

    async fill(payload) {
        await this.page.waitForSelector('.q-field:nth-of-type(1) input', { state: 'visible' })
        await this.page.fill('.q-field:nth-of-type(1) input', payload.category)
        await this.page.waitForSelector(`.q-item__section:has-text("${payload.category}")`, { state: 'visible' })
        await this.page.click(`.q-item__section:has-text("${payload.category}")`)

        await this.page.fill('.v-money', payload.value)

        await this.page.fill('.q-textarea', payload.description)

        await this.addEstablishment(payload.establishment)
    }

    async addEstablishment(payload) {
        await this.page.fill('input[placeholder="Pesquise ou crie um "]', payload)
        await this.page.press('input[placeholder="Pesquise ou crie um "]', 'Enter')
    }

    async saveExpense() {
        await this.page.getByRole('button', { name: "Salvar", exact: true }).click()
    }

    async successMessage() {
        await expect(this.page.locator('#swal2-content')).toHaveText('Aguarde enquanto processamos...', { timeout: 20000 })
        await expect(this.page.locator('#swal2-content')).toHaveText('Despesa Salva!', { timeout: 90000 })
    }

    async noRefundable() {
        await this.page.click('.q-toggle__inner--truthy')
    }

    async fillDistance(payload) {
        await this.page.click('.q-tab__label:has-text("Distância")')

        await this.page.fill('.v-money', payload.km)

        await this.page.fill('.q-textarea', payload.description)

        await this.addEstablishment(payload.establishment)
    }

    async fillMapDistance(payload) {
        await this.page.waitForSelector('.q-tab__label:has-text("Distância")', { state: 'visible' })
        await this.page.click('.q-tab__label:has-text("Distância")')

        await this.page.click('.q-toggle__label:has-text("Preencha com o mapa")')

        await this.page.waitForSelector('#googleMap', { state: 'visible' })
        await expect(this.page.locator('#googleMap')).toBeVisible()

        await this.page.hover('.q-btn__content:has-text("Calcular")')
        await expect(this.page.locator('.q-tooltip')).toHaveText('Ao clicar em calcular será gerado um recibo da Despesa.')

        await this.page.locator('input[placeholder="Ponto A"]').fill(payload.pointA)
        await this.page.click(`.q-item:has-text("${payload.selectPointA}")`)

        await this.page.locator('input[placeholder="Ponto B"]').fill(payload.pointB)
        await this.page.click(`.q-item:has-text("${payload.selectPointB}")`)

        await this.page.fill('.q-textarea', payload.description)

        await this.addEstablishment(payload.establishment)
    }

    async calculateDistance() {
        await this.page.waitForSelector('button:has-text("Calcular"):not(.disabled)', { state: 'visible', timeout: 9000 })
        await this.page.click('.q-btn__content:has-text("Calcular")')
    }

    async noReceipt() {
        await this.page.click('.q-toggle__label:has-text("Exportar mapa para recibo")')

        await this.calculateDistance()

        await expect(this.page.locator('.annex-receipt')).toHaveText('Anexe recibosClique ou arraste para anexar')
    }

    async addReport(payload) {
        await this.page.fill('input[placeholder="Selecionar"]', payload)
        await this.page.click(`.q-item__section:has-text("${payload}")`)
    }

    async removeReport() {
        await this.page.waitForSelector('.q-field__focusable-action >> nth=2', { state: 'visible', timeout: 1000 })
        await this.page.click('.q-field__focusable-action >> nth=2')
    }

    async removeReceipt() {
        await this.page.waitForSelector('.mdi-delete-circle', { state: 'visible', timeout: 1000 })
        await this.page.click('.mdi-delete-circle')
    }

}

