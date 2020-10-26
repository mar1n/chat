import { combineReducers } from "redux";
import { v4 as uuid } from "uuid";

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  loginUserId: loginUserIdReducer,
  newThread: newThreadReducer,
  closeThread: closeThreadReducer,
  threads: threadsReducer,
  users: usersReducer,
});

function closeThreadReducer(state = true, action) {
  if (action.type === "CLOSE_THREAD") {
    console.log("close Thread");
    return false;
  } else if (action.type === "OPEN_THREAD") {
    return true;
  } else {
    return state;
  }
}

function newThreadReducer(state = true, action) {
  if (action.type === "ADD_NEWUSER") {
    return false;
  } else if (action.type === "OPEN_THREAD") {
    return true;
  } else if (action.type === "ADD_NEWTHREAD") {
    return false;
  } else {
    return state;
  }
}

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
        t.messages.find((m) => m.id === action.id)
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
      id: "3-xz25",
      title: "All",
      friend: "1-fca2",
      users: [
        { id: "1-fca2", title: "Buzz Aldrin" },
        { id: "2-be91", title: "Michael Collins" },
      ],
      messages: messagesReducer(undefined, {}),
    },
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
  ],
  action
) {
  switch (action.type) {
    case "ADD_NEWTHREAD": {
      return [
        {
          id: uuid(),
          title: action.user1,
          friend: "2-qweassd",
          users: [
            { id: "1-fca2", title: action.user1 },
            { id: "2-be91", title: action.user2 },
          ],
          messages: messagesReducer(undefined, {}),
        },
        ...state,
      ];
    }
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

function messagesReducer(state = [], action) {
  switch (action.type) {
    case "RESET_MESSAGE": {
      return state.map((msg) =>
        msg.name !== action.name ? { ...msg, unread: true } : msg
      );
    }
    case "ADD_MESSAGE": {
      const newMessage = {
        text: action.text,
        name: action.user,
        timestamp: Date.now(),
        id: uuid(),
        unread: false,
      };
      return state.concat(newMessage);
    }
    case "DELETE_MESSAGE": {
      return state.filter((m) => m.id !== action.id);
    }
    default: {
      return state;
    }
  }
}

export default reducer;
