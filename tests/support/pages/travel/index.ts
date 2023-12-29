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

    async fillEmployees(payload) {
        await this.page.click('.q-btn__wrapper:has-text("Colaborador")')
        // let colab12 = '.col-12'
        // let colab6 = '.col-6'
        // let fieldNative = '.q-field__native.q-placeholder'
        // let fieldInput = '.q-field__input.q-placeholder.col'

        const selectors = [
            '.col-12 .q-field__native.q-placeholder',
            '.col-6 .q-field__native.q-placeholder',
            '.col-6 .q-field__native.q-placeholder',
            '.col-6 .q-field__native.q-placeholder',
            '.col-6 .q-field__native.q-placeholder',
            '.col-6 .q-field__native.q-placeholder',
            '.col-6 .q-field__native.q-placeholder',
            '.col-6 .q-field__native.q-placeholder',
            '.col-12 .q-field__native.q-placeholder',
            '.col-6 .q-field__input.q-placeholder.col'
        ]

        const fieldValues = [
            faker.person.fullName(),
            faker.person.firstName(),
            faker.person.lastName(),
            generate(),
            payload.nationality,
            faker.finance.accountNumber(),
            faker.finance.accountNumber(),
            faker.internet.email(),
            payload.birthdate,
            payload.function
        ]

        const nthIndices = [1, 0, 1, 2, 3, 4, 5, 7, 2, 0]

        for (let i = 0; i < selectors.length; i++) {
            const selector = selectors[i];
            // const fieldValue = fieldValues[i];
            // const nthIndex = nthIndices[i];
    
            await this.page.fill(`${selector} >> nth=${nthIndices[i]}`, fieldValues[i]);
            
        }

    //     const nth = 'nth'
                
    //     await this.page.fill(`${colab12} ${fieldNative} >> ${nth}=1`, faker.person.fullName())
    //     await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=0`, faker.person.firstName())
    //     await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=1`, faker.person.lastName())
    //     await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=2`, generate())
    //     await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=3`, payload.nationality)
    //     await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=4`, faker.finance.accountNumber())
    //     await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=5`, faker.finance.accountNumber())
    //     await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=7`, faker.internet.email())
    //     await this.page.fill(`${colab12} ${fieldNative} >> ${nth}=2`, payload.birthdate )
    //     await this.page.waitForSelector(`${colab6} ${fieldInput} >> ${nth}=0`, { state: 'visible' })
    //     await this.page.fill(`${colab6} ${fieldInput} >> nth=0`, payload.function)
    //     await this.page.click(`.q-item__section:has-text("${payload.function}")`)
    await this.page.waitForSelector(`${selectors[9]} >> nth=0`, { state: 'visible' });
    await this.page.fill(`${selectors[9]} >> nth=0`, payload.function);
    await this.page.click(`.q-item__section:has-text("${payload.function}")`);


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
        // let colab6 = '.col-6'
        // let fieldNative = '.q-field__native.q-placeholder'
        // let itemSection = '.q-item__section'
        // let fieldInput = '.q-field__input.q-placeholder.col'
        const selectors = ['.col-6 .q-field__native.q-placeholder', '.q-field__input.q-placeholder.col'];
        const fieldValues = [faker.internet.email(), payload.function];
        for (let i = 0; i < selectors.length; i++) {
            await this.page.fill(`${selectors[i]} >> nth=0`, fieldValues[i]);
        }

        // const nth = 'nth'

        // await this.page.fill(`${colab6} ${fieldNative} >> ${nth}=0`, faker.internet.email())
        // await this.page.waitForSelector(`${fieldInput} >> ${nth}=0`, { state: 'visible' })
        // await this.page.fill(`${fieldInput} >> ${nth}=0`, payload.function)
        // await this.page.click(`${itemSection}:has-text("${payload.function}")`)
        await this.page.click(`.q-item__section:has-text("${payload.function}")`)

    }

    async sendInvite() {
        await this.page.getByRole('button', { name: "Convidar", exact: true }).nth(1).click()
        await expect(this.page.locator('#swal2-content')).toHaveText('Aguarde enquanto processamos...')
        await expect(this.page.locator('#swal2-content')).toHaveText('Usuário convidado')
    }

    async fillPassenger (payload) {
        let fieldControl = '.q-field__control'
        let itemSection = '.q-item__section'

        const nth = 'nth'

        await this.page.waitForSelector(`${fieldControl} >> ${nth}=0`, { state: 'visible' })
        await this.page.fill(`${fieldControl} >> ${nth}=0`, payload.FistName)
        await this.page.click(`${itemSection}:has-text("${payload.FistName}")`)

    }
    async fillBookFlight(payload) {
        //await this.page.locator('a[href$="flight"]').click()

        for (const char of payload.partida) {
            await this.page.fill('.q-field__control >> nth=1',
                await this.page.inputValue('.q-field__control >> nth=1') + char)
            await this.page.waitForTimeout(200)
        }
        await this.page.waitForSelector(`.q-item__section:has-text("${payload.code1}")`)
        await this.page.click(`.q-item__section:has-text("${payload.code1}")`)

        for (const char of payload.destino) {
            await this.page.fill('.q-field__control >> nth=2',
                await this.page.inputValue('.q-field__control >> nth=2') + char)
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

    async selectDay(calendarIndex: number, day: number) {
        await this.page.waitForSelector(`#calendar${calendarIndex} .q-btn__content:has-text("${day}")`, { state: 'visible' })
        await this.page.click(`#calendar${calendarIndex} .q-btn__content:has-text("${day}")`)
    }

    async navigateToCorrectMonth(month: string) {
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
    async searchTicket() {
        await this.page.getByRole('button', { name: "Buscar Passagem", exact: true }).nth(0).click()
    }
}

