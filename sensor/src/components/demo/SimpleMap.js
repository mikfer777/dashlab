import React, {Component} from 'react'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import {withStyles} from "@material-ui/core";


const styles = theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    paper: {
        background: 'transparent',

        borderRadius: 3,
        height: 200,
        width: 1000

    },
    paper2: {

        background: 'transparent',
        border: '2px solid #e2e2e2',
        borderRadius: 3,
        height: 420,
        width: 1500


    },
    rootgrid: {
        flexGrow: 1,
    },


});

class SimpleMap extends Component {
    constructor() {
        super()
        this.state = {
            lat: 58.505,
            lng: -0.09,
            zoom: 4,
        }
    }


    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <Map center={position} zoom={this.state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </Popup>
                </Marker>
            </Map>
        )
    }
}

SimpleMap.defaultProps = {
    name: 'toto',
    uuid: 'XXXX'
};

export default withStyles(styles)(SimpleMap);