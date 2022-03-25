import {RxDatabase} from "rxdb";
import {v4 as uuid} from "uuid"

export class BaseModel {
  db: RxDatabase;

  constructor(db) {
    this.db = db;
  }

  public static create(data) {
    return this.defaultAttrs(data);
  }

  public static defaultAttrs(data: any) {
    return {
      id: data.id || uuid(),
    }
  }
}