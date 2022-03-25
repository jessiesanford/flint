import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "./provider";
import {DBController} from "../database/dbController";
import {PaymentManager} from "./paymentManager";
import {ExpenseTracker} from "./expenseTracker";

export enum AppToolType {
  PaymentManager = 'paymentManager',
  ExpenseTracker = 'expenseTracker',
}

export class AppContainer {
  mount: HTMLElement;
  toolType: string;
  provider: typeof Provider;
  dbc: DBController;

  constructor(mount, toolType) {
    this.mount = mount;
    this.toolType = toolType;
    this.dbc = new DBController();
  }

  init() {
    this.renderProvider(true);
    this.dbc.init().then(() => {
      // fake timeout to demonstrate splash screen - used while loading dependencies and assets
      setTimeout(() => {
        this.renderProvider(false);
      }, 3000)
    });
  }

  setToolType(toolType: AppToolType) {
    this.toolType = toolType;
    this.renderProvider();
  }

  /**
   * The provider is a container for this react-based application, all "view" logic is contained within
   * itself and it's child components
   * @param loading
   */
  renderProvider(loading = false) {
    ReactDOM.render(
      <Provider loading={loading} delegate={this} render={AppToolRenders[this.toolType]}/>,
      this.mount
    );
  }
}

export function renderPaymentManager() {
  return <PaymentManager />;
}

export function renderExpenseTracker() {
  return <ExpenseTracker />;
}

export const AppToolRenders = {
  [AppToolType.PaymentManager]: renderPaymentManager,
  [AppToolType.ExpenseTracker]: renderExpenseTracker
}