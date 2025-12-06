document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    if (document.getElementById('foodUsageChart')) initFoodUsageChart();
    if (document.getElementById('resourceDistributionChart')) initResourceDistributionChart();
    if (document.getElementById('needsAssessmentChart')) initNeedsAssessmentChart();
    
    // Add event listeners for filters
    setupChartFilters();
});

function initFoodUsageChart() {
    const ctx = document.getElementById('foodUsageChart').getContext('2d');
    const data = {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        datasets: [{
            label: 'Meals Served',
            data: [1200, 1450, 1600, 1350, 1550, 1700],
            backgroundColor: 'rgba(39, 116, 174, 0.5)',
            borderColor: 'rgba(39, 116, 174, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
        }]
    };

    window.foodUsageChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: getChartOptions('Meals Served per Month')
    });
}

function initResourceDistributionChart() {
    const ctx = document.getElementById('resourceDistributionChart').getContext('2d');
    const data = {
        labels: ['Food', 'Housing', 'Financial', 'Health', 'Other'],
        datasets: [{
            data: [45, 25, 15, 10, 5],
            backgroundColor: [
                'rgba(39, 116, 174, 0.7)',
                'rgba(255, 209, 0, 0.7)',
                'rgba(255, 111, 97, 0.7)',
                'rgba(26, 54, 93, 0.7)',
                'rgba(113, 128, 150, 0.7)'
            ],
            borderWidth: 1
        }]
    };

    window.resourceDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '65%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

function initNeedsAssessmentChart() {
    const ctx = document.getElementById('needsAssessmentChart').getContext('2d');
    const data = {
        labels: ['Food Insecurity', 'Housing Insecurity', 'Financial Stress', 'Mental Health', 'Academic Impact'],
        datasets: [{
            label: 'All Students',
            data: [42, 38, 45, 52, 35],
            backgroundColor: 'rgba(39, 116, 174, 0.7)',
            borderColor: 'rgba(39, 116, 174, 1)',
            borderWidth: 1
        }]
    };

    window.needsAssessmentChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: getChartOptions('Percentage of Students Reporting Need')
    });
}

function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 14,
                    weight: 'bold'
                },
                padding: {
                    bottom: 15
                }
            },
            legend: {
                display: title.includes('Needs Assessment'),
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + (title.includes('Percentage') ? '%' : '');
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return title.includes('Percentage') ? value + '%' : value;
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };
}

function setupChartFilters() {
    // Time period filter for food usage chart
    const filterButtons = document.querySelectorAll('.chart-filter');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons in this group
                this.parentElement.querySelectorAll('.chart-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update chart data based on filter
                updateFoodUsageData(this.dataset.filter);
            });
        });
    }

    // Student type filter for needs assessment
    const assessmentFilter = document.getElementById('assessmentFilter');
    if (assessmentFilter) {
        assessmentFilter.addEventListener('change', function() {
            updateNeedsAssessmentData(this.value);
        });
    }
}

function updateFoodUsageData(timePeriod) {
    // This would typically be an API call in a real application
    const data = {
        monthly: [1200, 1450, 1600, 1350, 1550, 1700],
        quarterly: [4250, 4500, 4800],
        yearly: [17500, 18500, 19500]
    };

    const labels = {
        monthly: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        quarterly: ['Fall', 'Winter', 'Spring'],
        yearly: ['2022', '2023', '2024']
    };

    if (window.foodUsageChart) {
        window.foodUsageChart.data.labels = labels[timePeriod];
        window.foodUsageChart.data.datasets[0].data = data[timePeriod];
        window.foodUsageChart.update();
    }
}

function updateNeedsAssessmentData(studentType) {
    // This would typically be an API call in a real application
    const data = {
        all: [42, 38, 45, 52, 35],
        undergrad: [45, 42, 48, 55, 38],
        grad: [32, 28, 35, 42, 25]
    };

    const labels = ['Food Insecurity', 'Housing Insecurity', 'Financial Stress', 'Mental Health', 'Academic Impact'];
    
    if (!window.needsAssessmentChart) return;
    
    // If we're showing multiple datasets (for comparison)
    if (studentType === 'all') {
        window.needsAssessmentChart.data.datasets = [
            {
                label: 'Undergraduates',
                data: data.undergrad,
                backgroundColor: 'rgba(39, 116, 174, 0.7)',
                borderColor: 'rgba(39, 116, 174, 1)',
                borderWidth: 1
            },
            {
                label: 'Graduates',
                data: data.grad,
                backgroundColor: 'rgba(255, 209, 0, 0.7)',
                borderColor: 'rgba(255, 209, 0, 1)',
                borderWidth: 1
            }
        ];
    } else {
        const label = studentType === 'undergrad' ? 'Undergraduates' : 'Graduates';
        window.needsAssessmentChart.data.datasets = [{
            label: label,
            data: data[studentType],
            backgroundColor: studentType === 'undergrad' 
                ? 'rgba(39, 116, 174, 0.7)' 
                : 'rgba(255, 209, 0, 0.7)',
            borderColor: studentType === 'undergrad' 
                ? 'rgba(39, 116, 174, 1)' 
                : 'rgba(255, 209, 0, 1)',
            borderWidth: 1
        }];
    }
    
    window.needsAssessmentChart.data.labels = labels;
    window.needsAssessmentChart.update();
}
