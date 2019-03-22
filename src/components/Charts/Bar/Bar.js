import React, { Component } from "react";
import Chart from "react-apexcharts";

class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar",
                    stacked: true,
                    toolbar: {
                        show: false
                    }

                },
                xaxis: {
                    categories: ["January " + new Date().getFullYear().toString().substr(-2),
                    "February " + new Date().getFullYear().toString().substr(-2),
                    "March " + new Date().getFullYear().toString().substr(-2),
                    "April " + new Date().getFullYear().toString().substr(-2),
                    "May " + new Date().getFullYear().toString().substr(-2),
                    "June " + new Date().getFullYear().toString().substr(-2),
                    "July " + new Date().getFullYear().toString().substr(-2),
                    "August " + new Date().getFullYear().toString().substr(-2),
                    "September " + new Date().getFullYear().toString().substr(-2),
                    "October " + new Date().getFullYear().toString().substr(-2),
                    "November " + new Date().getFullYear().toString().substr(-2),
                    "December " + new Date().getFullYear().toString().substr(-2)]
                },
                colors: ['#1DD090'],
                plotOptions: {
                    bar: {
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                markers: {

                    size: 12
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val;
                    },
                    offsetY: -30,
                    textAnchor: 'middle',
                    height: "10px",
                    width: "20px",
                    style: {
                        fontSize: '14px',
                        colors: ["#304758"],
                        background: '#304758',
                    },

                    dropShadow: {
                        enabled: true,
                        top: 1,
                        left: 1,
                        blur: 1,
                        opacity: 0.2
                    }
                },
                legend: {
                    position: 'right',
                    offsetY: 40,
                    showForSingleSeries: true,
                    floating: false,
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial',
                },


            },
            series: [
                {
                    name: "series-1",
                    data: [120, null, null, null, null, null, null, null, null, null, null, null]
                }
            ],
            type:'line'
        };
    }

    componentWillReceiveProps= (nextProps)=>{
        this.setState({type:nextProps.graphType});
    }

    render() {
        console.log(this.props.graphType);
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                //width="900"
                height="500"
            />
        );
    }
}

export default Bar;