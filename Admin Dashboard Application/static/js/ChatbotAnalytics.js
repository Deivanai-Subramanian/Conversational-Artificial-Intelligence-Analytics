const placeholderData = [90, 10]; // Example data for donut chart

    // Chart.js visualization for User Interaction Rate as a donut chart
    const ctx1 = document.getElementById('userInteractionRateChart').getContext('2d');
    const userInteractionRateChart = new Chart(ctx1, {
    type: 'doughnut', // Set type as doughnut for a donut chart
    data: {
        labels: ['Engaged Users', 'Non-Engaged Users'],
        datasets: [{
        label: 'User Interaction Rate',
        data: placeholderData,
        backgroundColor: ['#36a2eb', '#ff6384'],
        hoverOffset: 4
        }]
    }
    });

    // Bar Chart for Number of Interactions per User Session
    const interactionsData = [10, 15, 20, 25, 18]; // Example data for bar chart
    const ctx2 = document.getElementById('interactionsPerSessionChart').getContext('2d');
    const interactionsChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'],
        datasets: [{
          label: 'Number of Interactions',
          data: interactionsData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Interactions'
            }
          },
          x: {
            title: {
              display: true,
              text: 'User Session'
            }
          }
        }
      }
    });


    const successfulTasks = [90, 88, 95, 92, 98]; // Example data for successful tasks
    const unsuccessfulTasks = [10, 12, 5, 8, 2]; // Example data for unsuccessful tasks

    const ctx3 = document.getElementById('taskCompletionRateChart').getContext('2d');
    const taskCompletionRateChart = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'],
        datasets: [{
          label: 'Successful Tasks',
          data: successfulTasks,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }, {
          label: 'Unsuccessful Tasks',
          data: unsuccessfulTasks,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            title: {
              display: true,
              text: 'Number of Tasks'
            }
          },
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'User Session'
            }
          }
        }
      }
    });

    const accuracyScores = [90, 92, 95, 88, 99]; // Example data for accuracy scores

    const ctx4 = document.getElementById('intentAccuracyChart').getContext('2d');
    const intentAccuracyChart = new Chart(ctx4, {
      type: 'radar',
      data: {
        labels: ['Intent 1', 'Intent 2', 'Intent 3', 'Intent 4', 'Intent 5'],
        datasets: [{
          label: 'Accuracy Scores',
          data: accuracyScores,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            title: {
              display: true,
              text: 'Accuracy (%)'
            }
          }
        }
      }
    });


    const conversationData = [150, 180, 160, 190, 195, 200, 200]; // Example data for total conversations over time

    // Chart.js visualization for Total Conversations as a line chart
    const ctx6 = document.getElementById('totalConversationsChart').getContext('2d');
    const totalConversationsChart = new Chart(ctx6, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Example labels for months
        datasets: [{
          label: 'Total Conversations',
          data: conversationData,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)', // Line color
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Conversations'
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

// Example CSAT score (out of 100)
var csatScore = 95;
var gaugedata = {
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
var canvas1 = document.getElementById("csatGauge");
var gaugelayout = new Gauge(canvas1).setOptions(gaugedata);
gaugelayout.maxValue = 100;
gaugelayout.set(csatScore);


    // Create a box plot or violin plot

    // Example data for conversation lengths
    const conversationLengths = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

    // Creating a trace for the box plot
    const trace = {
    y: conversationLengths,
    type: 'box',
    name: 'Conversation Length'
    };

    // Data to be plotted
    const data = [trace];

    // Layout configuration
    const layout = {
    title: 'Conversation Length Box Plot',
    yaxis: {
        title: 'Length'
    }
    };

    // Plotting the box plot
    Plotly.newPlot('boxplot', data, layout);

    const fallbackRates = [12, 15, 10, 8, 5, 4, 3]; // Example fallback rates over months
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July']; // Example months

    const ctx8 = document.getElementById('fallbackRateChart').getContext('2d');
    const fallbackRateChart = new Chart(ctx8, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Fallback Rate',
          data: fallbackRates,
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
              text: 'Fallback Rate'
            }
          }
        }
      }
    });

// Example data for integration success rates
    const successSteps = [90, 95, 100, 95]; // Successful steps (percentage)
    const failSteps = [10, 5, 0, 5]; // Unsuccessful steps (percentage)
    const stages = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4']; // Stages

    // Create trace for successful steps
    const successfulTrace = {
      type: 'funnel',
      name: 'Successful',
      y: stages,
      x: successSteps,
      textposition: 'inside',
      textinfo: 'value+percent initial',
      marker: {
        color: 'rgba(54, 162, 235, 0.6)'
      }
    };

    // Create trace for unsuccessful steps
    const unsuccessfulTrace = {
      type: 'funnel',
      name: 'Unsuccessful',
      y: stages,
      x: failSteps,
      textposition: 'inside',
      textinfo: 'value+percent initial',
      marker: {
        color: 'rgba(255, 99, 132, 0.6)'
      }
    };

    // Layout for the funnel chart
    const funnellayout = {
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4
      },
      funnelmode: "stack",
      showlegend: true,
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1
      }
    };

    // Combine traces and layout, and create the plot
    const funneldata = [successfulTrace, unsuccessfulTrace];
    Plotly.newPlot('integrationSuccessChart', funneldata, funnellayout);

    const integrationPoints = ['Integration 1', 'Integration 2', 'Integration 3'];
    const errorRates1 = [5, 6, 3]; // Error rates for Integration 1
    const errorRates2 = [6, 4, 3]; // Error rates for Integration 2
    const errorRates3 = [3, 4, 5]; // Error rates for Integration 3

    const ctx10 = document.getElementById('errorRateChart').getContext('2d');
    const errorRateChart = new Chart(ctx10, {
      type: 'bar',
      data: {
        labels: integrationPoints,
        datasets: [
          {
            label: 'Integration 1',
            data: errorRates1,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Integration 2',
            data: errorRates2,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Integration 3',
            data: errorRates3,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Error Rates'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Integration Points'
            }
          }
        }
      }
    });

    const dates = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const newUsersData = [100, 120, 150, 180, 200, 240, 300]; // Example data for new users

    const ctx11 = document.getElementById('newUsersChart').getContext('2d');
    const newUsersChart = new Chart(ctx11, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Number of New Users',
          data: newUsersData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Users'
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

    const retentionRateData = [90, 95, 88, 93, 95, 98, 100]; // Example data for retention rate

    const ctx12 = document.getElementById('retentionRateChart').getContext('2d');
    const retentionRateChart = new Chart(ctx12, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'User Retention Rate (%)',
          data: retentionRateData,
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 100,
            title: {
              display: true,
              text: 'Retention Rate (%)'
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

    const genderData = [45, 55]; // Example data for gender distribution

    const ctx13 = document.getElementById('userIdentificationChart').getContext('2d');
    const userIdentificationChart = new Chart(ctx13, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          label: 'User Identification (Gender)',
          data: genderData,
          backgroundColor: ['#36a2eb', '#ff6384'],
          hoverOffset: 4
        }]
      }
    });
    // Add additional Chart.js instances for other KPIs...
