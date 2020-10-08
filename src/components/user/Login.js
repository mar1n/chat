import React from "react";
import { connect } from "react-redux";
import { switchUser, openThread } from "../reducer/actions";

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
export default LoginSwitch;
