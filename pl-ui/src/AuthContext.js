import React from 'react';


const AuthenticationContext = React.createContext({});
const stringified = localStorage.getItem('userInfo');
const userInfo = stringified && JSON.parse(stringified);

export default class Authentication extends React.Component {
  state = { userInfo };

  login = userInfo => {
    this.setState({ userInfo });
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  logout = () => {
    this.setState({ userInfo: null });
    localStorage.removeItem('userInfo');
  }

  render() {
    return (
      <AuthenticationContext.Provider value={{ 
        login: this.login, 
        logout: this.logout, 
        userInfo: this.state.userInfo }}>
        {this.props.children}
      </AuthenticationContext.Provider>
    )
  }
}
export const withAuthentication = Component => {
  return props => (
    <AuthenticationContext.Consumer>
      {
        context => <Component authentication={context} {...props} />
      }
    </AuthenticationContext.Consumer>
  )
}