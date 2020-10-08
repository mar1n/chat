import React from "react";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import LoginSwitch from "./components/user/Login";
import ThreadTabs from "./components/tab/ThreadTabs";
import ThreadDisplay from "./components/thread/ThreadDisplay";
import reducer from "./components/reducer/rootReducer";
import UserList from "./components/user/UsersList";

import "./App.css";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const App = (props) => (
  <div>
    <LoginSwitch />
    <div className="ui segment">
      <ThreadTabs />
      {props.addThread ? <ThreadDisplay /> : <UserList />}
    </div>
  </div>
);

const mapStateToAppProps = (state) => ({
  addThread: state.newThread,
});

const Appes = connect(mapStateToAppProps)(App);

const WrappedApp = () => (
  <Provider store={store}>
    <Appes />
  </Provider>
);

export default WrappedApp;
