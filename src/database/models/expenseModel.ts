import {BaseModel} from "./baseModel";
import {get} from "lodash";

export type TExpense = {
  clientName: string,
  payeeName: string,
  amount: number,
  timestamp: number,
  note: string,
  id: string,
}

export class ExpenseModel extends BaseModel {
  constructor(db) {
    super(db);
  }

  public static defaultAttrs(data: Partial<TExpense>) : TExpense {
    return {
      ...BaseModel.defaultAttrs(data),
      clientName: get(data, "clientName", "Undefined"),
      payeeName: get(data, "payeeName", "Undefined"),
      amount: get(data, "amount", 0.00),
      note: get(data, "note", ""),
      timestamp: get(data, "date", Date.now()),
    }
  }
}