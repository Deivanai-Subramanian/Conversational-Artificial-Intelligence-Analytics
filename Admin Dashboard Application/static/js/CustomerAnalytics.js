// Set the Subscriber Retention Rate here
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

// Set the Subscriber Churn Rate here
var churnRate = 13.6;
var options2 = {
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
        {strokeStyle: "green", min: 0, max: 25},
        {strokeStyle: "yellow", min: 25, max: 50},
        {strokeStyle: "orange", min: 50, max: 75},
        {strokeStyle: "red", min: 75, max: 100}
    ],
    staticLabels: {
        font: "10px sans-serif",
        labels: [0, 25, 50, 75, 100],
        color: "#000000"
    }
};
var canvas2 = document.getElementById("ChurnGaugeChart");
var gauge2 = new Gauge(canvas2).setOptions(options2);
gauge2.maxValue = 100;
gauge2.set(churnRate);

// Get the canvas context
var ctx = canvas2.getContext("2d");

// Define label properties
ctx.font = "14px sans-serif";
ctx.fillStyle = "#000000";
ctx.textAlign = "center";

// Loop through the staticZones and add labels below the arc
options2.staticZones.forEach(function (zone) {
    var startAngle = options2.angle - (Math.PI * (zone.min / 100));
    var endAngle = options2.angle - (Math.PI * (zone.max / 100));
    var labelX = canvas2.width / 2;
    var labelY = canvas2.height / 2 + (canvas2.width / 2) * Math.sin(startAngle);

    ctx.fillText(zone.min, labelX, labelY + 16); // Adjust the Y position as needed
});


// Sample data representing customer gender distribution (replace with your actual data)
var data = {
    labels: ["Male", "Female", "Others"],
    datasets: [
        {
            data: [40, 50, 10],  // Replace with the actual percentages
            backgroundColor: ['#4BC0C0', '#36A2EB', '#9966FF']
        }
    ]
};

var optionsGen = {
    plugins: {
        legend: {
            position: 'right', // Set the legend position to 'right'
        },
    },
    responsive: false,
    maintainAspectRatio: false,
};
var canvas3 = document.getElementById("genderChart");
var ctx = canvas3.getContext('2d');
new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: optionsGen
});

// Data representing the provided dataset
var data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
        {
            label: "Subscribers",
            type: "bar",
            data: [40, 45, 60, 70, 75, 75, 80],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0074D9',
            borderWidth: 1
        },
        {
            label: "Churn Rate",
            type: "line",
            data: [30, 25, 24, 20.3, 17.7, 10.8, 10, 9],
            fill: false,
            borderColor: '#F03E3E',
            borderWidth: 2
        }
    ]
};

var options = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            position: 'top',
        }
    }
};

var canvas = document.getElementById("mixedChart");
var ctx = canvas.getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});

// Data representing the provided dataset
var dataBar = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
        {
            label: "Retention Rate",
            data: [75, 82.2, 71.4, 82, 70, 89, 95],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0074D9',
            borderWidth: 1
        }
    ]
};

var optionsBar = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            max: 100, // Set the maximum value for the Y-axis
        }
    },
    plugins: {
        legend: {
            display: false, // Hide the legend
        },
    }
};

var canvasBar = document.getElementById("barChart");
var ctxBar = canvasBar.getContext('2d');

new Chart(ctxBar, {
    type: 'bar',
    data: dataBar,
    options: {
        ...options, // Merge the existing options
        plugins: {
            ...options.plugins, // Merge the existing plugins
            datalabels: { // Configure the Datalabels plugin
                color: 'black',
                align: 'end',
                formatter: function(value, context) {
                    return value + '%';
                }
            }
        }
    }
});

var chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            label: "My Data",
            backgroundColor: "#79D1CF",
            borderColor: "#79D1CF",
            data: [60, 80, 81, 56, 55, 40]
        }
    ]
};


var chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            fillColor: "#79D1CF",
            strokeColor: "#79D1CF",
            data: [60, 80, 81, 56, 55, 40]
        }
    ]
};

var ctx = document.getElementById("myChart1").getContext("2d");
var myLine = new Chart(ctx).Line(chartData, {
    showTooltips: false,
    onAnimationComplete: function () {

        var ctx = this.chart.ctx;
        ctx.font = this.scale.font;
        ctx.fillStyle = this.scale.textColor
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        this.datasets.forEach(function (dataset) {
            dataset.points.forEach(function (points) {
                ctx.fillText(points.value, points.x, points.y - 10);
            });
        })
    }
});