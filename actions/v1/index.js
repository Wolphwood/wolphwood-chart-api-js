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

            console.log(radiusDecrease)

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


const { createCanvas, loadImage } = require('canvas');

const util = require('util');

const { v4: uuidv4 } = require("uuid");

const { getRandomRangeRound, getRandomRangeFloor } = require('../../functions/random');
const { Manager } = require('../../app');

const RandomHexadecimalColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();

function HelloWorld(req, res, next) {
    res.status(200).json({ message: "HelloWorld o/" });
}

function RandomGraph(req, res, next) {
    let canvas = createCanvas(512,1024);
    let ctx = canvas.getContext('2d');

    let ChartValues = Array.from(Array(getRandomRangeRound(1,10)), (e,i,l) => ({
        "name": `RandomStuff${i}`,
        "color": "#" + Array.from(Array(6), () => "0123456789ABCDEF"[getRandomRangeFloor(0,16)]).join(''),
        "value": getRandomRangeRound(-100,100)
    }));

    // let ChartValues = [{value: 0}, {value: 0}];

    // let ChartData = {
    //     type: 'pie',
    //     plugins: [ChartDataLabels, PluginEmptyDoughnut],
    //     data: {
    //         labels: ChartValues.map(e => e.name ?? 'N/A'),
    //         datasets: [{
    //             label: "test",
    //             data: ChartValues.map(e => e.value),
    //             backgroundColor: ChartValues.map(e => e.color),
    //         }],
    //     },
    //     options: {
    //         borderWidth: 0,
    //         getDataValue: function(context, datasetIndex, value) {
    //             let sum = 0;
                
    //             let data = context.chart.data.datasets[datasetIndex].data;
    //             let legends = context.chart.legend.legendItems;

    //             for (let index = 0; index < data.length; index++) {
    //                 if (!legends[index].hidden) {
    //                     sum += Math.abs(data[index]);
    //                 }
    //             }
    
    //             console.log('sum', sum)
    //             return sum > 0 ? Math.abs(value) * 100 / sum : 0;
    //         },
    //         plugins: {
    //             emptyDoughnut: {
    //                 color: 'rgba(255, 128, 0, 0.5)',
    //                 width: 2,
    //             },
    //             legend: {
    //                 display: true,
    //                 position: 'top',
    //                 align: "left",
    //             },
    //             datalabels: {
    //                 color: '#fff', // Couleur du texte des valeurs
    //                 backgroundColor: 'rgba(0,0,0,.2)',
    //                 borderRadius: 5,
    //                 formatter: datalabelsFormatterPieGlobalPercentage
    //             }
    //         }
    //     }
    // };

    // let ChartData = {
    //     plugins: [ChartDataLabels, PluginEmptyDoughnut],
    //     data: {
    //       labels: [0,1,"test"],
    //       datasets: [
    //         {
    //           data: [ 28, 2, 0 ],
    //           backgroundColor: [ 'green', 'yellow', 'lightgray' ]
    //         }
    //       ]
    //     },
    //     type: 'pie',
    //     options: {
    //       responsive: true,
    //       borderWidth: 0,
    //       plugins: {
    //         datalabels: {
    //           color: '#fff',
    //           backgroundColor: 'rgba(0,0,0,.2)',
    //           borderRadius: 5,
    //           formatter: datalabelsFormatterPieGlobalPercentage
    //         }
    //       },
    //       getDataValue: function(context, datasetIndex, value) {
    //         let sum = 0;
            
    //         let data = context.chart.data.datasets[datasetIndex].data;
    //         let legends = context.chart.legend.legendItems;

    //         for (let index = 0; index < data.length; index++) {
    //             if (!legends[index]?.hidden) {
    //                 sum += Math.abs(data[index]);
    //             }
    //         }

    //         console.log('sum', sum)
    //         return sum > 0 ? Math.abs(value) * 100 / sum : 0;
    //     },
    //       animation: false
    //     }
    //   };
    
    let ChartData = {
        plugins: [],
        data: {
          labels: ["a"],
          datasets: [
            {
              label: 'pog',
              data: [ [10,0], [-10,6], [6,5] ],
            }
          ]
        },
        type: 'bar',
        options: {
          responsive: true,
          borderWidth: 0,
          plugins: {
          },
          animation: false
        }
      };

    const chart = new Chart(ctx, ChartData);


    const b64 = chart.toBase64Image();
    const img = Buffer.from(b64.split(',')[1], 'base64');

    
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    
    res.end(img);
}

function RequestDataToChartData(reqdata = {}) {
    console.log("RequestDataToChartData", util.inspect(reqdata, false, null, true));

    let chartdata = {
        type: reqdata.type ?? 'pie',
        EnableChartDataLabels: reqdata.EnableChartDataLabels ?? false,
        EnableEmptyDoughnut: reqdata.EnableEmptyDoughnut ?? false,
        size: {
            width: reqdata.size?.width ?? 512,
            height: reqdata.size?.height ?? 512,
        },
        data: {
            labels: reqdata.values?.map(e => e.name ?? 'N/A'),
            datasets: [{
                data: reqdata.values?.map(e => e.value ?? 0),
                backgroundColor: reqdata.values?.map(e => e.color ?? RandomHexadecimalColor()),
            }],
        },
        options: reqdata.options ?? {}
    }

    return chartdata
}


const GraphDataMaps = new Map();


async function CreateGraph(req, res, next) {
    if (Object.keys(req.body.data ?? {}).length < 1) res.status(204).json({ message: "empty data" });
    
    
    console.log("CreateGraph", util.inspect(req.body, false, null, true));

    let data = RequestDataToChartData(req.body.data ?? {});


    let uuid = uuidv4();
    
    await Manager.chart.create({uuid, ...data});
    GraphDataMaps.set(uuid, data);

    res.status(200).json({ uuid });
}

const datalabelsFormatterPieGlobalPercentage = (value, context) => {
    let percentage = context.chart.config.options.getDataValue(context, context.datasetIndex, value);

    const { datasets } = context.chart.data;
    let hasData = false;

    for (let i = 0; i < datasets.length; i += 1) {
        hasData |= datasets[i].data.reduce((acc,cu) => acc + Math.abs(cu), 0) > 0;
    }

    if (!hasData || Math.abs(value) <= 0) return null;
    return `${percentage.toFixed(2)}%`;
};

async function DisplayGraph(req, res, next) {
    let uuid = req.params.uuid;


    let data = GraphDataMaps.get(uuid);

    // Load from bdd
    if (!data && (await Manager.chart.exist(uuid))) {
        data = await Manager.chart.get(uuid);
        GraphDataMaps.set(uuid, data);
    }

    if (!data) {
        return res.status(404).json({ error: "image not found." });
    }

    console.log(util.inspect(data, false, null, true));

    data.plugins = [];
    if (data.EnableChartDataLabels) {
        data.plugins.push(ChartDataLabels);

        if (data.type == "pie") {
            data.options.getDataValue = function(context, datasetIndex, value) {
                let sum = 0;
                
                let data = context.chart.data.datasets[datasetIndex].data;
                let legends = context.chart.legend.legendItems;
                
                for (let index = 0; index < data.length; index++) {
                    if (!legends[index]?.hidden) {
                        sum += Math.abs(data[index]);
                    }
                }
                
                console.log('sum', sum)
                return sum > 0 ? Math.abs(value) * 100 / sum : 0;
            };
            
            data.options.plugins.datalabels.formatter = datalabelsFormatterPieGlobalPercentage;
        }
    }
    if (data.EnableEmptyDoughnut) data.plugins.push(PluginEmptyDoughnut);
    
    console.log(util.inspect(data, false, null, true));

    // Generate IMG
    let canvas = createCanvas(data.size.width, data.size.height);
    console.log(canvas)
    let ctx = canvas.getContext('2d');

    const chart = new Chart(ctx, data);

    const b64 = chart.toBase64Image();
    const img = Buffer.from(b64.split(',')[1], 'base64');

    
    res.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    
    res.end(img);
}

module.exports = {
    HelloWorld, RandomGraph,
    CreateGraph, DisplayGraph,
}