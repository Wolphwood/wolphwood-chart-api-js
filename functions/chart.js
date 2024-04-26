const Chart = require('chart.js/auto');
const ChartDataLabels = require("chartjs-plugin-datalabels");
const PluginEmptyDoughnut = {
    id: 'emptyDoughnut',
    afterDraw(chart, args, options) {
        const {datasets} = chart.data;
        const {color, width, radiusDecrease, backgroundColor} = options;
        let hasData = false;

        for (let i = 0; i < datasets.length; i += 1) {
            const dataset = datasets[i];
            hasData |= dataset.data.reduce((acc,cu) => acc + Math.abs(cu), 0) > 0;
        }

        if (!hasData) {
            const {chartArea: {left, top, right, bottom}, ctx} = chart;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const r = Math.min(right - left, bottom - top) / 2;

            ctx.beginPath();
            ctx.lineWidth = width || 2;
            ctx.fillStyle = backgroundColor || 'rgba(0,0,0,0.1)';
            ctx.strokeStyle = color || 'rgba(255, 128, 0, 0.5)';
            ctx.arc(centerX, centerY, (r - (radiusDecrease || 0)), 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }
};

module.exports = { Chart, ChartDataLabels, PluginEmptyDoughnut };