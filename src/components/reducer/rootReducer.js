import { combineReducers } from "redux";
import { v4 as uuid } from "uuid";

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


export default reducer;