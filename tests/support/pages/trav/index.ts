import { Page, expect } from '@playwright/test';
import { dateComponents } from '../../helpers';
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
        await this.page.fill('.col-12 .q-field__native.q-placeholder >> nth=1', faker.person.fullName())
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=0', faker.person.firstName())
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=1', faker.person.lastName())
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=2', generate())
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=3', payload.nationality)
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=4', faker.finance.account())
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=5', faker.finance.account())
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=7', faker.internet.email())
        await this.page.fill('.col-12 .q-field__native.q-placeholder >> nth=2', payload.birthdate )
        await this.page.waitForSelector('.col-6 .q-field__input.q-placeholder.col >> nth=0', { state: 'visible' })
        await this.page.fill(`.col-6 .q-field__input.q-placeholder.col >> nth=0`, payload.function)
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
        await this.page.fill('.col-6 .q-field__native.q-placeholder >> nth=0', faker.internet.email())
        await this.page.waitForSelector('.col-6 .q-field__input.q-placeholder.col >> nth=0', { state: 'visible' })
        await this.page.fill(`.col-6 .q-field__input.q-placeholder.col >> nth=0`, payload.function)
        await this.page.click(`.q-item__section:has-text("${payload.function}")`)

    }

    async sendInvite() {
        await this.page.getByRole('button', { name: "Convidar", exact: true }).nth(1).click()
        await expect(this.page.locator('#swal2-content')).toHaveText('Aguarde enquanto processamos...')
        await expect(this.page.locator('#swal2-content')).toHaveText('Usuário convidado')
    }
    async fillBookFlight(payload) {
        //await this.page.locator('a[href$="flight"]').click()

        for (const char of payload.partida) {
            await this.page.fill('.q-field__control >> nth=0',
                await this.page.inputValue('.q-field__control >> nth=0') + char)
            await this.page.waitForTimeout(200)
        }
        await this.page.waitForSelector(`.q-item__section:has-text("${payload.code1}")`)
        await this.page.click(`.q-item__section:has-text("${payload.code1}")`)

        for (const char of payload.destino) {
            await this.page.fill('.q-field__control >> nth=1',
                await this.page.inputValue('.q-field__control >> nth=1') + char)
            await this.page.waitForTimeout(250)
        }
        await this.page.waitForSelector(`.q-item__section:has-text("${payload.code2}")`)
        await this.page.click(`.q-item__section:has-text("${payload.code2}")`)

        await this.page.getByPlaceholder('Datas de Ida e Volta').click()
        await expect(this.page.locator('#calendarsModal')).toBeEnabled()

        await this.fillDate(payload.goDay)
        await this.fillDate(payload.backDay)
    }

    async fillDate (payload) {
        const { day, month } = dateComponents(payload)
        const calendarIndex = await this.navigateToCorrectMonth(month)

        await this.navigateToCorrectMonth(month)
        await this.selectDay(calendarIndex, day)
    }

    async selectDay(calendarIndex, day) {
        await this.page.waitForSelector(`#calendar${calendarIndex} .q-btn__content:has-text("${day}")`, { state: 'visible' })
        await this.page.click(`#calendar${calendarIndex} .q-btn__content:has-text("${day}")`)
    }

    async navigateToCorrectMonth(month) {
        const expectedMonth = month.charAt(0).toUpperCase() + month.slice(1)

        let calendarIndex = 1
        
        while (true) {
            await this.page.waitForSelector(`#calendar${calendarIndex} .q-date__header-subtitle`, { state: 'attached' })
            
            let monthText = await this.page.textContent(`#calendar${calendarIndex} .q-date__header-subtitle`)

            if (monthText) {
                monthText = monthText.trim().charAt(0).toUpperCase() + monthText.trim().slice(1)
                if (monthText.includes(expectedMonth)) {
                    console.log(`Mês encontrado: ${monthText}`)
                    return calendarIndex
                }
            }

            if (calendarIndex === 2) {
                await this.page.click('.q-btn--standard >> nth=1')
                calendarIndex = 1
            } else {
                calendarIndex++
            }
        }
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

