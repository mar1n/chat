import React from "react";
import { v4 as uuid } from "uuid";
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import "./App.css"
const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer
});

function activeThreadIdReducer(state = "1-fca2", action) {
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
      messages: messagesReducer(undefined, {})
    },
    {
      id: "2-be91",
      title: "Michael Collins",
      friend: "1-fca2",
      messages: messagesReducer(undefined, {})
    }
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
        messages: messagesReducer(oldThread.messages, action)
      };
      return [
        ...state.slice(0, threadIndex),
        newThread,
        ...state.slice(threadIndex + 1, state.length)
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
        msg: state.msg
      };
    }
    case "ADD_MESSAGE": {
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid()
      };
      return {
        counter: state.counter + 1,
        msg: state.msg.concat(newMessage)
      };
    }
    case "DELETE_MESSAGE": {
      return {
        counter: state.counter ? state.counter - 1 : state.counter,
        msg: state.msg.filter((m) => m.id !== action.id)
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
    id: id
  };
}

function resetUnreadmsg(id) {
  return {
    type: "RESET_MESSAGE",
    id: id
  };
}

function addMessage(text, threadId) {
  return {
    type: "ADD_MESSAGE",
    text: text,
    threadId: threadId
  };
}

function openThread(id) {
  return {
    type: "OPEN_THREAD",
    id: id
  };
}

const App = () => (
  <div className="ui segment">
    <ThreadTabs />
    <ThreadDisplay />
  </div>
);

const Tabs = (props) => (
  <div className="ui top attached tabular menu">
    {props.tabs.map((tab, index) => (
      <div
        key={index}
        className={tab.active ? "active item" : "item"}
        onClick={() => props.onClick(tab.id)}
      >
        {tab.title}
        <span className={tab.unreadmsg ? "unread" : "read"}>
          {tab.unreadmsg}
        </span>
      </div>
    ))}
  </div>
);

const mapStateToTabsProps = (state) => {
  const tabs = state.threads.map((t) => ({
    title: t.title,
    active: t.id === state.activeThreadId,
    id: t.id,
    unreadmsg: t.messages.counter
  }));

  return {
    tabs
  };
};

const mapDispatchToTabsProps = (dispatch) => ({
  onClick: (id) => dispatch(openThread(id))
});

const ThreadTabs = connect(mapStateToTabsProps, mapDispatchToTabsProps)(Tabs);

class TextFieldSubmit extends React.Component {
  state = {
    value: ""
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
    this.setState({
      value: ""
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
          {m.text}
          <span className="metadata">@{m.timestamp}</span>
        </div>
      </div>
    ))}
    <div
      className={props.messages.counter ? "unread" : "read"}
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
      onClick={props.onMessageClick}
      onRead={() => props.onRead(props.thread.id)}
    />
    <TextFieldSubmit onSubmit={props.onMessageSubmit} />
  </div>
);

const mapStateToThreadProps = (state) => ({
  thread: state.threads.find((t) => t.id === state.activeThreadId)
});

const mapDispatchToThreadProps = (dispatch) => ({
  onMessageClick: (id) => dispatch(deleteMessage(id)),
  onRead: (id) => dispatch(resetUnreadmsg(id)),
  dispatch: dispatch
});

function mergeThreadProps(stateProps, dispatchProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    onMessageSubmit: (text) =>
      dispatchProps.dispatch(addMessage(text, stateProps.thread.friend))
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
