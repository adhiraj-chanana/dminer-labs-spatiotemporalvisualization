let jsonData;

// Fetch JSON data from external file
fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
        jsonData = data;
        updateMap(); // Initial map update
    })
    .catch((error) => console.error("Error loading JSON data:", error));

function updateMap() {
    const selectedDate = document.getElementById("dateInput").value;
    const selectedVariable = document.getElementById("variableSelect").value;
    const selectedUnit = document.getElementById("unitSelect").value;

    if (!selectedDate) {
        // alert("Please select a date.");
        return;
    }

    if (!jsonData) {
        alert("Data not loaded yet.");
        return;
    }

    const tempData = jsonData.locations.map((location) => {
        let temp = location[selectedVariable][selectedDate];
        if (temp !== null) {
            if (selectedUnit === "celsius") {
                temp = temp - 273.15;
            } else if (selectedUnit === "fahrenheit") {
                temp = ((temp - 273.15) * 9) / 5 + 32;
            }
        }
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
                title: `Temperature (${
                    selectedUnit === "kelvin"
                        ? "K"
                        : selectedUnit === "celsius"
                        ? "°C"
                        : "°F"
                })`,
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
        plotContourPlot(filteredData, selectedUnit); // Always plot contour plot
        document.getElementById("map").on("plotly_click", function (data) {
            const point = data.points[0];
            const locationData = filteredData.find(
                (d) => d.lat === point.lat && d.lon === point.lon
            ).locationData;
            const lat = point.lat.toFixed(2);
            const lon = point.lon.toFixed(2);
            document.getElementById(
                "timeseries-heading"
            ).innerText = `Displaying the temperature of latitude ${lat} and longitude ${lon}`;
            plotTimeseriesGraph(locationData, selectedDate, selectedUnit);
        });
    });
}

function plotTimeseriesGraph(locationData, selectedDate, selectedUnit) {
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

    const temperatures = filteredDates.map((date) => {
        let temp = locationData[date];
        if (selectedUnit === "celsius") {
            temp = temp - 273.15;
        } else if (selectedUnit === "fahrenheit") {
            temp = ((temp - 273.15) * 9) / 5 + 32;
        }
        return temp;
    });

    const timeSeriesTrace = {
        type: "scatter",
        mode: "lines+markers",
        x: filteredDates,
        y: temperatures,
        line: { color: "#007bff" },
        marker: { size: 8 },
    };

    const timeSeriesLayout = {
        title: `Temperature Time Series for Latitude and Longitude on ${selectedDate}`,
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
            title: `Temperature (${
                selectedUnit === "kelvin"
                    ? "K"
                    : selectedUnit === "celsius"
                    ? "°C"
                    : "°F"
            })`,
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

function plotContourPlot(filteredData, selectedUnit) {
    const lats = filteredData.map((d) => d.lat);
    const lons = filteredData.map((d) => d.lon);
    const temps = filteredData.map((d) => d.temp);

    const trace = {
        type: "contour",
        z: temps,
        x: lons,
        y: lats,
        colorscale: [
            [0, "blue"],
            [0.5, "lime"],
            [0.75, "yellow"],
            [1, "red"],
        ],
        colorbar: {
            title: `Temperature (${
                selectedUnit === "kelvin"
                    ? "K"
                    : selectedUnit === "celsius"
                    ? "°C"
                    : "°F"
            })`,
            tickvals: [Math.min(...temps), Math.max(...temps)],
            ticktext: [
                `${Math.min(...temps).toFixed(1)} ${selectedUnit}`,
                `${Math.max(...temps).toFixed(1)} ${selectedUnit}`,
            ],
        },
    };

    const layout = {
        title: "Contour Plot of Temperature",
        xaxis: {
            title: "Longitude",
            titlefont: {
                size: 16,
                color: "#ffffff",
            },
            tickfont: {
                size: 14,
                color: "#ffffff",
            },
        },
        yaxis: {
            title: "Latitude",
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

    Plotly.newPlot("contour", [trace], layout);
}

function updateUnitOptions() {
    const selectedVariable = document.getElementById("variableSelect").value;
    const unitSelect = document.getElementById("unitSelect");
    if (selectedVariable === "ta") {
        unitSelect.style.display = "inline";
    } else {
        unitSelect.style.display = "none";
    }
}
