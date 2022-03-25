let toolForm = 'form.tool__form';
let clientNameInput = '.tool__form input#client-name';
let payeeNameInput = '.tool__form input#payee-name';
let amountInput = '.tool__form input#amount';
let dateInput = '.tool__form input#date';
let noteTextarea = '.tool__form textarea#note';

describe('Expense Tracker - Initial Load', () => {
  // purge the indexdb databases for a clean testing env
  indexedDB.databases().then((databases) => {
    databases.forEach((db) => {indexedDB.deleteDatabase(db.name)})
  });

  it('Visit Track Expenses', () => {
    cy.visit('localhost:9999');
    cy.wait(3000);
    cy.get(`.navigation__item[id=expenseTracker]`).click();
    cy.wait(500);
    cy.get(`.sidebar__collapser`).click();
    cy.get('.tool__heading').contains('Track Expenses');
  })
});

describe('Expense Tracker - Form Error Handling', () => {
  it('submits an "empty" payment form', () => {
    cy.get(dateInput).clear(); // date defaults to "today" but the user can still clear it
    cy.get(toolForm).submit();

    cy.get('.form__error[data-error-id=clientName]').contains('This field is required.');
    cy.get('.form__error[data-error-id=payeeName]').contains('This field is required.');
    cy.get('.form__error[data-error-id=date]').contains('This field is required.');
    cy.get('.form__error[data-error-id=amount]').contains('Must be greater than $0.00');
  });

  it('enters non-currency string into amount input', () => {
    cy.get(amountInput).clear();
    cy.get(amountInput).type("this should be replaced by formatting function");
    cy.get(amountInput).blur();
    cy.get(amountInput).should('have.value', '$0.00');
  });

  it('enters a currency string with multiple currency symbols', () => {
    cy.get(amountInput).clear();
    cy.get(amountInput).type("5$035$3");
    cy.get(amountInput).blur();
    cy.get(amountInput).should('have.value', '$50,353.00');
  });

  it('enters currency string with decimal to the 3rd place which rounds up', () => {
    cy.get(amountInput).clear();
    cy.get(amountInput).type("56.009");
    cy.get(amountInput).blur();
    cy.get(amountInput).should('have.value', '$56.01');
  });

  it('enters currency string with a decical to the 3rd place which rounds down', () => {
    cy.get(amountInput).clear();
    cy.get(amountInput).type("56.00009");
    cy.get(amountInput).blur();
    cy.get(amountInput).should('have.value', '$56.00');
  });
});

describe('Expense Tracker - Recording an expense', () => {
  let clientName = "John Doe";
  let payeeName = "Samuel Robertson";
  let amount = "137.45";
  let date = "2022-03-10";
  let note = "This is a note attached to an expense record!";

  it("enters valid information into the payment form", () => {
    cy.get(clientNameInput).type(clientName)
    cy.get(payeeNameInput).type(payeeName)
    cy.get(amountInput).clear();
    cy.get(amountInput).type(amount);
    cy.get(dateInput).type(date);
    cy.get(noteTextarea).type(note);
    cy.get(toolForm).submit();
  });

  it("checks that form has been cleared after submission", () => {
    // might take a moment for the entry to be added to the database and reflected in the UI.
    cy.wait(1000);
    cy.get('.expenses-ledger .table__cell:nth-child(1)').should('have.value', '');
    cy.get('.expenses-ledger .table__cell:nth-child(2)').should('have.value', '');
    cy.get('.expenses-ledger .table__cell:nth-child(4)').should('have.value', '');
  });

  it("checks payment ledger for the previously submitted record", () => {
    cy.get('.expenses-ledger .table__cell:nth-child(1)').contains(clientName);
    cy.get('.expenses-ledger .table__cell:nth-child(2)').contains(payeeName);
    cy.get('.expenses-ledger .table__cell:nth-child(3)').contains("$137.45");
    cy.get('.expenses-ledger .table__cell:nth-child(4)').contains("March 9 2022");
    cy.get('.expenses-ledger .table__cell:nth-child(5)').contains(note);
  });
});