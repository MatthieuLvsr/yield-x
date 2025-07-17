'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type React from 'react';
import { useEffect, useRef } from 'react';
import ChartBackground from './ChartBackground';
import InteractiveGlow from './InteractiveGlow';

// Configure Highcharts for Next.js
if (typeof Highcharts === 'object') {
  // Disable accessibility module to avoid import issues
  Highcharts.setOptions({
    accessibility: {
      enabled: false,
    },
  });
}

interface PortfolioLineChartProps {
  data: Array<{
    date: string;
    value: number;
    rewards: number;
  }>;
  title?: string;
  height?: number;
}

const PortfolioLineChart: React.FC<PortfolioLineChartProps> = ({
  data,
  title = 'Portfolio Performance',
  height = 400,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Convert data for Highcharts
  const chartData = data.map((item) => [
    new Date(item.date).getTime(),
    item.value,
  ]);

  const rewardsData = data.map((item) => [
    new Date(item.date).getTime(),
    item.rewards,
  ]);

  const options: Highcharts.Options = {
    chart: {
      type: 'areaspline',
      backgroundColor: 'transparent',
      height,
      style: {
        fontFamily: 'Inter, sans-serif',
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
      },
      plotBorderColor: 'rgba(0, 234, 255, 0.1)',
      plotBorderWidth: 1,
    },
    title: {
      text: title,
      style: {
        color: '#00EAFF',
        fontSize: '18px',
        fontWeight: '600',
        textShadow: '0 0 10px rgba(0, 234, 255, 0.5)',
      },
    },
    xAxis: {
      type: 'datetime',
      gridLineColor: 'rgba(0, 234, 255, 0.1)',
      lineColor: 'rgba(0, 234, 255, 0.3)',
      tickColor: 'rgba(0, 234, 255, 0.3)',
      labels: {
        style: {
          color: '#8B9DC3',
          fontSize: '11px',
          fontWeight: '400',
        },
      },
      title: {
        style: {
          color: '#8B9DC3',
        },
      },
      crosshair: {
        color: 'rgba(0, 234, 255, 0.6)',
        width: 1,
        dashStyle: 'Dash',
        zIndex: 100,
      },
    },
    yAxis: {
      title: {
        text: 'Value ($)',
        style: {
          color: '#8B9DC3',
          fontSize: '12px',
        },
      },
      gridLineColor: 'rgba(64, 224, 208, 0.1)',
      lineColor: 'rgba(64, 224, 208, 0.3)',
      tickColor: 'rgba(64, 224, 208, 0.3)',
      labels: {
        style: {
          color: '#8B9DC3',
          fontSize: '11px',
          fontWeight: '400',
        },
        formatter() {
          return (
            '$' + Highcharts.numberFormat(this.value as number, 0, '.', ',')
          );
        },
      },
      crosshair: {
        color: 'rgba(64, 224, 208, 0.6)',
        width: 1,
        dashStyle: 'Dash',
        zIndex: 100,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(13, 16, 23, 0.95)',
      borderColor: 'rgba(0, 234, 255, 0.5)',
      borderWidth: 2,
      borderRadius: 12,
      style: {
        color: '#E2E8F0',
        fontSize: '12px',
        fontWeight: '500',
      },
      shadow: {
        color: 'rgba(0, 234, 255, 0.3)',
        offsetX: 0,
        offsetY: 0,
        opacity: 0.8,
        width: 12,
      },
      formatter() {
        return `<div style="padding: 8px 12px;">
          <div style="color: #00EAFF; font-weight: 700; margin-bottom: 8px; text-shadow: 0 0 5px rgba(0, 234, 255, 0.5);">
            ${Highcharts.dateFormat('%B %e, %Y', this.x as number)}
          </div>
          <div style="color: #40E0D0; font-size: 11px; margin-bottom: 4px;">Portfolio Value</div>
          <div style="color: #E2E8F0; font-weight: 700; font-size: 14px;">
            $${Highcharts.numberFormat(this.y as number, 2, '.', ',')}
          </div>
        </div>`;
      },
      useHTML: true,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.3,
        lineWidth: 3,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 8,
              fillColor: '#00EAFF',
              lineColor: '#40E0D0',
              lineWidth: 3,
            },
          },
        },
        states: {
          hover: {
            lineWidth: 4,
            halo: {
              size: 10,
              opacity: 0.25,
              attributes: {
                fill: '#00EAFF',
              },
            },
          },
        },
        animation: {
          duration: 2500,
          easing: 'easeOutQuart',
        },
        enableMouseTracking: true,
      },
    },
    series: [
      {
        type: 'areaspline',
        name: 'Portfolio Value',
        data: chartData,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
          stops: [
            [0, '#00EAFF'],
            [0.3, '#40E0D0'],
            [0.7, '#7C3AED'],
            [1, '#10B981'],
          ],
        } as any,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(0, 234, 255, 0.4)'],
            [0.5, 'rgba(64, 224, 208, 0.2)'],
            [1, 'rgba(124, 58, 237, 0.05)'],
          ],
        } as any,
        shadow: {
          color: 'rgba(0, 234, 255, 0.4)',
          offsetX: 0,
          offsetY: 0,
          opacity: 0.8,
          width: 6,
        },
        zones: [
          {
            value: Math.min(...chartData.map((d) => d[1])),
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
              stops: [
                [0, '#EF4444'],
                [1, '#F97316'],
              ],
            },
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, 'rgba(239, 68, 68, 0.3)'],
                [1, 'rgba(239, 68, 68, 0.05)'],
              ],
            },
          },
          {
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
              stops: [
                [0, '#00EAFF'],
                [0.5, '#40E0D0'],
                [1, '#10B981'],
              ],
            },
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, 'rgba(0, 234, 255, 0.4)'],
                [0.5, 'rgba(64, 224, 208, 0.2)'],
                [1, 'rgba(16, 185, 129, 0.05)'],
              ],
            },
          },
        ] as any,
      },
    ],
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
  };

  // Determine chart variant based on performance
  const currentValue = chartData[chartData.length - 1]?.[1] || 0;
  const previousValue = chartData[0]?.[1] || 0;
  const isProfit = currentValue > previousValue;
  const chartVariant =
    currentValue > previousValue
      ? 'profit'
      : currentValue < previousValue
        ? 'loss'
        : 'neutral';

  // Add dynamic chart configuration based on data
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      const chart = chartRef.current.chart;

      // Add responsive behavior
      const handleResize = () => {
        if (chart) {
          chart.reflow();
        }
      };

      window.addEventListener('resize', handleResize);

      // Add hover effects to enhance interactivity
      chart.container.addEventListener('mouseenter', () => {
        chart.container.style.transition = 'all 0.3s ease';
        chart.container.style.filter = 'brightness(1.1)';
      });

      chart.container.addEventListener('mouseleave', () => {
        chart.container.style.filter = 'brightness(1)';
      });

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div className="yieldx-card-glass group yieldx-cyber-border relative overflow-hidden rounded-2xl border border-white/10 p-6">
      {/* Interactive Glow Layer */}
      <InteractiveGlow
        className="opacity-50 transition-opacity duration-700 group-hover:opacity-80"
        intensity={0.6}
        variant={chartVariant}
      />

      {/* Enhanced Chart Background */}
      <ChartBackground
        className="opacity-40 transition-opacity duration-500 group-hover:opacity-60"
        intensity="medium"
        variant={chartVariant}
      />

      {/* Chart container with enhanced styling */}
      <div className="relative z-10">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>

      {/* Performance indicator overlay */}
      <div className="absolute top-4 right-4 z-20">
        <div
          className={`rounded-full px-3 py-1 font-semibold text-xs backdrop-blur-sm transition-all duration-300 ${
            isProfit
              ? 'border border-green-400/30 bg-green-500/20 text-green-300 hover:bg-green-500/30 hover:shadow-green-400/20 hover:shadow-lg'
              : 'border border-red-400/30 bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-400/20'
          }`}
        >
          {isProfit ? '↗' : '↘'}{' '}
          {(((currentValue - previousValue) / previousValue) * 100).toFixed(1)}%
        </div>
      </div>

      {/* Enhanced glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric-blue/5 via-transparent to-neon-green/5 blur-sm" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-electric-blue/3 via-transparent to-neon-green/3 blur-lg" />
      </div>
    </div>
  );
};

export default PortfolioLineChart;
