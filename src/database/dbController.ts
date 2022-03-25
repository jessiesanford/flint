import {createDB} from "./dbConnection";
import {RxDatabase} from "rxdb";
import {PaymentCollection} from "./collections/paymentCollection";
import {ExpenseCollection} from "./collections/expenseCollection";

export const collectionTypes = {
  PAYMENTS: "payments",
  EXPENSES: "expenses",
}

/**
 * DBController yields access to our database instance and it's collections
 */
export class DBController {
  db: RxDatabase;
  paymentCollection: PaymentCollection;
  expenseCollection: ExpenseCollection;

  constructor() {
    this.db = null;
  }

  async init() {
    this.db = await createDB();
    this.paymentCollection = new PaymentCollection(this.db, collectionTypes.PAYMENTS);
    this.expenseCollection = new ExpenseCollection(this.db, collectionTypes.EXPENSES);
  }
}