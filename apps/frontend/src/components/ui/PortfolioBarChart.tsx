'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type React from 'react';
import { useRef } from 'react';

// Configure Highcharts for Next.js
if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    accessibility: {
      enabled: false,
    },
  });
}

interface BarChartData {
  name: string;
  apy: number;
  value: number;
  risk: 'Low' | 'Medium' | 'High';
}

interface PortfolioBarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
}

const PortfolioBarChart: React.FC<PortfolioBarChartProps> = ({
  data,
  title = 'Strategy Performance',
  height = 400,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return '#10b981';
      case 'Medium':
        return '#f59e0b';
      case 'High':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const categories = data.map((item) => item.name);
  const apyData = data.map((item) => ({
    y: item.apy,
    color: getRiskColor(item.risk),
  }));
  const valueData = data.map((item) => item.value);

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height,
      style: {
        fontFamily: 'Inter, sans-serif',
      },
    },
    title: {
      text: title,
      style: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    xAxis: {
      categories,
      crosshair: true,
      gridLineColor: 'rgba(255, 255, 255, 0.1)',
      lineColor: 'rgba(255, 255, 255, 0.2)',
      tickColor: 'rgba(255, 255, 255, 0.2)',
      labels: {
        style: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '11px',
        },
        rotation: -45,
      },
    },
    yAxis: [
      {
        title: {
          text: 'APY (%)',
          style: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
          },
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
        lineColor: 'rgba(255, 255, 255, 0.2)',
        tickColor: 'rgba(255, 255, 255, 0.2)',
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '11px',
          },
          formatter() {
            return this.value + '%';
          },
        },
      },
      {
        title: {
          text: 'Value ($)',
          style: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
          },
        },
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '11px',
          },
          formatter() {
            return '$' + Highcharts.numberFormat(this.value as number, 0);
          },
        },
        opposite: true,
      },
    ],
    tooltip: {
      backgroundColor: 'rgba(20, 20, 25, 0.95)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 1,
      borderRadius: 8,
      style: {
        color: '#ffffff',
        fontSize: '12px',
      },
      shared: true,
      formatter() {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points?.forEach((point) => {
          if (point.series.name === 'APY') {
            tooltip += `<span style="color: ${point.color}">APY: ${point.y}%</span><br/>`;
          } else {
            tooltip += `<span style="color: ${point.color}">Value: $${Highcharts.numberFormat(point.y as number, 2)}</span>`;
          }
        });
        return tooltip;
      },
    },
    legend: {
      itemStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px',
      },
      itemHoverStyle: {
        color: '#ffffff',
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          style: {
            color: '#ffffff',
            fontSize: '10px',
            textOutline: '1px rgba(0, 0, 0, 0.8)',
          },
        },
      },
    },
    series: [
      {
        type: 'column',
        name: 'APY',
        data: apyData,
        yAxis: 0,
        dataLabels: {
          enabled: true,
          formatter() {
            return this.y + '%';
          },
        },
      },
      {
        type: 'line',
        name: 'Value',
        data: valueData,
        yAxis: 1,
        color: '#8b5cf6',
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 4,
          fillColor: '#8b5cf6',
        },
        dataLabels: {
          enabled: false,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="yieldx-card-glass rounded-2xl border border-white/10 p-6">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default PortfolioBarChart;
