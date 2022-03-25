import {BaseCollection} from "./baseCollection";
import {ExpenseModel} from "../models/expenseModel";

export class ExpenseCollection extends BaseCollection {
  public static DefaultModel =  ExpenseModel;

  constructor(db, collectionKey) {
    super(db, collectionKey);
  }
}