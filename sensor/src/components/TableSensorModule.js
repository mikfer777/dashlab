import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import MaterialTable from "material-table";
import MyButton1Form from "./MyButton1";
import Paper from "./Foo";

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth : '100%'
    },
    button: {
        margin: theme.spacing.unit * 2,
    },
    placeholder: {
        height: 40,
    },
    paper: {
        height: 240,
        width: 400,
        backgroundColor: 'transparent',
        boxShadow: 'none',


    },
    rootgrid: {
        flexGrow: 1,
    },
});

class SensorModuleTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'sensor_uuid',
        selected: [],
        data: [],
        page: 0,
        rowsPerPage: 5,
    };


    render() {
        const {classes} = this.props;
        this.state.data = this.props.data;
        return (
            <div className={classes.root}>
                <MaterialTable
                    title="Sensor Module"
                    columns={[
                        {field: 'sensor_uuid', title: 'uuid'},
                        {field: 'name', title: 'name'},
                        {field: 'type', title: 'type'},
                        {field: 'description', title: 'description'},
                        {field: 'created_at', title: 'created_at'},
                        {field: 'updated_at', title: 'updated_at'},
                        {field: 'techdata', title: 'technical data'},
                    ]}
                    data={this.state.data}
                    options={{
                        padding: 'dense',
                    }}
                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    {
                                        const data = this.state.data;
                                        console.log(newData)
                                        /*                                    const my_session_id = 'mph3eugf0gh5hyzc8glvrt79r2sd6xu6'
                                                                            const cookies = {}
                                                                            cookies['sessionid'] = my_session_id*/
                                        const conf = {
                                            method: "post",
                                            body: JSON.stringify(newData),
                                            // cookies: cookies,
                                            headers: new Headers({"Content-Type": "application/json"}),

                                        };
                                        fetch("/api/sensormodules/", conf).then(response => console.log(response));
                                        data.push(newData);
                                        this.setState({data}, () => resolve());
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
                                        var url = '/api/sensormodules/'
                                        url += oldData.id + '/'
                                        const conf = {
                                            method: "put",
                                            body: JSON.stringify(newData),
                                            headers: new Headers({"Content-Type": "application/json"})
                                        };
                                        fetch(url, conf).then(response => console.log(response));
                                        this.setState({data}, () => resolve());
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
                                        console.log(oldData)
                                        var url = '/api/sensormodules/'
                                        url += oldData.id + '/'
                                        const conf = {
                                            method: "delete",
                                            // body: JSON.stringify(oldData),
                                            headers: new Headers({"Content-Type": "application/json"})
                                        };
                                        fetch(url, conf).then(response => console.log(response));
                                        data.splice(index, 1);
                                        this.setState({data}, () => resolve());
                                    }
                                    resolve()
                                }, 100)
                            }),
                    }}
                />
            </div>
        )
    }
}

SensorModuleTable.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};

export default withStyles(styles)(SensorModuleTable);