export function deleteMessage(id) {
  return {
    type: "DELETE_MESSAGE",
    id: id,
  };
}

export function resetUnreadmsg(id, name) {
  return {
    type: "RESET_MESSAGE",
    id: id,
    name: name,
  };
}

export function addMessage(text, threadId, userName) {
  return {
    type: "ADD_MESSAGE",
    text: text,
    user: userName,
    threadId: threadId,
  };
}

export function openThread(id) {
  return {
    type: "OPEN_THREAD",
    id: id,
  };
}

export function switchUser(id) {
  return {
    type: "SWITCH_USER",
    id: id,
  };
}
