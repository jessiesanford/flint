import {BaseModel} from "./baseModel";
import {get} from "lodash";

export type TPayment = {
  senderName: string,
  amount: number,
  timestamp: number,
  note: string,
  id: string,
}

export class PaymentModel extends BaseModel {
  constructor(db) {
    super(db);
  }

  public static defaultAttrs(data: Partial<TPayment>) : TPayment{
    return {
      ...BaseModel.defaultAttrs(data),
      senderName: get(data, "senderName", "Undefined"),
      amount: get(data, "amount", 0.00),
      note: get(data, "note", ""),
      timestamp: get(data, "date", Date.now()),
    }
  }
}