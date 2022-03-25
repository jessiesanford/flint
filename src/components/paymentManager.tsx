import * as _ from "lodash";
import React, {useState, useEffect, useRef} from "react";
import {useAppContext} from "./provider";
import {useForm} from "./useForm";
import {Table} from "./tableComp";
import formatCurrencyInput from "format-currency-input";
import LineIcon from "react-lineicons";

import {
  currentDateYYYYMMDD,
  makeDateNowReadable,
  parseCurrencyAsFloat,
  convertNumberToCurrency, truncateString,
} from "../utils/globalUtils";

interface Payment {
  senderName: string,
  amount: string,
  date: string,
  note: string
}

export const PaymentManager = () => {
  const {
    delegate,
  } = useAppContext();

  const [loading, setLoading] = useState(false);

  const {handleSubmit, handleChange, data: payment, errors} = useForm<Payment>({
    validations: {
      senderName: {
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
    onSubmit: () => submitPaymentForm(),
  });

  const submitPaymentForm = () => {
    setLoading(true);
    let parsedAmount = parseCurrencyAsFloat(payment.amount);
    let parsedDate = Date.parse(payment.date) || Date.now();
    delegate.dbc.paymentCollection.add([
      {senderName: payment.senderName, amount: parsedAmount, date: parsedDate, note: payment.note}
    ]).then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
    payment.senderName = "";
    payment.amount = "";
    payment.date = currentDateYYYYMMDD();
    payment.note = "";
  }

  return (
    <div className={"tool__container"}>
      <h1 className={"tool__heading"}>
        Manage Payments
      </h1>

      <form className="tool__form" onSubmit={handleSubmit}>
        <div className={"form__row"}>
          <div className={"form__inline-block"}>
            <label htmlFor={"sender-name"}>Sender Name</label>
            <input id={"sender-name"}
                   placeholder={"company or person..."}
                   name={"senderName"}
                   type={"text"}
                   value={payment.senderName || ''}
                   onChange={handleChange('senderName')}
            />
            {errors.senderName && <div className="form__error" data-error-id={"senderName"}>{errors.senderName}</div>}
          </div>
          <div className={"form__inline-block"}>
            <label htmlFor={"amount"}>Amount</label>
            <input id={"amount"}
                   name={"amount"}
                   type={"text"}
                   value={payment.amount || ''}
                   onChange={handleChange('amount')}
                   onBlur={() => handleChange('amount', formatCurrencyInput.format)}
            />
            {errors.amount && <div className="form__error" data-error-id={"amount"}>{errors.amount}</div>}
          </div>
          <div className={"form__inline-block"}>
            <label htmlFor={"date"}>Date</label>
            <input id={"date"}
                   name={"date"}
                   type={"date"}
                   value={payment.date || ''}
                   onChange={handleChange('date')}
            />
            {errors.date && <div className="form__error" data-error-id={"date"}>{errors.date}</div>}
          </div>
        </div>
        <div className={"form__block"} style={{marginTop: "20px"}}>
          <label htmlFor={"note"}>Payment Notes</label>
          <textarea id={"note"}
                    name={"note"}
                    placeholder={"Enter payment notes here..."}
                    value={payment.note || ''}
                    // @ts-ignore
                    onChange={handleChange('note')}
                    style={{width: "100%", resize: "none"}}
          />
        </div>
        <div style={{display: "flex", alignItems: "center"}}>
          <button type={"submit"} className={"btn-action"}>Record Payment</button>
          <div className="lds-ellipsis" style={{opacity: loading ? 1 : 0, marginLeft: "20px"}}>
            <div/>
            <div/>
            <div/>
            <div/>
          </div>
        </div>
      </form>

      <PaymentLedger/>
    </div>
  )
}


export function PaymentLedger() {
  const {
    delegate,
  } = useAppContext();

  let [payments, setPayments] = useState([]);

  // update table rows when data is initially retrieved
  useEffect(() => {
    delegate.dbc.paymentCollection.get().then((payments) => {
      setPayments(payments);
    });

    // update table rows when collection is updated
    delegate.dbc.paymentCollection.subscribe(changeEvent => {
      delegate.dbc.paymentCollection.get().then((payments) => {
        setPayments(payments);
      });
    });
  }, []);

  let deleteBtn = (payment) => {
    return (
      <div className={"btn-delete--small"}
           onClick={() => {
             delegate.dbc.paymentCollection.delete([payment.id]).then(() => {
               // show processing in future
             })
           }}>
        <LineIcon name={"cross-circle"}/>
      </div>
    );
  }

  let paymentRows = _.map(payments, (payment) => {
    return {
      cells: [
        {content: payment.senderName, width: "20%"},
        {content: convertNumberToCurrency(payment.amount), width: "20%"},
        {content: makeDateNowReadable(payment.timestamp), width: "20%"},
        {content: truncateString(payment.note || "", 100), width: "20%"},
        {content: deleteBtn(payment), width: "2%", pushRight: true},
      ],
    };
  });

  return (
    <div className={"payments-ledger"}>
      <Table headers={
        [
          {content: "Sender Name", width: "20%"},
          {content: "Amount", width: "20%"},
          {content: "Date", width: "20%"},
          {content: "Note", grow: true},
          {content: "", width: "2%"}
        ]}
             rows={paymentRows}
      />
    </div>
  )
}