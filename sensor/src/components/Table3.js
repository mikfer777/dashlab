import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import MaterialTable from "material-table";
import MyButton1Form from "./MyButton1";

class Editable extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'calories',
        selected: [],
        data: [],
        page: 0,
        rowsPerPage: 5,
    };



    render() {
        this.state.data = this.props.data;
        return (
            <MaterialTable
                title="Simple Action Preview"
                columns={[
                    {field: 'name', title: 'Name of'},
                    {field: 'email', title: 'Email'},
                    {field: 'message', title: 'Message delivered'},
                ]}
                data={this.state.data}
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    const data = this.state.data;
                                    data.push(newData);
                                    this.setState({ data }, () => resolve());
                                }
                                resolve()
                            }, 100)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    const data = this.state.data;
                                    const index = data.indexOf(oldData);
                                    data[index] = newData;
                                    this.setState({ data }, () => resolve());
                                }
                                resolve()
                            }, 100)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    let data = this.state.data;
                                    const index = data.indexOf(oldData);
                                    data.splice(index, 1);
                                    this.setState({ data }, () => resolve());
                                }
                                resolve()
                            }, 100)
                        }),
                }}
            />
        )
    }
}

Editable.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};
export default Editable;