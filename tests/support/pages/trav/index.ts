import { Page, expect } from '@playwright/test';
import { generate } from 'gerador-validador-cpf';
import { faker } from '@faker-js/faker';

export class TravPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goToEmployees() {
        await this.page.waitForLoadState('load')
        await this.page.waitForSelector('li[data-id="5"]', { state: 'visible', timeout: 30000 })
        await this.page.hover('li[data-id="5"]')

        await this.page.click('#nav-sub-item:has-text("Colaboradores")')
    }

    async fill(payload) {
        await this.page.click('.q-btn__wrapper:has-text("Colaborador")')
        await this.page.fill('//label[contains(text(),"Nome")]/following-sibling::label//input', faker.person.fullName())
        await this.page.fill('//label[contains(text(),"Primeiro")]/following-sibling::label//input', faker.person.firstName())
        await this.page.fill('//label[contains(text(),"Último")]/following-sibling::label//input', faker.person.lastName())
        await this.page.fill('//body/div[6]/div[2]/div/div[2]/div[2]/div[1]/label/div/div[1]', generate())
        await this.page.fill('//label[contains(text(),"Nacionalidade")]/following-sibling::label//input', payload.nationality)
        await this.page.fill('//body/div[6]/div[2]/div/div[2]/div[2]/div[3]/label', faker.finance.account())
        await this.page.fill('//body/div[6]/div[2]/div/div[2]/div[2]/div[4]/label[2]', faker.finance.account())
        await this.page.fill('//label[contains(text(),"E-mail")]/following-sibling::form//input', faker.internet.email())
        await this.page.fill('//label[contains(text(),"Data de Nasc")]/following-sibling::label//input', payload.birthdate )
        await this.page.waitForSelector('//label[contains(text(),"Função")]/following-sibling::label//input', { state: 'visible' })
        await this.page.fill(`//label[contains(text(),"Função")]/following-sibling::label//input`, payload.function)
        await this.page.click(`.q-item__section:has-text("${payload.function}")`)
    }


    async saveEmployee() {
        await this.page.getByRole('button', { name: "Cadastrar", exact: true }).click()
    }

    async successMessage() {
        await expect(this.page.locator('#swal2-content')).toHaveText('Aguarde enquanto processamos...')
        await expect(this.page.locator('#swal2-content')).toHaveText('Usuário cadastrado')
    }

    async toInvite() {
        await this.page.click('.q-btn__wrapper:has-text("Convidar")')
    }

    async fillInvite(payload) {
        await this.page.fill('//label[contains(text(),"E-mail")]/following-sibling::form//input', faker.internet.email())
        await this.page.waitForSelector('//label[contains(text(),"Função")]/following-sibling::label//input', { state: 'visible' })
        await this.page.fill(`//label[contains(text(),"Função")]/following-sibling::label//input`, payload.function)
        await this.page.click(`.q-item__section:has-text("${payload.function}")`)

    }

    async sendInvite() {
        await this.page.click('//body/div[6]/div[2]/div/div[3]/div/div[2]/button')
        // await this.page.getByRole('button', { name: "Convidar", exact: true }).click()
        await expect(this.page.locator('#swal2-content')).toHaveText('Aguarde enquanto processamos...')
        await expect(this.page.locator('#swal2-content')).toHaveText('Usuário convidado')
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

