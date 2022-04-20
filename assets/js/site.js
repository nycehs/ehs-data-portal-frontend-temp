// Constants used for both visualizations
const indicatorDataPath = "https://raw.githubusercontent.com/nychealth/EHDP-data/main/neighborhoodreports/data/"; //change this to alter the path to the data file
const indicatorMapPath  = "https://raw.githubusercontent.com/nychealth/EHDP-data/main/geography/"; //change this to alter the path to the data file


// Function and config used for summary data visualizations.
var summarySpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "width": "container",
  "height": "container",
  "autosize": "fit",
  "data": {"name": "summaryData"},
  "mark": {"type": "bar", "tooltip": true},
  "encoding": {
    "x": {
      "field": "neighborhood",
      "type": "nominal",
      "sort": {"op": "mean", "field": "data_value"},
      "axis":null
    },
    "y": {
      "field": "data_value",
      "type": "quantitative",
      "axis": {"title":null}
    },
    "color": {
      "condition": {
        "test": "datum.neighborhood=='Canarsie - Flatlands'",
        "value": "#1CA970"
      },
      "value": "#D8D8D8"
    }
  }
}
; //this is the template vega-lite json

function buildSummarySpec(neighborhood) {

  // make a copy of the vega-lite spec
  var temp = JSON.parse(JSON.stringify(summarySpec));
  
  // graft the neighborhood on to the specification for the color-coding
  temp.encoding.color.condition.test = "datum.neighborhood=='" + neighborhood + "'";
  
  // return the vega-lite spec
  return temp;
  
};

// Function and config used for trend data visualizations.

var trendSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "width": "container",
  "height": "container",
  "autosize": "fit",
  "data": {"url": indicatorDataPath + "poveACSP_trend.csv"},
  "layer":[{
    "mark": {"type": "line", "point": false, "tooltip": true},
    "encoding": {
      "x": {
        "field": "time",
        "type": "ordinal",
        "axis": {"title": null, "labelAngle": 45}
      },
      "y": {
        "field": "data_value",
        "type": "quantitative",
        "axis": {"title": null}
      },
      "detail": {
        "field": "neighborhood",
        "type":"nominal"
      },
      "color": {
        "value": "lightgrey"
      }
    }
  },{
    "mark": {"type": "line", "point": true, "tooltip": true},
    "encoding": {
      "x": {
        "field": "time",
        "type": "ordinal",
        "axis": {"title": null, "labelAngle": 45}
      },
      "y": {
        "field": "data_value",
        "type": "quantitative",
        "axis": {"title": null}
      },
      "detail": {
        "field": "neighborhood",
        "type": "nominal"
      },
      "color": {
        "condition": {
          "test": "datum.neighborhood=='Canarsie - Flatlands'",
          "value": "#1CA970"
        },
        "value": null
      }
    }
  }]
}
; //this is the template vega-lite json

// this function creates a trend spec from a template that is customized with the data and neighborhood
function buildTrendSpec(neighborhood, dataSlug) {
  
  // make a copy of the vega-lite spec
  var temp = JSON.parse(JSON.stringify(trendSpec));
  
  // graft the neighborhood on to the specification for the color-coding
  temp.layer[1].encoding.color.condition.test = "datum.neighborhood=='" + neighborhood + "'";
  
  // graft the data file path on to the specification for the indicator
  temp.data.url = indicatorDataPath + dataSlug + "_trend.csv"; //note the function needs access to the indicatorDataPath global var
  
  // return the vega-lite spec
  return temp;
  
};

// Function and config used for map visualization.

var mapSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "width": "container",
  "height": "container",
  "autosize": "fit",
  
  // switch data and transform
  
  "data": {
    "url": indicatorMapPath + "UHF42.topo.json",
    "format": {"type": "topojson", "feature": "collection"}
  },
  "transform": [
    {
      "lookup": "id",
      "from": {
        "data": {"url": indicatorDataPath + "bikeLanP.csv"},
        "key": "geo_join_id",
        "fields": ["data_value", "neighborhood", "message"]
      }
    }
  ],
  
  "layer":[
    {
      "mark": {"type": "geoshape", "tooltip": true},
      "encoding": {
        "color": {"field": "data_value", "type": "quantitative",
        "scale": {"scheme": "greens"},
        "legend": {"orient": "top-left", "title": null}
      },
      "stroke": {"value": "white" },
      "strokeWidth":{"value":1},
      "tooltip":[
        {"field":"neighborhood","type":"nominal"},
        {"field":"data_value","type":"quantitative"}
      ]
    }},
    {  "mark": {"type": "geoshape"},
    "encoding": {
      "color":{"value":null},
      "stroke": {
        "condition": {
          "test": "datum.neighborhood=='Bedford Stuyvesant - Crown Heights'",
          "value": "#000000"
        }
      },
      "strokeWidth": {"value": 3}
    }}]
  }
  ;
  
  // this function creates a summary spec from a template that is customized with the data and neighborhood
  function buildMapSpec(neighborhood, dataSlug) {
    
    // make a copy of the vega-lite spec
    var temp = JSON.parse(JSON.stringify(mapSpec));
    
    // graft the neighborhood on to the specification for the color-coding
    temp.layer[1].encoding.stroke.condition.test = "datum.neighborhood=='" + neighborhood + "'";
    
    // graft the data file path on to the specification for the indicator
    temp.transform[0].from.data.url = indicatorDataPath + dataSlug + ".csv"; //note the function needs access to the indicatorDataPath global var
    
    // graft the data file path on to the specification for the indicator
    temp.data.url = indicatorMapPath + "UHF42.topo.json"; //note the function needs access to the indicatorDataPath global var
    
    // return the vega-lite spec
    return temp;
    
  };