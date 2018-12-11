import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import uuidv1 from "uuid";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {addNotifcounter} from "../actions/index";

const mapDispatchToProps = dispatch => {
  return {
    addNotifcounter: value => dispatch(addNotifcounter(value))
  };
};

class MyButton1 extends Component {
  constructor() {
    super();

    this.state = {
      counterNotif: 0,
      type : 'notif'

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
  console.log("handleChange event=" + event);
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    console.log("handleSubmit hot-reloaded event =" + event);
    event.preventDefault();
    var { counterNotif, type } = this.state;
    console.log("handleSubmit hot-reloaded counterNotif =" + counterNotif);
    console.log("handleSubmit hot-reloaded type =" + type);
    counterNotif =  counterNotif + 1;
    const id = uuidv1();
    this.props.addNotifcounter({ counterNotif, type, id });
    this.setState({ counterNotif: counterNotif , type : 'notif'});

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <Button type="submit" variant="fab" color="primary" aria-label="Add">
        <AddIcon />
      </Button>

      </form>
    );
  }
}

const MyButton1Form = connect(null, mapDispatchToProps)(MyButton1);

MyButton1.propTypes = {
  addNotifcounter: PropTypes.func.isRequired
};

export default MyButton1Form;
