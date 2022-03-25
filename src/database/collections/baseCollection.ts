import {RxDatabase, RxCollection} from "rxdb";
import {BaseModel} from "../models/baseModel";

/**
 * Base collection for db (for extension), handles crud operations for db collections
 */
export class BaseCollection {
  db: RxDatabase;
  collection: RxCollection;
  public static DefaultModel: any = BaseModel;

  constructor(db, collectionKey) {
    this.db = db;
    this.collection = db[collectionKey];
  }

  subscribe(callback) {
    return this.collection.$.subscribe(callback);
  }

  /**
   * creates a db item based on model and then inserts into respective collection
   * @param items
   */
  add(items) {
    const added = []
    for (let i = 0; i < items.length; i++) {
      const clazz = this.resolveModel() as unknown as typeof BaseModel;
      const filled = clazz.create(items[i]);
      added.push(filled);
    }
    return this.collection.bulkInsert(added);
  }

  get(sortBy = 'timestamp') : Promise<Array<RxDatabase>> {
    return this.collection.find().sort(sortBy).exec();
  }

  findByIds(ids) : Promise<Map<string, RxDatabase>> {
    return this.collection.findByIds(ids);
  }

  delete(ids: Array<string>) : Promise<{success: any[], error: any[]}> {
    return this.collection.bulkRemove(ids);
  }

  /**
   * Resolves the model based on collection type
   * @protected
   */
  protected resolveModel() {
    return (<typeof BaseCollection>this.constructor).DefaultModel
  }
}