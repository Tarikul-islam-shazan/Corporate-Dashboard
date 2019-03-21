import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import './RadialBar.scss';

class RadialBar extends Component {


    constructor(props) {
        super(props);
        

        this.state = {
            options: {
                plotOptions: {
                    radialBar: {
                        size: 135,
                        startAngle: 0,
                        endAngle: 360,
                        offsetX: 0,
                        offsetY: 0,
                        hollow: {
                            size: '80%',
    

                        },
                        track: {
                            background: '#435CDC',
                        },
                        dataLabels: {
                            name: {
                                show: true,
                                color: '#494949',
                                fontSize: '17px',
                                fontFamily: "Averta W05 Bold",
                                offsetY: 30
                            },
                            value: {
                                offsetY: -45,
                                fontSize: '60px'
                            },

                        },

                    },
                },
                fill: {
                    colors: ['#FF925D']
                },
                stroke: {
                    lineCap: 'round'
                },
                labels:  this.props.name? [this.props.name]:['']
            },
            series: [0],
        }
    }


    render() {
        return (
            <div className="maxed-chart">
                <Chart options={this.state.options} series={this.props.share? [this.props.share]:[0]} type="radialBar" height="250" />
                <p className="chartSubTitle">This {this.props.month_year? this.props.month_year:''}</p>
                <p className="chartTitle">{this.props.title? this.props.title:''}: 2,100</p>
            </div>
        );
    }
}

export default RadialBar;