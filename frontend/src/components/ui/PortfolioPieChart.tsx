"use client";

import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Configure Highcharts for Next.js
if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    accessibility: {
      enabled: false
    }
  });
}

interface PieChartData {
  name: string;
  y: number;
  color: string;
}

interface PortfolioPieChartProps {
  data: PieChartData[];
  title?: string;
  height?: number;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({
  data,
  title = "Asset Allocation",
  height = 400
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
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
    tooltip: {
      backgroundColor: 'rgba(20, 20, 25, 0.95)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      borderRadius: 8,
      style: {
        color: '#ffffff',
        fontSize: '12px'
      },
      pointFormat: '<b>{point.name}</b><br/>Value: ${point.y:,.2f}<br/>Percentage: {point.percentage:.1f}%'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br/>{point.percentage:.1f}%',
          style: {
            color: '#ffffff',
            fontSize: '11px',
            textOutline: '1px rgba(0, 0, 0, 0.8)'
          },
          distance: 20
        },
        showInLegend: true,
        states: {
          hover: {
            halo: {
              size: 10,
              opacity: 0.25
            }
          }
        }
      }
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px'
      },
      itemHoverStyle: {
        color: '#ffffff'
      }
    },
    series: [{
      type: 'pie',
      name: 'Assets',
      data: data.map(item => ({
        name: item.name,
        y: item.y,
        color: item.color
      }))
    }    ],
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

export default PortfolioPieChart;
