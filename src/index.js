import {AppContainer} from "./components/appContainer";
import {AppToolType} from "./components/appContainer";

function init() {
  const mount = document.querySelector('.conduit-mount');
  if (mount) {
    let financeTracker = new AppContainer(mount, AppToolType.PaymentManager);
    financeTracker.init();
  }
}

init();