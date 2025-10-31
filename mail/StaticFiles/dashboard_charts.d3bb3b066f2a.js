document.addEventListener('DOMContentLoaded', () => {
    // ===== EMAIL SUBSCRIBERS LINE CHART =====
    const ctxSubscribers = document.getElementById('subscribersChart');
    if (ctxSubscribers) {
        const gradientBlue = ctxSubscribers.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradientBlue.addColorStop(0, 'rgba(59,130,246,0.7)');
        gradientBlue.addColorStop(1, 'rgba(59,130,246,0.05)');

        new Chart(ctxSubscribers, {
            type: 'line',
            data: {
                labels: window.chartData.month_labels,
                datasets: [{
                    label: 'Email Subscribers Growth',
                    data: window.chartData.monthly_subscribers,
                    backgroundColor: gradientBlue,
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    pointBackgroundColor: '#1d4ed8',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 2000, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: true, labels: { color: '#1f2937' } },
                    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#e5e7eb' }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(229,231,235,0.3)' } }
                }
            }
        });
    }

    // ===== TELEGRAM SUBSCRIBERS LINE CHART =====
    const ctxTelegramSubscribers = document.getElementById('telegramsubscribersChart');
    if (ctxTelegramSubscribers) {
        const gradientBlue = ctxTelegramSubscribers.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradientBlue.addColorStop(0, 'rgba(59,130,246,0.7)');
        gradientBlue.addColorStop(1, 'rgba(59,130,246,0.05)');

        new Chart(ctxTelegramSubscribers, {
            type: 'line',
            data: {
                labels: window.chartData.month_telegram_labels,
                datasets: [{
                    label: 'Telegram Subscribers Growth',
                    data: window.chartData.monthly_telegram_subscribers,
                    backgroundColor: gradientBlue,
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    pointBackgroundColor: '#1d4ed8',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 2000, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: true, labels: { color: '#1f2937' } },
                    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#e5e7eb' }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(229,231,235,0.3)' } }
                }
            }
        });
    }

    // ===== EMAIL CAMPAIGNS BAR CHART =====
    const ctxCampaigns = document.getElementById('campaignsChart');
    if (ctxCampaigns) {
        new Chart(ctxCampaigns, {
            type: 'bar',
            data: {
                labels: window.chartData.month_labels,
                datasets: [{
                    label: 'Email Campaigns Sent',
                    data: window.chartData.monthly_campaigns,
                    backgroundColor: 'rgba(16,185,129,0.7)',
                    borderRadius: 12,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 1800, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#e5e7eb' }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(229,231,235,0.2)' } }
                }
            }
        });
    }

    // ===== TELEGRAM CAMPAIGNS BAR CHART =====
    const ctxTelegramCampaigns = document.getElementById('telegramcampaignsChart');
    if (ctxTelegramCampaigns) {
        new Chart(ctxTelegramCampaigns, {
            type: 'bar',
            data: {
                labels: window.chartData.month_labels,
                datasets: [{
                    label: 'Telegram Campaigns Sent',
                    data: window.chartData.monthly_telegram_campaigns,
                    backgroundColor: 'rgba(20, 5, 234, 0.7)',
                    borderRadius: 12,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 1800, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#e5e7eb' }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(229,231,235,0.2)' } }
                }
            }
        });
    }

    // ===== PERSONALIZED EMAILS BAR CHART =====
    const ctxEmails = document.getElementById('personalEmailsChart');
    if (ctxEmails) {
        new Chart(ctxEmails, {
            type: 'bar',
            data: {
                labels: window.chartData.month_labels,
                datasets: [{
                    label: 'Personalized Emails',
                    data: window.chartData.monthly_personal_emails,
                    backgroundColor: 'rgba(234,179,8,0.7)',
                    borderRadius: 12,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 1800, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#e5e7eb' }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(229,231,235,0.2)' } }
                }
            }
        });
    }

    // ===== Telegram DOUGHNUT CHART =====
    const ctxTelegram = document.getElementById('telegramChart');
    if (ctxTelegram) {
        new Chart(ctxTelegram, {
            type: 'doughnut',
            data: {
                labels: window.chartData.telegram_labels,
                datasets: [{
                    label: 'Telegram Analytics',
                    data: window.chartData.telegram_data,
                    backgroundColor: ['#10b981', '#dc4c0aff'],
                    hoverOffset: 12
                }]
            },
            options: {
                cutout: '75%',
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#1f2937' } },
                    tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#e5e7eb' }
                }
            },
            plugins: [{
                id: 'centerText',
                afterDraw(chart) {
                    const { ctx, chartArea: { width, height } } = chart;
                    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    ctx.save();
                    ctx.font = 'bold 18px sans-serif';
                    ctx.fillStyle = '#374151';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(total, width / 2 + chart.chartArea.left / 2, height / 2 + chart.chartArea.top / 2);
                }
            }]
        });
    }
});
