import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Home extends React.Component {
  render() {
    // if (!this.props.configured) return <Redirect to="/setup/welcome" />;
    return <div>Document Upload</div>;
  }
}

// Home.propTypes = {
//   configured: PropTypes.bool.isRequired,
// };

export default Home;
