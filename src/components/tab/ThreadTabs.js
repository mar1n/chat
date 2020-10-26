import React from "react";
import { connect } from "react-redux";
import { openThread, openNewUserThread, closeThread } from "../reducer/actions";

const Tabs = (props) => {
  return (
    <div className="ui top attached tabular menu">
      {props.tabs.map((tab, index) => {
        return (
          <div
            key={index}
            className={tab.active ? "active item" : "item"}
            onClick={() => props.onClick(tab.id)}
          >
            {props.closeThread && tab.active && (
              <div
                className="close"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onClickCloseThread();
                }}
              ></div>
            )}
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
      <div
        onClick={() => props.onClickAddUser()}
        className={!props.newUser ? "active item" : "item"}
      >
        Add
      </div>
    </div>
  );
};

const mapStateToTabsProps = (state) => {
  const login = state.loginUserId;
  const tabId = state.activeThreadId;
  const newUser = state.newThread;
  const closeThread = state.closeThread;
  const tabs = state.threads
    .filter((t) => t.users.find((t) => t.title === login))
    .map((t) => ({
      title: t.users,
      active: t.id === state.activeThreadId && newUser,
      id: t.id,
      unreadmsg: t.messages.reduce(
        (accu, current) =>
          current.unread === false && current.name !== login ? accu + 1 : accu,
        0
      ),
    }));
  return {
    login,
    tabs,
    tabId,
    newUser,
    closeThread,
  };
};

const mapDispatchToTabsProps = (dispatch) => ({
  onClick: (id) => dispatch(openThread(id)),
  onClickAddUser: () => dispatch(openNewUserThread()),
  onClickCloseThread: () => dispatch(closeThread()),
});

const ThreadTabs = connect(mapStateToTabsProps, mapDispatchToTabsProps)(Tabs);

export default ThreadTabs;
