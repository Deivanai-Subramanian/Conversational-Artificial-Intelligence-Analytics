const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const revenueData = [100000, 120000, 100000, 110000, 130000, 105000, 125000]; // Replace with your revenue values

    // Chart.js visualization for Total Revenue over months as a Line Chart
    const ctx1 = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Total Revenue',
          data: revenueData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Revenue'
            }
          }
        }
      }
    });

    // Replace the existing chart definition with the donut chart for SIM vs E-SIM
const ctx2 = document.getElementById('revenueBySIMChart').getContext('2d');
const revenueBySIMChart = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: ['SIM', 'E-SIM'],
    datasets: [
      {
        label: 'Revenue',
        data: [60, 40], // Representing 60% and 40% directly as percentages
        backgroundColor: ['#FFCE56', '#FF6384'],
        borderWidth: 1
      }
    ]
  },
  options: {
    cutout: '70%', // Adjust the cutout percentage as needed
    radius: '80%',
    plugins: {
      legend: {
        position: 'right'
      }
    }
  }
});


const ctx3 = document.getElementById('revenueByPlansChart').getContext('2d');
const revenueByPlansChart = new Chart(ctx3, {
  type: 'doughnut',
  data: {
    labels: ['Virtusa Plans', 'Customized Plan'],
    datasets: [
      {
        label: 'Revenue',
        data: [70, 30], // Replace with actual revenue data for Virtusa Data Plans vs User Customized Plan
        backgroundColor: ['#FFCE56', '#FF6384'],
        borderWidth: 1
      }
    ]
  },
  options: {
    cutout: '70%', // Adjust the cutout percentage as needed
    plugins: {
      legend: {
        position: 'right'
      }
    }
  }
});

  // Revenue Breakdown by Plan Types - Bar Chart
  const ctx4 = document.getElementById('revenueByPlanTypesChart').getContext('2d');
  const revenueByPlanTypesChart = new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: ['Daily Limit Data Plans', 'Annual Plans', 'No Daily Limit Data Plans', 'Affordable Value Pack'],
      datasets: [
        {
          label: 'Revenue',
          data: [50000, 30000, 40000, 25000],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Plan Types'
          }
        }
      }
    }
  });

  // Revenue Breakdown by ADDON - Donut Chart
  const ctx5 = document.getElementById('revenueByADDONChart').getContext('2d');
  const revenueByADDONChart = new Chart(ctx5, {
    type: 'doughnut',
    data: {
      labels: ['1GB', '2GB', '6GB', '12GB', '50GB'],
      datasets: [
        {
          label: 'Revenue',
          data: [10000, 15000, 12000, 10000, 20000],
          backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0', '#36A2EB', '#9966FF'],
          borderWidth: 1
        }
      ]
    },
    options: {
      cutout: '80%', // Adjust the cutout percentage as needed
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });

  // Example data for new customer sign-ups over months
const nmonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const newCustomerSignupsData = [4000, 5500, 6000, 5800, 6500, 7500, 8000]; // Replace with your new customer sign-ups data

// Chart.js visualization for New Customer Sign-ups over months as a Bar Chart
const ctx6 = document.getElementById('newCustomerSignupsChart').getContext('2d');
const newCustomerSignupsChart = new Chart(ctx6, {
  type: 'bar',
  data: {
    labels: nmonths,
    datasets: [{
      label: 'New Customer Sign-ups',
      data: newCustomerSignupsData,
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'New Customer Sign-ups'
        }
      }
    }
  }
});

// Example data for customer churn rate against target
/*const actualChurnRate = 23;
    const targetChurnRate = 80;

    // Create a Plotly trace for actual churn rate
    const actualTrace = {
      x: [actualChurnRate],
      y: ['Actual'],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgba(255, 99, 132, 0.5)', // Actual churn rate color
        line: {
          color: 'rgba(255, 99, 132, 1)', // Actual churn rate border color
          width: 1
        }
      }
    };
    // Create a Plotly trace for target churn rate
    const targetTrace = {
      x: [targetChurnRate],
      y: ['Target'],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgba(54, 162, 235, 0.5)', // Target churn rate color
        line: {
          color: 'rgba(54, 162, 235, 1)', // Target churn rate border color
          width: 1
        }
      }
    };
    // Create the layout
    const layout = {
      barmode: 'group',
      yaxis: {
        title: 'Rate',
        tickvals: ['Actual', 'Target']
      }
    };
    // Combine traces and layout, and render the chart
    const data = [actualTrace, targetTrace];
    Plotly.newPlot('churnRateChart', data, layout);*/

const bar = document.getElementById("churnRateChart");
const chart = new Chart(bar, {
    type: 'bar',
    data: {
        labels: ['Actual Churn Rate', 'Target Churn Rate'],
        datasets: [{
            label: 'Churn Rate' ,
            data: [23, 80],
            backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
        }],
    },
    options: {
    responsive: true,
    },
});


    var retentionRate = 93.5;
    var options1 = {
      angle: 0.15,
      lineWidth: 0.44,
      radiusScale: 1,
      pointer: {
          length: 0.6,
          strokeWidth: 0.035,
          color: '#000000'
      },
      limitMax: true,
      limitMin: true,
      colorStart: '#6FADCF',
      colorStop: '#8FC0DA',
      strokeColor: '#E0E0E0',
      generateGradient: true,
      highDpiSupport: true,
      staticZones: [
            {strokeStyle: "red", min: 0, max: 25},
            {strokeStyle: "orange", min: 25, max: 50},
            {strokeStyle: "yellow", min: 50, max: 75},
            {strokeStyle: "green", min: 75, max: 100}
      ],
      staticLabels: {
          font: "10px sans-serif",
          labels: [0, 25, 50, 75, 100],
          color: "#000000"
      }
    };
    var canvas1 = document.getElementById("retentionGaugeChart");
    var gauge1 = new Gauge(canvas1).setOptions(options1);
    gauge1.maxValue = 100;
    gauge1.set(retentionRate);

// Example data for plans and conversion rates
    // Example data for conversion rates by plans
    const plans = ['Daily Limit Data', 'Annual Plans', 'No Daily Limit Data', 'Affordable Value Pack'];
    const conversionRates = [80, 50, 45, 65]; // Replace with your conversion rate values for plans

    const ctx = document.getElementById('conversionRateChart').getContext('2d');
    const conversionRateChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: plans,
        datasets: [{
          label: 'Conversion Rate (%)',
          data: conversionRates,
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Conversion Rate (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Plans'
            }
          }
        }
      }
    });

    const mmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']; // Replace with your time period
    const arpuData = [120, 130, 125, 140, 135, 128, 130]; // Replace with your ARPU data

    const ctx7 = document.getElementById('arpuChart').getContext('2d');
    const arpuChart = new Chart(ctx7, {
      type: 'line',
      data: {
        labels: mmonths,
        datasets: [{
          label: 'ARPU',
          data: arpuData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Average Revenue Per User (ARPU)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Months'
            }
          }
        }
      }
    });


const npsScore = 95;

var options1 = {
    angle: 0.15,
    lineWidth: 0.44,
    radiusScale: 1,
    pointer: {
        length: 0.6,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    colorStart: '#6FADCF',
    colorStop: '#8FC0DA',
    strokeColor: '#E0E0E0',
    generateGradient: true,
    highDpiSupport: true,
    staticZones: [
        {strokeStyle: "red", min: 0, max: 25},
        {strokeStyle: "orange", min: 25, max: 50},
        {strokeStyle: "yellow", min: 50, max: 75},
        {strokeStyle: "green", min: 75, max: 100}
    ],
    staticLabels: {
        font: "10px sans-serif",
        labels: [0, 23, 50, 75, 100],
        color: "#000000"
    }
};
var canvasnps = document.getElementById("npsGauge");
var gaugenps = new Gauge(canvasnps).setOptions(options1);
gaugenps.maxValue = 100;
gaugenps.set(npsScore);


    const penetrationPercentage = [70, 45, 55, 30]; // Replace with your plan penetration percentages

    const ctx8 = document.getElementById('planPenetrationChart').getContext('2d');
    const planPenetrationChart = new Chart(ctx8, {
      type: 'bar',
      data: {
        labels: plans,
        datasets: [{
          label: 'Penetration Percentage',
          data: penetrationPercentage,
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Penetration Percentage'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Plans'
            }
          }
        }
      }
    });
