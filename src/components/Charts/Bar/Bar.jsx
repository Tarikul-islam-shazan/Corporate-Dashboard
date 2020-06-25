import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'basic-bar',
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: props.xaxis,
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
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
        },

        colors: ['#1DD090'],
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        markers: {
          size: 12,
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return '$' + val;
          },
          offsetY: -25,
          textAnchor: 'middle',
          height: '10px',
          width: '20px',
          style: {
            fontSize: '14px',
            colors: ['#304758'],
            background: '#304758',
          },

          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            opacity: 0.2,
          },
        },
        legend: {
          show: false,
          position: 'right',
          offsetY: 40,
          showForSingleSeries: false,
          floating: false,
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial',
        },
      },
      series: [],
    };
  }

  componentWillReceiveProps = async (nextProps) => {
    let newOpt = { ...this.state.options };
    newOpt.colors = nextProps.graphColor;
    newOpt.legend.show = nextProps.legend;
    await this.setState({ options: newOpt });
  };

  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.props.series}
        type='bar'
        //width="900"
        height='500'
      />
    );
  }
}

export default Bar;
