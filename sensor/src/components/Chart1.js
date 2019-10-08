import React, {PureComponent} from 'react';
import moment from 'moment';

import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const chartData = [
    {value: 14, time: 1503617297689},
    {value: 15, time: 1503616962277},
    {value: 15, time: 1503616882654},
    {value: 20, time: 1503613184594},
    {value: 15, time: 1503611308914},
]

export default class Example extends PureComponent {
    static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

    render() {
        return (
            <ResponsiveContainer width = '95%' height = {500} >
                <ScatterChart>
                    <XAxis
                        dataKey = 'time'
                        domain = {['auto', 'auto']}
                        name = 'Time'
                        tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')}
                        type = 'number'
                    />
                    <YAxis dataKey = 'value' name = 'Value' />

                    <Scatter
                        data = {chartData}
                        line = {{ stroke: '#eee' }}
                        lineJointType = 'monotoneX'
                        lineType = 'joint'
                        name = 'Values'
                    />

                </ScatterChart>
            </ResponsiveContainer>
        );
    }
}
