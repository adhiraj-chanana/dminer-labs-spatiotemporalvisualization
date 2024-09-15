let jsonData;

// Global variables for the parameters
let model = null;
let variable = null;

const modelSelect = document.getElementById("model");
const variableSelect = document.getElementById("variable");

// Fetch JSON data from external file
fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
        jsonData = data;
        updateMap(); // Initial map update
    })
    .catch((error) => console.error("Error loading JSON data:", error));

function updateParameters() {
    // Updates parameter whenever an onchange is event is detected
    model = modelSelect.value;
    variable = variableSelect.value;
    updateMap();
}

function updateMap() {
    if (!jsonData) {
        alert("Data not loaded yet.");
        return;
    }

    // The user hasn't chosen anything yet
    if (!model || !variable) {
        return;
    }

    const tempData = jsonData.locations.map((location) => {
        let temp = location[selectedVariable][selectedDate];
        return {
            lat: location.lat,
            lon: location.lon,
            temp: temp !== null ? temp : null,
            locationData: location[selectedVariable], // Store full location data
        };
    });

    const filteredData = tempData.filter((d) => d.temp !== null);
    const mapTrace = {
        type: "scattergeo",
        mode: "markers",
        lat: filteredData.map((d) => d.lat),
        lon: filteredData.map((d) => d.lon),
        marker: {
            size: 10,
            color: filteredData.map((d) => d.temp),
            colorscale: [
                [0, "blue"],
                [0.5, "lime"],
                [0.75, "yellow"],
                [1, "red"],
            ],
            cmin: Math.min(...filteredData.map((d) => d.temp)),
            cmax: Math.max(...filteredData.map((d) => d.temp)),
            colorbar: {
                title: `Temperature K`,
                tickvals: [
                    Math.min(...filteredData.map((d) => d.temp)),
                    Math.max(...filteredData.map((d) => d.temp)),
                ],
                ticktext: [
                    `${Math.min(...filteredData.map((d) => d.temp)).toFixed(
                        1
                    )} ${selectedUnit}`,
                    `${Math.max(...filteredData.map((d) => d.temp)).toFixed(
                        1
                    )} ${selectedUnit}`,
                ],
            },
        },
        text: filteredData.map((d) => d.temp.toFixed(2)),
        hoverinfo: "text+lat+lon",
    };

    const mapLayout = {
        title: `Temperature Map on ${selectedDate}`,
        geo: {
            projection: { type: "natural earth" },
            showland: true,
            landcolor: "#e0e0e0",
            bgcolor: "#1e1e1e",
        },
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" },
    };

    Plotly.newPlot("map", [mapTrace], mapLayout).then(function () {
        document.getElementById("map").on("plotly_click", function (data) {
            const point = data.points[0];
            const locationData = filteredData.find(
                (d) => d.lat === point.lat && d.lon === point.lon
            ).locationData;
            const lat = point.lat.toFixed(2);
            const lon = point.lon.toFixed(2);
            plotTimeseriesGraph(locationData, selectedDate, selectedUnit, [
                lat,
                lon,
            ]);
        });
    });
}

function plotTimeseriesGraph(locationData, selectedDate, coord) {
    document.getElementById("timeseries-heading").style.display = "block";
    const dates = Object.keys(locationData)
        .filter((date) => date !== "")
        .sort();
    const selectedDateObj = new Date(selectedDate);
    const firstOfMonth = new Date(
        selectedDateObj.getFullYear(),
        selectedDateObj.getMonth(),
        1
    );
    const filteredDates = dates.filter(
        (date) =>
            new Date(date) >= firstOfMonth && new Date(date) <= selectedDateObj
    );

    const timeSeriesTrace = {
        type: "scatter",
        mode: "lines+markers",
        x: filteredDates,
        y: temperatures,
        line: { color: "#007bff" },
        marker: { size: 8 },
    };

    const timeSeriesLayout = {
        title: `Temperature Time Series for lat: ${coord[0]} long: ${coord[1]} on ${selectedDate}`,
        xaxis: {
            title: "Date",
            titlefont: {
                size: 16,
                color: "#ffffff",
            },
            tickfont: {
                size: 14,
                color: "#ffffff",
            },
            tickangle: -45,
        },
        yaxis: {
            title: `Temperature K`,
            titlefont: {
                size: 16,
                color: "#ffffff",
            },
            tickfont: {
                size: 14,
                color: "#ffffff",
            },
        },
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#ffffff" },
    };

    Plotly.newPlot("timeseries", [timeSeriesTrace], timeSeriesLayout);
}
