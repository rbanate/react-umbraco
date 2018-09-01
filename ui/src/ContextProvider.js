import React, { Component } from 'react';

export const IdentityContext = React.createContext();
/*eslint-disable */
class IdentityProvider extends Component {
  state = {
    number: 100,
    member: undefined,
    showLogin: false,
    inc: () => {
      this.setState({ number: this.state.number + 1 });
    },
    setMemberInfo: member => {
      this.setState({ member });
    },
    showLoginPopup: () => {
      this.setState({showLogin:true});
    }
  };
  render() {
    return (
      <IdentityContext.Provider value={this.state}>{this.props.children}</IdentityContext.Provider>
    );
  }
}
export default IdentityProvider;
