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

    // "xbeeid": 1,
    // "vbatt": "4.89199",
    // "ptrans": 10,
    // "pcheck": 60,
    // "created_at": "2019-06-30T17:13:49.732417Z"

    render() {
        this.state.data = this.props.data;
        return (
            <MaterialTable
                title="Simple Action Preview"
                columns={[
                    {field: 'xbeeid', title: 'Xbee Id'},
                    {field: 'vbatt', title: 'Tension Batt'},
                    {field: 'ptrans', title: 'periode Trans'},
                    {field: 'pcheck', title: 'periode Check'},
                    {field: 'pcheck', title: 'periode Check'},
                ]}
                data={this.state.data}
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
                                    fetch("/api/sensors/", conf).then(response => console.log(response));
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
                                    var url = '/api/sensors/'
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
                                    var url = '/api/sensors/'
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
        )
    }
}

Editable.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};
export default Editable;