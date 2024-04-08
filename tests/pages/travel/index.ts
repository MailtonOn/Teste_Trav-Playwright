import { Page, expect } from "@playwright/test";
import { dateComponents } from "../../support/helpers";
import {
  getEmployeeFields,
  getInviteFields,
  getTravelerFields,
} from "../../support/formFields";
import { EmployeeModel, TravelModel } from "../../fixtures/travel.model";
import { faker } from '@faker-js/faker'

export class TravPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToEmployees() {
    await this.page.waitForLoadState("load");
    await this.page.waitForSelector('li[data-id="5"]', {
      state: "visible",
      timeout: 60000,
    });
    await this.page.hover('li[data-id="5"]');

    await this.page.click('#nav-sub-item:has-text("Colaboradores")');
  }

  async toEmployees() {
    await this.page.click('.q-btn__wrapper:has-text("Colaborador")');
  }

  async fillForm(fields: {
    selectors: string[];
    values: string[];
    nthIndices: number[];
  }) {
    const { selectors, values, nthIndices } = fields;
    for (let i = 0; i < selectors.length; i++) {
      await this.page.fill(
        `${selectors[i]} >> nth=${nthIndices[i]}`,
        values[i]
      );
    }
  }

  async fillEmployees(payload: EmployeeModel) {
    const fields = getEmployeeFields(payload);

    await this.fillForm(fields);
    await this.page.click(`.q-item__section:has-text("${payload.function}")`);
  }

  async saveEmployee() {
    await this.page
      .getByRole("button", { name: "Cadastrar", exact: true })
      .click();
  }

  async successMessage() {
    await expect(this.page.locator("#swal2-content")).toHaveText(
      "Aguarde enquanto processamos..."
    );
    await expect(this.page.locator("#swal2-content")).toHaveText(
      "Usuário cadastrado"
    );
  }

  async toInvite() {
    await this.page.click('.q-btn__wrapper:has-text("Convidar")');
  }

  async fillInvite(payload: EmployeeModel) {
    const fields = getInviteFields(payload);

    await this.fillForm(fields);
    await this.page.click(`.q-item__section:has-text("${payload.function}")`);
  }

  async sendInvite() {
    await this.page
      .getByRole("button", { name: "Convidar", exact: true })
      .nth(1)
      .click();
    await expect(this.page.locator("#swal2-content")).toHaveText(
      "Aguarde enquanto processamos..."
    );
    await expect(this.page.locator("#swal2-content")).toHaveText(
      "Usuário convidado"
    );
  }

  async fillPassenger(payload: { FistName: string }) {
    let fieldControl = ".q-field__control";
    let itemSection = ".q-item__section";

    await this.page.waitForSelector(`${fieldControl} >> nth=0`, {
      state: "visible",
    });
    await this.page.fill(`${fieldControl} >> nth=0`, payload.FistName);
    await this.page.click(`${itemSection}:has-text("${payload.FistName}")`);
  }
  async fillBookFlight(payload: TravelModel) {
    for (const char of payload.partida) {
      await this.page.fill(
        ".q-field__control >> nth=0",
        (await this.page.inputValue(".q-field__control >> nth=0")) + char
      );
      await this.page.waitForTimeout(200);
    }
    await this.page.waitForSelector(
      `.q-item__section:has-text("${payload.partida}")`
    );
    await this.page.click(`.q-item__section:has-text("${payload.partida}")`);

    for (const char of payload.destino) {
      await this.page.fill(
        ".q-field__control >> nth=1",
        (await this.page.inputValue(".q-field__control >> nth=1")) + char
      );
      await this.page.waitForTimeout(250);
    }
    await this.page.waitForSelector(
      `.q-item__section:has-text("${payload.code2}")`
    );
    await this.page.click(`.q-item__section:has-text("${payload.code2}")`);

    await this.page.getByPlaceholder("Datas de Ida e Volta").click();
    await expect(this.page.locator("#calendarsModal")).toBeEnabled();

    await this.fillDate(payload.goDay);
    await this.fillDate(payload.backDay);
  }

  async fillBookAuto(payload: TravelModel) {

    for (const char of payload.partida) {
      await this.page.fill(
        ".q-field__input",
        (await this.page.inputValue(".q-field__input")) + char
      );
      await this.page.waitForTimeout(200);
    }
    await this.page.waitForSelector(`.onf-input-destination__item__left-content:has-text("${payload.partida}")`, {timeout:3000});
    await this.page.click(`.onf-input-destination__item__left-content:has-text("${payload.partida}")`);

    await this.page.getByPlaceholder("Selecione uma data").click();
    // await expect(this.page.locator("#calendarsModal")).toBeEnabled();

    await this.fillDate(payload.goDay);
    await this.fillDate(payload.backDay);

    await this.page.waitForSelector('#rental-car-search-input-return-hours >> nth=0', {
      state: "visible",
      timeout: 3000,
    });
    await this.page.click(`#rental-car-search-input-return-hours >> nth=0`, {timeout: 3000})
    await this.page.click(`.onf-select__field__popup__item:has-text("13:30")`)
  }
  async fillBookAutoToggle(payload: TravelModel) {
    await this.page.click(
      `#rental-car-search-toggle-different-return-location('Devolver em outra localidade')`
    );
    await this.page.getByRole("button", { name: "OK", exact: true }).click();

    for (const char of payload.destino) {
      await this.page.fill(
        ".q-field__control >> nth=4",
        (await this.page.inputValue(".q-field__control >> nth=4")) + char
      );
      await this.page.waitForTimeout(250);
    }
    await this.page.waitForSelector(`.q-item:has-text("${payload.destino}")`);
    await this.page.click(`.q-item:has-text("${payload.destino}")`);


  }

  async fillDate(payload: number) {
    const { day, month } = dateComponents(payload);
    const calendarIndex = await this.navigateToCorrectMonth(month);

    await this.navigateToCorrectMonth(month);
    await this.selectDay(day);
  }

  async selectDay( day: number) {
    day = faker.number.int(122)
    const selector = `.onf-month__day >> nth=${day}`;
    await this.page.waitForSelector(selector, { state: "visible", timeout: 5000 });
    await this.page.click(selector);
  }

  async navigateToCorrectMonth(month: string) {
    const expectedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    let calendarIndex = 1;

    while (true) {
      await this.page.waitForSelector(
        `.onf-date-picker-desktop__container__body__controls__section__current-page__month`,
        { state: "attached" }
      );

      let monthText = await this.page.textContent(
        `.onf-date-picker-desktop__container__body__controls__section__current-page__month`
      );

      if (monthText) {
        monthText =
          monthText.trim().charAt(0).toUpperCase() + monthText.trim().slice(1);
        if (monthText.includes(expectedMonth)) {
          return calendarIndex;
        }
      }

      if (calendarIndex === 2) {
        await this.page.click("#button-next-month-date-picker-rental-car-search-input-withdraw-date-picker");
        calendarIndex = 1;
      } else {
        calendarIndex++;
      }
    }
  }

  async searchTicketFlight() {
    const selectors = [
      ".flight-desktop-info",
      ".flight-fare-button",
      ".flight-desktop-info",
      ".flight-fare-button",
    ];

    await this.page
      .getByRole("button", { name: "Buscar", exact: true })
      .nth(0)
      .click();
    await expect(this.page.locator("#header-dialog-loading-search-card")).toHaveText("Quase lá...", {
      timeout: 30000,
    });

    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];

      await this.page.click(`${selector} >> nth=0`, { delay: 3000 });
    }
    await this.page
      .getByRole("button", { name: "Prosseguir", exact: true })
      .nth(0)
      .click();
    await expect(this.page.locator("#header-dialog-loading-search-card")).toHaveText("Aguarde...", {
      timeout: 30000,
    });
  }

  async searchTicketAuto() {
    const selectors = [
      ".flight-desktop-info",
      ".flight-fare-button",
      ".flight-desktop-info",
      ".flight-fare-button",
    ];

    await this.page
      .getByRole("button", { name: "Buscar", exact: true })
      .nth(0)
      .click();
    await expect(this.page.locator("#onf-dialog__title")).toHaveText("Estamos procurando...", {
      timeout: 6000,
    });

    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];

      await this.page.click(`${selector} >> nth=0`, { delay: 3000 });
    }
    await this.page
      .getByRole("button", { name: "Prosseguir", exact: true })
      .nth(0)
      .click();
    await expect(this.page.locator("#onf-dialog__title")).toHaveText("Aguarde...", {
      timeout: 30000,
    });
  }

  async fillTraveler(payload: EmployeeModel) {
    const fields = getTravelerFields(payload);

    await this.fillForm(fields);
    await this.page.click(`.q-item__section:has-text("${payload.firstName}")`);
    await this.page
      .getByRole("button", { name: "Reservar", exact: true })
      .nth(0)
      .click();
    await expect(this.page.locator("#swal2-title")).toHaveText("Aguarde...", {
      timeout: 30000,
    });
    await expect(this.page.locator("#swal2-title")).toHaveText("Sucesso", {
      timeout: 30000,
    });
  }
}
