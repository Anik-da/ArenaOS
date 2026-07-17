/**
 * ARES AI Platform — Repository Interfaces
 */

export interface IQueryFilter {
  field: string;
  op: FirebaseFirestore.WhereFilterOp;
  value: any;
}

export interface IQuerySort {
  field: string;
  direction?: 'asc' | 'desc';
}

export interface IQueryOptions {
  filters?: IQueryFilter[];
  orderBy?: IQuerySort[];
  limit?: number;
  startAfter?: any;
}

export interface IQueryResult<T> {
  results: T[];
  total: number;
  hasNext: boolean;
}

export interface IBaseRepository<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  query(field: string, op: FirebaseFirestore.WhereFilterOp, value: any): Promise<T[]>;
  queryAdvanced(options: IQueryOptions): Promise<IQueryResult<T>>;
  create(data: Omit<T, 'id'> & { id?: string }): Promise<T>;
  update(id: string, data: Partial<T>): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
