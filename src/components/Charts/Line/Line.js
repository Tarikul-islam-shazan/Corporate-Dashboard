import React, { Component } from "react";
import Chart from "react-apexcharts";

class Line extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar",
                    stacked: false,

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
                grid: {

                    padding: {
                        top: 0,
                        right: 30,
                        bottom: 0,
                        left: 30
                    },
                },
                yaxis: {
                    show: true,
                    showAlways: true,
                    tickAmount: 6,
                    forceNiceScale: false,
                    floating: false,
                    decimalsInFloat: 2,
                    axisBorder: {
                        show: true,
                        color: '#78909C',
                        offsetX: 0,
                        offsetY: 0
                    },
                    axisTicks: {
                        show: true,
                        borderType: 'solid',
                        color: '#78909C',
                        width: 4,
                        offsetX: 0,
                        offsetY: 0
                    },

                },
                colors: ["#FF925D", "#53C9FF"],
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

                stroke: {
                    curve: 'smooth',
                    width: [1.5, 1.5]
                },
                markers: {
                    size: 16,

                },
                dataLabels: {

                    enabled: true,
                    formatter: function (val) {
                        if (val !== null)
                            return val;
                        return "";
                    },
                    offsetY: 22,
                    textAnchor: 'middle',
                    height: "10px",
                    width: "20px",
                    style: {
                        fontSize: '14px',
                        colors: ["#FFFFFF"],


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
                    show: true,
                    position: 'right',
                    offsetY: 40,
                    showForSingleSeries: true,
                    showForNullSeries: false,
                    showForZeroSeries: true,
                    floating: false,
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial',
                },


            },
            series: [

            ],

        };
    }

    componentWillReceiveProps = async (nextProps) => {
        let newOpt = { ...this.state.options };
        newOpt.colors = nextProps.graphColor;
        newOpt.legend.show = nextProps.legend;
        await this.setState({ options: newOpt });

    }

    render() {

        return (
            <Chart
                options={this.state.options}
                series={this.props.series}
                type="line"
                //width="900"
                height="500"
            />
        );
    }
}

export default Line;