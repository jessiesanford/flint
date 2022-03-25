import React, {useState, useEffect} from "react";
import {useAppContext} from "./provider";
import {
  convertNumberToCurrency,
  currentDateYYYYMMDD,
  makeDateNowReadable,
  parseCurrencyAsFloat
} from "../utils/globalUtils";
import {Table} from "./tableComp";
import {useForm} from "./useForm";
import formatCurrencyInput from "format-currency-input";
import {map} from "lodash";
import LineIcon from "react-lineicons";

interface Expense {
  clientName: string,
  payeeName: string,
  amount: string,
  date: string,
  note: string,
}

export function ExpenseTracker() {
  const {
    delegate,
  } = useAppContext();

  const {handleSubmit, handleChange, data: expense, errors} = useForm<Expense>({
    validations: {
      clientName: {
        required: {
          value: true,
          message: "This field is required."
        },
      },
      payeeName: {
        required: {
          value: true,
          message: "This field is required."
        },
      },
      amount: {
        required: {
          value: true,
          message: "This field is required."
        },
        custom: {
          isValid: (value) => value !== "$0.00",
          message: "Must be greater than $0.00",
        }
      },
      date: {
        required: {
          value: true,
          message: "This field is required."
        },
      },
    },
    initialValues: {
      amount: formatCurrencyInput.format(0),
      date: currentDateYYYYMMDD(),
    },
    onSubmit: () => submitExpenseForm(),
  });

  const submitExpenseForm = () => {
    let parsedAmount = parseCurrencyAsFloat(expense.amount);
    let parsedDate = Date.parse(expense.date) || Date.now();

    delegate.dbc.expenseCollection.add([
      {
        clientName: expense.clientName,
        payeeName: expense.payeeName,
        amount: parsedAmount,
        date: parsedDate,
        note: expense.note
      }
    ]);

    // reset input values when form is submitted
    expense.clientName = "";
    expense.payeeName = "";
    expense.amount = formatCurrencyInput.format(0);
    expense.date = currentDateYYYYMMDD();
    expense.note = "";
  }

  return (
    <div className={"tool__container"}>
      <h1 className={"tool__heading"}>
        Track Expenses
      </h1>

      <form className="tool__form" onSubmit={handleSubmit}>
        <div className={"form__row"}>
          <div className={"form__inline-block"}>
            <label htmlFor={"client-name"}>Client Name</label>
            <input id={"client-name"}
                   name={"clientName"}
                   type={"text"}
                   value={expense.clientName || ''}
                   onChange={handleChange('clientName')}
            />
            {errors.clientName && <div className="form__error" data-error-id={"clientName"}>{errors.clientName}</div>}
          </div>
          <div className={"form__inline-block"}>
            <label htmlFor={"payee-name"}>Payee Name</label>
            <input id={"payee-name"}
                   name={"payeeName"}
                   type={"text"}
                   value={expense.payeeName || ''}
                   onChange={handleChange('payeeName')}
            />
            {errors.payeeName && <div className="form__error" data-error-id={"payeeName"}>{errors.payeeName}</div>}
          </div>
          <div className={"form__inline-block"}>
            <label htmlFor={"amount"}>Amount</label>
            <input id={"amount"}
                   name={"amount"}
                   type={"text"}
                   value={expense.amount || ''}
                   onChange={handleChange('amount')}
                   onBlur={handleChange('amount', formatCurrencyInput.format)}
            />
            {errors.amount && <div className="form__error" data-error-id={"amount"}>{errors.amount}</div>}
          </div>
          <div className={"form__inline-block"}>
            <label htmlFor={"date"}>Date</label>
            <input id={"date"}
                   name={"date"}
                   type={"date"}
                   value={expense.date || ''}
                   onChange={handleChange('date')}
            />
            {errors.date && <div className="form__error" data-error-id={"date"}>{errors.date}</div>}
          </div>
        </div>
        <div className={"form__block"} style={{marginTop: "20px"}}>
          <label htmlFor={"note"}>Expense Notes</label>
          <textarea id={"note"}
                    name={"note"}
                    placeholder={"Enter payment notes here..."}
                    value={expense.note || ''}
                    onChange={handleChange('note')}
                    style={{width: "100%", resize: "none"}}
          />
        </div>
        <div>
          <button type={"submit"} className={"btn-action"}>Record Expense</button>
        </div>
      </form>

      <ExpensesLedger/>
    </div>
  )
}

export function ExpensesLedger(props: any) {
  const {
    delegate
  } = useAppContext();

  const [expenses, setExpenses] = useState([]);

  // update table rows when the collection is updated
  delegate.dbc.expenseCollection.subscribe(changeEvent => {
    delegate.dbc.expenseCollection.get().then((expenses) => {
      setExpenses(expenses);
    })
  });

  // update table rows when the data is initially retrieved
  useEffect(() => {
    delegate.dbc.expenseCollection.get().then((expenses) => {
      setExpenses(expenses);
    });
  }, []);

  let deleteBtn = (expense) => {
    return (
      <div className={"btn-delete--small"}
           onClick={() => delegate.dbc.expenseCollection.delete([expense.id])}>
        <LineIcon name={"cross-circle"}/>
      </div>
    );
  }

  let expenseRows = map(expenses, (expense) => {
    return {
      cells: [
        {content: expense.clientName, width: "20%"},
        {content: expense.payeeName, width: "20%"},
        {content: convertNumberToCurrency(expense.amount), width: "20%"},
        {content: makeDateNowReadable(expense.timestamp), width: "20%"},
        {content: expense.note, width: "20%", grow: true},
        {content: deleteBtn(expense), pushRight: true},
      ],
    };
  });

  return (
    <div className={"expenses-ledger"}>
      <Table headers={[
        {content: "Client Name", width: "20%"},
        {content: "Payee Name", width: "20%"},
        {content: "Amount", width: "20%"},
        {content: "Date", width: "20%"},
        {content: "Note", width: "20%", grow: true}
      ]}
             rows={expenseRows}/>
    </div>
  )
}