import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import LoginSwitch from "./components/user/Login";
import ThreadTabs from "./components/tab/ThreadTabs";
import ThreadDisplay from "./components/thread/ThreadDisplay";
import reducer from "./components/reducer/rootReducer";

import "./App.css";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const App = () => (
  <div>
    <LoginSwitch />
    <div className="ui segment">
      <ThreadTabs />
      <ThreadDisplay />
    </div>
  </div>
);

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
