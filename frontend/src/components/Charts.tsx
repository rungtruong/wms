'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Request status doughnut chart - exactly like original
export function WarrantyRequestsChart() {
  const data = {
    labels: ['Chờ xử lý', 'Đang xử lý', 'Hoàn thành'],
    datasets: [{
      data: [12, 5, 127], // pendingRequests, processingRequests, completedRequests
      backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12,
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(31, 184, 205, 0.5)',
        borderWidth: 1,
      },
    },
  }

  return <Doughnut data={data} options={options} />
}

// Top failing products bar chart - exactly like original
export function ProductFailuresChart({ data: chartData }: { data: any[] }) {
  const data = {
    labels: chartData.map(item => item.name),
    datasets: [{
      label: 'Số lượng lỗi',
      data: chartData.map(item => item.failures),
      backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(31, 184, 205, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} lỗi`
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}
