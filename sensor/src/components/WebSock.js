import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { initializeSocket } from '../reducers/socket.js';

class WebSock extends React.Component {


  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(initializeSocket());
  }

  render() {
    const { socket } = this.props;
    return <span />;
  }
}

function mapStateToProps(state) {
  return {
    socket: state.socket,
  };
}




export default connect(mapStateToProps)(WebSock);