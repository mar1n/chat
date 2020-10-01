import React from "react";
import { connect } from "react-redux";
import { openThread } from "../reducer/actions";

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

export default ThreadTabs;