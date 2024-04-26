const { Chart, ChartDataLabels, PluginEmptyDoughnut } = require('../../functions/chart');
const { createCanvas, loadImage } = require('canvas');
const { getRandomRangeRound, getRandomRangeFloor } = require('../../functions/random');

const { colorNameToHex, getRandomNamedColor, parseBoolean } = require('../../functions/misc');

// no-store
// public, max-age=86400

function DisplayGraph(req, res, next) {
    // Parsing Settings
    let type = (req.params.type ?? 'pie').toLowerCase();

    let _pickedColors = [];
    let entries = (req.query.entries ?? '').split(';').filter(e => e).map((e,i) => {
        let cnv = e.split(':');
        if (cnv.length < 2) cnv.unshift( null );
        if (cnv.length < 3) cnv.unshift( getRandomNamedColor({ avoid:_pickedColors }) );

        let [color,name,value] = cnv;

        // Check Color
        let parsedColor = colorNameToHex(color) ?? (/#([\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})/gi ? color : getRandomNamedColor({ avoid:_pickedColors, parse: true}));
        let parsedName = name || 'Entry'+(i+1);
        let parsedValue = isNaN(value) ? 0 : Number(value);

        return [parsedColor, parsedName, parsedValue];
    });

    let [width, height] = ((arr) => (arr.length > 1 ? arr : [arr,arr].flat()).map(n => isNaN(n) ? 0 : Number(n)))((req.query.size ?? '512').split(/[;:,]/g));

    let enableChartDataLabels = parseBoolean(req.query.datalabels ?? null) ?? false;
    
    let responsive = parseBoolean(req.query.responsive ?? null) ?? true;

    let plugins = [];
    if (type == 'pie') plugins.push(PluginEmptyDoughnut);
    if (enableChartDataLabels) plugins.push(ChartDataLabels);

    let borderWidth = req.query.borderWidth ?? 1;
    let borderColor = req.query.borderColor ?? 'black';

    let padding = req.query.padding ?? 0;
    
    let datalabelFormat    = req.query.datalabelFormat    ?? '$value';
    let datalabelTextAlign = req.query.datalabelTextAlign ?? 'center';
    let datalabelAlign     = req.query.datalabelAlign     ?? 'center';
    let datalabelOverlap   = parseBoolean(req.query.datalabelOverlap ?? null) ?? false;

    let datalabelPadding        = req.query.datalabelPadding ?? 4;
    let datalabelPaddingTop     = req.query.datalabelPaddingTop    ?? datalabelPadding;
    let datalabelPaddingBottom  = req.query.datalabelPaddingBottom ?? datalabelPadding;
    let datalabelPaddingRight   = req.query.datalabelPaddingRight  ?? datalabelPadding;
    let datalabelPaddingLeft    = req.query.datalabelPaddingLeft   ?? datalabelPadding;

    let legendDisplay = parseBoolean(req.query.legends ?? null) ?? true;
    let legendPosition = req.query.legendsPosition ?? 'top';


    let datalabelColor = req.query.datalabelColor ?? borderColor;
    let datalabelBackgroundColor = req.query.datalabelBackgroundColor ?? '#00000000';
    let datalabelBorderWidth  = req.query.datalabelBorderWidth  ?? 0;
    let datalabelBorderRadius = req.query.datalabelBorderRadius ?? 0;
    let datalabelBorderColor  = req.query.datalabelBorderColor  ?? 'black';
    
    let datalabelFontWeight  = req.query.datalabelFontWeight ?? '';
    let datalabelFontStyle   = req.query.datalabelFontStyle  ?? '';

    let datalabelClamp  = parseBoolean(req.query.datalabelClamp)  ?? true;
    let datalabelClip   = parseBoolean(req.query.datalabelClip)   ?? false;
    let datalabelAnchor = req.query.datalabelAnchor ?? 'center';

    const convertHexToRGB = function(hex) {
        let count = !(hex.match(/[\da-f]/gi).length % 4) ? 4 : 3;
        let [r,g,b,a] = hex.match(new RegExp(`[\\da-f]{${(hex.length-1)/count}}`,'gi')).map(c => parseInt(c.length < 2 ? c + c : c, 16));
        return (typeof a !== 'undefined') ? {r,g,b,a} : {r,g,b};
    }
    function colorHighContrast(context, sLimit = 127) {
        let backgroundColor = context.chart.data.datasets[0].backgroundColor[context.dataIndex];
        let {r,g,b} = convertHexToRGB(backgroundColor);

        let limit = isNaN(sLimit) ? 0 : Number(sLimit);

        let color = Math.round((r + g + b) / 3);
        return (color > limit) ? 'black' : 'white';
    }
    function colorSmoothContrast(context) {
        let backgroundColor = context.chart.data.datasets[0].backgroundColor[context.dataIndex];
        let {r,g,b} = convertHexToRGB(backgroundColor);

        let color = Math.round((r * 299) + (g * 587) + (b * 114) / 1000);
        return '#' + Number(255 - Math.round(color * 255 / 225959)).toString(16).repeat(3);
    }

    function datalabelGetColor(context) {
        return context.chart.data.datasets[0].backgroundColor[context.dataIndex];
    }
    function datalabelGetDarkerColor(context, sFactor = 20) {
        let backgroundColor = context.chart.data.datasets[0].backgroundColor[context.dataIndex];
        let {r,g,b} = convertHexToRGB(backgroundColor);

        let factor = 1 - (isNaN(sFactor) ? 0 : Number(sFactor)) / 100;

        return '#' + [r,g,b].map(v => {
            if (v === 0) v += 10;
            let caped = Math.max(0, Math.min(Math.round(v * factor), 255));
            return caped.toString(16).padStart(2, '0');
        }).join('');
    }
    function datalabelGetBrighterColor(context, sFactor = 20) {
        let backgroundColor = context.chart.data.datasets[0].backgroundColor[context.dataIndex];
        let {r,g,b} = convertHexToRGB(backgroundColor);

        let factor = 1 + (isNaN(sFactor) ? 0 : Number(sFactor)) / 100;
        
        return '#' + [r,g,b].map(v => {
            if (v === 0) v += 10;
            let caped = Math.max(0, Math.min(Math.round(v * factor), 255));
            return caped.toString(16).padStart(2, '0');
        }).join('');
    }
    function datalabelGetReversedColor(context) {
        let backgroundColor = context.chart.data.datasets[0].backgroundColor[context.dataIndex];
        let {r,g,b} = convertHexToRGB(backgroundColor);

        return '#' + [r,g,b].map(v => {
            let caped = Math.max(0, Math.min(Math.round(255 - v), 255));
            return caped.toString(16).padStart(2, '0');
        }).join('');
    }

    function _getAutoColorMethods(method) {
        let [color, ...args] = method.split(':');
        if (color?.toLowerCase() === 'same')     return (context) => datalabelGetColor.call(this, context, ...args);
        if (color?.toLowerCase() === 'darker')   return (context) => datalabelGetDarkerColor.call(this, context, ...args);
        if (color?.toLowerCase() === 'brighter') return (context) => datalabelGetBrighterColor.call(this, context, ...args);
        if (color?.toLowerCase() === 'reverse') return (context) => datalabelGetReversedColor.call(this, context, ...args);
        if (color?.toLowerCase() === 'high')     return (context) => colorHighContrast.call(this, context, ...args);
        if (color?.toLowerCase() === 'smooth')   return (context) => colorSmoothContrast.call(this, context, ...args);
        return color;
    }

    function _getDatalabelBackgroundColor(color) {
        return _getAutoColorMethods(color);
    };

    function _getDatalabelColor(color) {
        return _getAutoColorMethods(color);
    };

    function _getBorderColor(color) {
        return _getAutoColorMethods(color);
    };


    console.log('');
    console.log(req.query);
    console.log('');
    // console.log(datalabelFormat);
    // console.log(width, height);
    // console.log(responsive, plugins);
    // console.log(type, entries);
    
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext('2d');

    let ChartData = {
        plugins, type,
        data: {
          labels: entries.map(([c,n,v]) => n),
          datasets: [
            {
              data: entries.map(([c,n,v]) => v),
              backgroundColor: entries.map(([c,n,v]) => c),
            }
          ]
        },
        options: {
            getTotalData: function(context, datasetIndex) {
                let sum = 0;
                
                let data = context.chart.data.datasets[datasetIndex].data;
                let legends = context.chart.legend.legendItems;

                for (let index = 0; index < data.length; index++) {
                    if (!legends[index].hidden) {
                        sum += data[index];
                    }
                }

                return sum;
            },
            layout: {
                padding
            },
            responsive,
            borderWidth,
            borderColor,
            plugins: {
                legend: {
                    display: legendDisplay,
                    position: legendPosition,
                },
                datalabels: {
                    format: datalabelFormat,
                    textAlign: datalabelTextAlign,
                    align: datalabelAlign,
                    overlap: datalabelOverlap,

                    padding: {
                        top: datalabelPaddingTop,
                        bottom: datalabelPaddingBottom,
                        right: datalabelPaddingRight,
                        left: datalabelPaddingLeft,
                    },

                    backgroundColor: _getDatalabelBackgroundColor(datalabelBackgroundColor),
                    color: _getDatalabelColor(datalabelColor),
                    borderColor: _getBorderColor(datalabelBorderColor),
                    borderWidth: datalabelBorderWidth,
                    borderRadius: datalabelBorderRadius,
                    font: {
                        weight: datalabelFontWeight,
                        style: datalabelFontStyle,
                    },

                    rotation: function(context) {
                        // console.log(context)

                        return 0;
                    },

                    // offset: 10,
                    clamp: datalabelClamp,
                    clip: datalabelClip,
                    anchor: datalabelAnchor,
                    formatter: function(value, context) {
                        let total = context.chart.config.options.getTotalData(context, context.datasetIndex);
                        let percent = value * 100 / total;
                        let label = context.chart.data.labels[context.dataIndex];
                        let format = context.chart.config._config.options.plugins.datalabels.format ?? '$value';
                        
                        let values = {
                            value, total, percent, label,
                            v: value, t: total, p: percent, l: label
                        };
                        let formating = {
                            round: (v, p = 0) => Math.round(v * Math.pow(10, p)) / Math.pow(10, p),
                            floor: (v, p = 0) => Math.floor(v * Math.pow(10, p)) / Math.pow(10, p),
                            ceil : (v, p = 0) => Math.ceil(v * Math.pow(10, p)) / Math.pow(10, p),
                            fixed: (v, l = 2) => v.toFixed(l),
                        };
                        // Fn Shortcuts
                        formating['r'] = formating['round']; formating['f'] = formating['floor']; formating['c'] = formating['ceil']; formating['fx'] = formating['fixed'];

                        return format.replace(/\$(v(alue)?|t(otal)?|p(ercent)?|l(abel)?)(:f(ixed|x)|:r(ound)?|:f(loor)?|:c(eil)?)?(:[0-9]+)*/gi, (m) => {
                            let [v, n, ...z] = m.slice(1).split(':');
                            if (!n || !formating[n]) return values[v];
                            
                            let f = formating[n?.toLowerCase()];

                            return typeof f !== 'undefined' ? values[v.toLowerCase()] === label ? label : typeof f === 'function' ? f.call(this, values[v], ...z) : m : m;
                        });
                    }
                }
            },
            animation: false
        }
    };

    const chart = new Chart(ctx, ChartData);


    const b64 = chart.toBase64Image();
    const img = Buffer.from(b64.split(',')[1], 'base64');

    
    res.writeHead(200, {
        'Cache-Control': 'public, max-age=86400',
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    
    res.end(img);
}


module.exports = { DisplayGraph }