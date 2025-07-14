"use client";

import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface RewardsAreaChartProps {
  data: Array<{
    date: string;
    dailyRewards: number;
    cumulativeRewards: number;
  }>;
  title?: string;
  height?: number;
}

const RewardsAreaChart: React.FC<RewardsAreaChartProps> = ({
  data,
  title = "Rewards Accumulation",
  height = 350
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Convert data for Highcharts
  const dailyRewardsData = data.map(item => [
    new Date(item.date).getTime(),
    item.dailyRewards
  ]);

  const cumulativeRewardsData = data.map(item => [
    new Date(item.date).getTime(),
    item.cumulativeRewards
  ]);

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      height: height,
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: title,
      style: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '600'
      }
    },
    xAxis: {
      type: 'datetime',
      gridLineColor: 'rgba(255, 255, 255, 0.1)',
      lineColor: 'rgba(255, 255, 255, 0.2)',
      tickColor: 'rgba(255, 255, 255, 0.2)',
      labels: {
        style: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '11px'
        }
      },
      title: {
        style: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    yAxis: [{
      title: {
        text: 'Daily Rewards ($)',
        style: {
          color: '#10b981',
          fontSize: '12px'
        }
      },
      gridLineColor: 'rgba(255, 255, 255, 0.1)',
      lineColor: 'rgba(255, 255, 255, 0.2)',
      tickColor: 'rgba(255, 255, 255, 0.2)',
      labels: {
        style: {
          color: '#10b981',
          fontSize: '11px'
        },
        formatter: function() {
          return '$' + Highcharts.numberFormat(this.value as number, 0);
        }
      }
    }, {
      title: {
        text: 'Cumulative Rewards ($)',
        style: {
          color: '#3b82f6',
          fontSize: '12px'
        }
      },
      labels: {
        style: {
          color: '#3b82f6',
          fontSize: '11px'
        },
        formatter: function() {
          return '$' + Highcharts.numberFormat(this.value as number, 0);
        }
      },
      opposite: true
    }],
    tooltip: {
      backgroundColor: 'rgba(20, 20, 25, 0.95)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      borderRadius: 8,
      style: {
        color: '#ffffff',
        fontSize: '12px'
      },
      shared: true,
      formatter: function() {
        let tooltip = `<b>${Highcharts.dateFormat('%B %e, %Y', this.x as number)}</b><br/>`;
        this.points?.forEach(point => {
          tooltip += `<span style="color: ${point.color}">${point.series.name}: $${Highcharts.numberFormat(point.y as number, 2)}</span><br/>`;
        });
        return tooltip;
      }
    },
    legend: {
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px'
      },
      itemHoverStyle: {
        color: '#ffffff'
      }
    },
    plotOptions: {
      area: {
        fillOpacity: 0.3,
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 5
            }
          }
        }
      },
      column: {
        borderWidth: 0,
        borderRadius: 2,
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    },
    series: [{
      type: 'column',
      name: 'Daily Rewards',
      data: dailyRewardsData,
      yAxis: 0,
      color: '#10b981',
      opacity: 0.8
    }, {
      type: 'area',
      name: 'Cumulative Rewards',
      data: cumulativeRewardsData,
      yAxis: 1,
      color: '#3b82f6',
      fillColor: {
        linearGradient: {
          x1: 0, y1: 0, x2: 0, y2: 1
        },
        stops: [
          [0, 'rgba(59, 130, 246, 0.3)'],
          [1, 'rgba(59, 130, 246, 0.05)']
        ]
      }
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className="yieldx-card-glass p-6 rounded-2xl border border-white/10">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default RewardsAreaChart;
