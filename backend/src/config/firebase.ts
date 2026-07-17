import * as admin from 'firebase-admin';
import logger from '../utilities/logger';

let db: any;
let auth: any;
let isMock = false;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const credentialBase64 = process.env.FIREBASE_CREDENTIAL_BASE64;

  if (credentialBase64) {
    const serviceAccount = JSON.parse(Buffer.from(credentialBase64, 'base64').toString('utf-8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    auth = admin.auth();
    logger.info('Firebase Admin SDK initialized successfully via Base64 Credentials.');
  } else if (serviceAccountPath) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    db = admin.firestore();
    auth = admin.auth();
    logger.info(`Firebase Admin SDK initialized successfully via path: ${serviceAccountPath}`);
  } else {
    throw new Error('No Firebase configuration details provided in environment variables.');
  }
} catch (error: any) {
  logger.warn(`Firebase initialization failed: ${error.message}. Initializing Mock Firestore/Auth Fallback.`);
  isMock = true;

  // Mock Database implementation for out-of-the-box local testing
  const mockStorage: Record<string, Record<string, any>> = {};

  class MockDocumentReference {
    constructor(private collectionName: string, private id: string) {}

    async get() {
      const data = mockStorage[this.collectionName]?.[this.id] || null;
      return {
        exists: !!data,
        id: this.id,
        data: () => data,
      };
    }

    async set(data: any) {
      if (!mockStorage[this.collectionName]) {
        mockStorage[this.collectionName] = {};
      }
      mockStorage[this.collectionName][this.id] = { ...data, id: this.id, updatedAt: new Date() };
      return { writeTime: new Date() };
    }

    async update(data: any) {
      if (!mockStorage[this.collectionName]?.[this.id]) {
        throw new Error(`Document ${this.id} not found in ${this.collectionName}`);
      }
      mockStorage[this.collectionName][this.id] = {
        ...mockStorage[this.collectionName][this.id],
        ...data,
        updatedAt: new Date(),
      };
      return { writeTime: new Date() };
    }

    async delete() {
      if (mockStorage[this.collectionName]?.[this.id]) {
        delete mockStorage[this.collectionName][this.id];
      }
      return { writeTime: new Date() };
    }
  }

  class MockQuery {
    private filters: { field: string; op: string; val: any }[] = [];
    private orderBys: { field: string; direction: 'asc' | 'desc' }[] = [];
    private limitVal?: number;
    private startAfterVal?: any;

    constructor(private collectionName: string) {}

    where(field: string, op: string, val: any) {
      const q = new MockQuery(this.collectionName);
      q.filters = [...this.filters, { field, op, val }];
      q.orderBys = [...this.orderBys];
      q.limitVal = this.limitVal;
      q.startAfterVal = this.startAfterVal;
      return q;
    }

    orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
      const q = new MockQuery(this.collectionName);
      q.filters = [...this.filters];
      q.orderBys = [...this.orderBys, { field, direction }];
      q.limitVal = this.limitVal;
      q.startAfterVal = this.startAfterVal;
      return q;
    }

    limit(num: number) {
      const q = new MockQuery(this.collectionName);
      q.filters = [...this.filters];
      q.orderBys = [...this.orderBys];
      q.limitVal = num;
      q.startAfterVal = this.startAfterVal;
      return q;
    }

    startAfter(val: any) {
      const q = new MockQuery(this.collectionName);
      q.filters = [...this.filters];
      q.orderBys = [...this.orderBys];
      q.limitVal = this.limitVal;
      q.startAfterVal = val;
      return q;
    }

    private execute() {
      let all = Object.values(mockStorage[this.collectionName] || {});

      // 1. Filter
      for (const f of this.filters) {
        all = all.filter((doc: any) => {
          const val = doc[f.field];
          if (f.op === '==') return val === f.val;
          if (f.op === '!=') return val !== f.val;
          if (f.op === '>=') return val >= f.val;
          if (f.op === '<=') return val <= f.val;
          if (f.op === '>') return val > f.val;
          if (f.op === '<') return val < f.val;
          if (f.op === 'array-contains') return Array.isArray(val) && val.includes(f.val);
          return true;
        });
      }

      // 2. Sort
      if (this.orderBys.length > 0) {
        all.sort((a: any, b: any) => {
          for (const ord of this.orderBys) {
            let valA = a[ord.field];
            let valB = b[ord.field];
            if (valA instanceof Date) valA = valA.getTime();
            if (valB instanceof Date) valB = valB.getTime();
            if (valA < valB) return ord.direction === 'asc' ? -1 : 1;
            if (valA > valB) return ord.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      // 3. Start After
      if (this.startAfterVal !== undefined && this.startAfterVal !== null) {
        const cursorId = typeof this.startAfterVal === 'object' ? this.startAfterVal.id : this.startAfterVal;
        const index = all.findIndex((doc: any) => doc.id === cursorId);
        if (index !== -1) {
          all = all.slice(index + 1);
        }
      }

      // 4. Limit
      if (this.limitVal !== undefined) {
        all = all.slice(0, this.limitVal);
      }

      return all.map((data: any) => ({
        id: data.id,
        exists: true,
        data: () => data,
      }));
    }

    async get() {
      const docs = this.execute();
      return {
        empty: docs.length === 0,
        docs,
        forEach: (callback: any) => docs.forEach(callback),
      };
    }

    count() {
      const docs = this.execute();
      return {
        get: async () => ({
          data: () => ({ count: docs.length })
        })
      };
    }
  }

  class MockCollectionReference {
    constructor(private name: string) {}

    doc(id?: string) {
      const docId = id || Math.random().toString(36).substring(2, 15);
      return new MockDocumentReference(this.name, docId);
    }

    async get() {
      return new MockQuery(this.name).get();
    }

    where(field: string, op: string, val: any) {
      return new MockQuery(this.name).where(field, op, val);
    }

    orderBy(field: string, direction?: 'asc' | 'desc') {
      return new MockQuery(this.name).orderBy(field, direction);
    }

    limit(num: number) {
      return new MockQuery(this.name).limit(num);
    }

    startAfter(val: any) {
      return new MockQuery(this.name).startAfter(val);
    }

    async add(data: any) {
      const id = Math.random().toString(36).substring(2, 15);
      if (!mockStorage[this.name]) {
        mockStorage[this.name] = {};
      }
      const record = { ...data, id, createdAt: new Date() };
      mockStorage[this.name][id] = record;
      return new MockDocumentReference(this.name, id);
    }
  }

  class MockFirestore {
    collection(name: string) {
      return new MockCollectionReference(name);
    }
  }

  class MockAuth {
    async verifyIdToken(token: string) {
      if (token === 'valid-admin-token') {
        return { uid: 'admin_test_uid', email: 'admin@ares.ai', role: 'Super Admin' };
      }
      if (token === 'valid-fan-token') {
        return { uid: 'fan_test_uid', email: 'fan@ares.ai', role: 'Fan' };
      }
      throw new Error('Invalid Firebase Mock Token');
    }

    async createUser(properties: any) {
      return { uid: Math.random().toString(36).substring(2, 15), ...properties };
    }
  }

  db = new MockFirestore();
  auth = new MockAuth();
}

export { db, auth, isMock };
