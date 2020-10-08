import React from "react";
import { connect } from "react-redux";
import { addThread } from "../reducer/actions";

class Users extends React.Component {
  state = {
    user: "Max",
  };
  changeUser = (e) => {
    this.setState({ user: e.target.value });
  };
  render() {
    return (
      <>
        <select
          onChange={this.changeUser}
          value={this.state.user}
          name=""
          id=""
        >
          <option value="Max">Max</option>
          <option value="Simon">Simon</option>
          <option value="Ronaldo">Ronaldo</option>
        </select>
        <button onClick={() => this.props.newThread(this.state.user)}>
          Add User{" "}
        </button>
      </>
    );
  }
}

const mapDispatchToUserProps = (dispatch) => ({
  newThread: (name1) => dispatch(addThread("Buzz Aldrin", name1)),
});

const UserList = connect(null, mapDispatchToUserProps)(Users);

export default UserList;
