import { db } from '../config/firebase';
import logger from '../utilities/logger';

export interface QueryFilter {
  field: string;
  op: FirebaseFirestore.WhereFilterOp;
  value: any;
}

export interface QuerySort {
  field: string;
  direction?: 'asc' | 'desc';
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: QuerySort[];
  limit?: number;
  startAfter?: any;
}

export interface QueryResult<T> {
  results: T[];
  total: number;
  hasNext: boolean;
}

export class BaseRepository<T extends { id?: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getById(id: string): Promise<T | null> {
    try {
      const doc = await db.collection(this.collectionName).doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as T;
    } catch (error: any) {
      logger.error(`Error fetching document by ID from ${this.collectionName}: ${error.message}`);
      throw error;
    }
  }

  async getAll(): Promise<T[]> {
    try {
      const snapshot = await db.collection(this.collectionName).get();
      const results: T[] = [];
      snapshot.forEach((doc: any) => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });
      return results;
    } catch (error: any) {
      logger.error(`Error listing documents from ${this.collectionName}: ${error.message}`);
      throw error;
    }
  }

  async query(field: string, op: FirebaseFirestore.WhereFilterOp, value: any): Promise<T[]> {
    try {
      const snapshot = await db.collection(this.collectionName).where(field, op, value).get();
      const results: T[] = [];
      snapshot.forEach((doc: any) => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });
      return results;
    } catch (error: any) {
      logger.error(`Error querying documents from ${this.collectionName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Advanced query supporting multi-field filtering, sorting, limit and cursor-based pagination
   */
  async queryAdvanced(options: QueryOptions): Promise<QueryResult<T>> {
    try {
      let queryRef = db.collection(this.collectionName);

      // Apply filters
      if (options.filters && options.filters.length > 0) {
        for (const filter of options.filters) {
          queryRef = queryRef.where(filter.field, filter.op, filter.value);
        }
      }

      // Get count of matching documents (before limit is applied)
      const countSnapshot = await queryRef.count().get();
      const total = countSnapshot.data().count;

      // Apply sorting
      if (options.orderBy && options.orderBy.length > 0) {
        for (const sort of options.orderBy) {
          queryRef = queryRef.orderBy(sort.field, sort.direction || 'asc');
        }
      }

      // Apply startAfter cursor
      if (options.startAfter) {
        queryRef = queryRef.startAfter(options.startAfter);
      }

      // Apply limit (add +1 to determine if hasNext is true)
      const limitVal = options.limit || 10;
      queryRef = queryRef.limit(limitVal + 1);

      const snapshot = await queryRef.get();
      const results: T[] = [];
      snapshot.forEach((doc: any) => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });

      const hasNext = results.length > limitVal;
      if (hasNext) {
        results.pop(); // Remove extra record
      }

      return {
        results,
        total,
        hasNext,
      };
    } catch (error: any) {
      logger.error(`Error in advanced query from ${this.collectionName}: ${error.message}`);
      throw error;
    }
  }

  async create(data: Omit<T, 'id'> & { id?: string }): Promise<T> {
    try {
      let docRef;
      if (data.id) {
        docRef = db.collection(this.collectionName).doc(data.id);
        await docRef.set(data);
      } else {
        docRef = await db.collection(this.collectionName).add(data);
      }
      return { id: docRef.id, ...data } as T;
    } catch (error: any) {
      logger.error(`Error creating document in ${this.collectionName}: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<boolean> {
    try {
      await db.collection(this.collectionName).doc(id).update(data);
      return true;
    } catch (error: any) {
      logger.error(`Error updating document in ${this.collectionName}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await db.collection(this.collectionName).doc(id).delete();
      return true;
    } catch (error: any) {
      logger.error(`Error deleting document in ${this.collectionName}: ${error.message}`);
      throw error;
    }
  }
}
export default BaseRepository;
