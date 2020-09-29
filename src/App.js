import React from "react";
import { v4 as uuid } from "uuid";
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import "./App.css";

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  loginUserId: loginUserIdReducer,
  threads: threadsReducer,
  users: usersReducer,
});

function usersReducer(
  state = [{ name: "Buzz Aldrin" }, { name: "Michael Collins" }],
  action
) {
  return state;
}

function loginUserIdReducer(state = "Buzz Aldrin", action) {
  if (action.type === "SWITCH_USER") {
    return action.id;
  } else {
    return state;
  }
}

function activeThreadIdReducer(state = "3-xz25", action) {
  if (action.type === "OPEN_THREAD") {
    return action.id;
  } else {
    return state;
  }
}

function findThreadIndex(threads, action) {
  switch (action.type) {
    case "RESET_MESSAGE": {
      return threads.findIndex((t) => t.id === action.id);
    }
    case "ADD_MESSAGE": {
      return threads.findIndex((t) => t.id === action.threadId);
    }
    case "DELETE_MESSAGE": {
      return threads.findIndex((t) =>
        t.messages.msg.find((m) => m.id === action.id)
      );
    }
    default: {
      return threads;
    }
  }
}

function threadsReducer(
  state = [
    {
      id: "1-fca2",
      title: "Buzz Aldrin",
      friend: "2-be91",
      users: [
        { id: "1-fca2", title: "Buzz Aldrin" },
        { id: "2-be91", title: "Michael Collins" },
      ],
      messages: messagesReducer(undefined, {}),
    },
    {
      id: "3-xz25",
      title: "All",
      friend: "1-fca2",
      users: [
        { id: "1-fca2", title: "Buzz Aldrin" },
        { id: "2-be91", title: "Michael Collins" },
      ],
      messages: messagesReducer(undefined, {}),
    },
  ],
  action
) {
  switch (action.type) {
    case "ADD_MESSAGE":
    case "RESET_MESSAGE":
    case "DELETE_MESSAGE": {
      const threadIndex = findThreadIndex(state, action);

      const oldThread = state[threadIndex];

      const newThread = {
        ...oldThread,
        messages: messagesReducer(oldThread.messages, action),
      };
      return [
        ...state.slice(0, threadIndex),
        newThread,
        ...state.slice(threadIndex + 1, state.length),
      ];
    }
    default: {
      return state;
    }
  }
}

function messagesReducer(state = { counter: 0, msg: [] }, action) {
  switch (action.type) {
    case "RESET_MESSAGE": {
      return {
        counter: 0,
        msg: state.msg.map((msg) =>
          msg.name !== action.name ? { ...msg, unread: true } : msg
        ),
      };
    }
    case "ADD_MESSAGE": {
      const newMessage = {
        text: action.text,
        name: action.user,
        timestamp: Date.now(),
        id: uuid(),
        unread: false,
      };
      return {
        counter: state.counter + 1,
        msg: state.msg.concat(newMessage),
      };
    }
    case "DELETE_MESSAGE": {
      return {
        counter: state.counter ? state.counter - 1 : state.counter,
        msg: state.msg.filter((m) => m.id !== action.id),
      };
    }
    default: {
      return state;
    }
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function deleteMessage(id) {
  return {
    type: "DELETE_MESSAGE",
    id: id,
  };
}

function resetUnreadmsg(id, name) {
  return {
    type: "RESET_MESSAGE",
    id: id,
    name: name,
  };
}

function addMessage(text, threadId, userName) {
  return {
    type: "ADD_MESSAGE",
    text: text,
    user: userName,
    threadId: threadId,
  };
}

function openThread(id) {
  return {
    type: "OPEN_THREAD",
    id: id,
  };
}

function switchUser(id) {
  return {
    type: "SWITCH_USER",
    id: id,
  };
}

const App = () => (
  <div>
    <LoginSwitch />
    <div className="ui segment">
      <ThreadTabs />
      <ThreadDisplay />
    </div>
  </div>
);

class Login extends React.Component {
  state = {
    user: this.props.loginUsers[0].userName,
  };
  changeUser = (e) => {
    this.props.user(e.target.value);
    this.props.default("3-xz25");
    this.setState({ user: e.target.value });
  };
  render() {
    return (
      <div>
        <p>
          You are currently login: <span>{this.state.user}</span>
        </p>
        <label>
          Change Login User
          <select
            value={this.state.user}
            onChange={this.changeUser}
            name=""
            id=""
          >
            {this.props.loginUsers.map((u) => (
              <option key={u.userName} value={u.userName}>
                {u.userName}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }
}

const mapStateToLoginProps = (state) => {
  const loginUsers = state.users.map((u) => ({
    userName: u.name,
  }));
  return {
    loginUsers,
  };
};

const mapDispatchToLoginProps = (dispatch) => ({
  user: (id) => dispatch(switchUser(id)),
  default: (id) => dispatch(openThread(id)),
});

const LoginSwitch = connect(
  mapStateToLoginProps,
  mapDispatchToLoginProps
)(Login);

const Tabs = (props) => (
  <div className="ui top attached tabular menu">
    {props.tabs.map((tab, index) => {
      return (
        <div
          key={index}
          className={tab.active ? "active item" : "item"}
          onClick={() => props.onClick(tab.id)}
        >
          {tab.id === "3-xz25"
            ? "All"
            : tab.title.find((t) => {
                if (t.title !== props.login) {
                  return t.title;
                }
                return null;
              }).title}
          <span>{tab.unreadmsg}</span>
        </div>
      );
    })}
  </div>
);

const mapStateToTabsProps = (state) => {
  const login = state.loginUserId;
  const tabId = state.activeThreadId;
  const tabs = state.threads
    .filter((t) => t.users.find((t) => t.title === login))
    .map((t) => ({
      title: t.users,
      active: t.id === state.activeThreadId,
      id: t.id,
      unreadmsg: t.messages.msg.reduce(
        (accu, current) =>
          current.unread === false && current.name !== login ? accu + 1 : accu,
        0
      ),
    }));
  return {
    login,
    tabs,
    tabId,
  };
};

const mapDispatchToTabsProps = (dispatch) => ({
  onClick: (id) => dispatch(openThread(id)),
});

const ThreadTabs = connect(mapStateToTabsProps, mapDispatchToTabsProps)(Tabs);

class TextFieldSubmit extends React.Component {
  state = {
    value: "",
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
    this.setState({
      value: "",
    });
  };

  render() {
    return (
      <div className="ui input">
        <input onChange={this.onChange} value={this.state.value} type="text" />
        <button
          onClick={this.handleSubmit}
          className="ui primary button"
          type="submit"
        >
          Submit
        </button>
      </div>
    );
  }
}

const MessageList = (props) => (
  <div className="ui comments">
    {props.messages.msg.map((m, index) => (
      <div className="comment" key={index} onClick={() => props.onClick(m.id)}>
        <div className="text">
          {m.name}:{m.text}
          <span className="metadata">@{m.timestamp}</span>
        </div>
      </div>
    ))}
    <div
      className={
        props.messages.msg.reduce(
          (accu, current) =>
            current.unread === false && current.name !== props.user
              ? accu + 1
              : accu,
          0
        )
          ? "unread"
          : "read"
      }
      onClick={() => props.onRead()}
    >
      I READ ALL MSG
    </div>
  </div>
);

const Thread = (props) => (
  <div className="ui center aligned basic segment">
    <MessageList
      messages={props.thread.messages}
      user={props.userId}
      onClick={props.onMessageClick}
      onRead={() => props.onRead(props.thread.id, props.userId)}
    />
    <TextFieldSubmit onSubmit={props.onMessageSubmit} />
  </div>
);

const mapStateToThreadProps = (state) => ({
  thread: state.threads.find((t) => {
    if (
      t.id === state.activeThreadId &&
      t.users.find((u) => u.title === state.loginUserId)
    ) {
      return t;
    }
  }),
  userId: state.loginUserId,
});

const mapDispatchToThreadProps = (dispatch) => ({
  onMessageClick: (id) => dispatch(deleteMessage(id)),
  onRead: (id, name) => dispatch(resetUnreadmsg(id, name)),
  dispatch: dispatch,
});

function mergeThreadProps(stateProps, dispatchProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    onMessageSubmit: (text) =>
      dispatchProps.dispatch(
        addMessage(text, stateProps.thread.id, stateProps.userId)
      ),
  };
}

const ThreadDisplay = connect(
  mapStateToThreadProps,
  mapDispatchToThreadProps,
  mergeThreadProps
)(Thread);

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
