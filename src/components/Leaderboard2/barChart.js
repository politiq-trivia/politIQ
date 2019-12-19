import React, { PureComponent } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    LabelList
} from 'recharts';



const PolBarChart = (props) => {
    const data = [
        {
            name: 'Rep', politIQ: props.politIQs.repPolitIQ, fill: "lightcoral",
        },
        {
            name: 'Dem', politIQ: props.politIQs.demPolitIQ, fill: "deepskyblue",
        },
        {
            name: 'Ind', politIQ: props.politIQs.indPolitIQ, fill: "springgreen",
        },
    ];
    return (
        <center style={{ marginTop: "60px" }}>
            <h2 style={{
                fontWeight: "normal",
                textTransform: "uppercase",
                letterSpacing: "1px",
                textAlign: "center",
                fontSize: "20px",
                color: "#F4E9FC",
                marginBottom: "10px"
            }}>Party PolitIQs</h2>
            <BarChart
                width={300}
                height={220}
                data={data}
                margin={{
                    top: 30, right: 30, left: 20, bottom: 5,
                }}
            >
                <XAxis dataKey="name" tick={{ fill: 'white' }} />
                <Bar dataKey="politIQ" fill={data.fill} >
                    <LabelList dataKey={data.politIQ} position="top" />
                </Bar>
            </BarChart>
        </center>
    );
}


export default PolBarChart;