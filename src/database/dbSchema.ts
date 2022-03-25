export const paymentSchema = {
  title: "Payment Schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {type: 'string', primary: true},
    senderName: {type: 'string'},
    amount: {type: 'number'},
    timestamp: {type: 'number'},
    note: {type: 'string'},
  },
  required: ['id', 'senderName', 'amount', 'timestamp'],
  indexes: ['timestamp'],
} as const;

export const expenseSchema = {
  title: "Expense Schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {type: 'string', primary: true},
    clientName: {type: 'string'},
    payeeName: {type: 'string'},
    amount: {type: 'number'},
    timestamp: {type: 'number'},
    note: {type: 'string'},
  },
  required: ['id', 'clientName', 'payeeName', 'amount', 'timestamp'],
  indexes: ['timestamp'],
} as const;

export const invoiceSchema = {
  version: 0,
  properties: {
    id: {type: 'string', primary: true},
  },
  required: ['id']
} as const;