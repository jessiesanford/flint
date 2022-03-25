import {BaseCollection} from "./baseCollection";
import {PaymentModel} from "../models/paymentModel";

export class PaymentCollection extends BaseCollection {
  public static DefaultModel =  PaymentModel;

  constructor(db, collectionKey) {
    super(db, collectionKey);
  }
}