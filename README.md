# Temperature Map Visualization

This project is a web-based application that visualizes temperature data on a world map. Users can select a specific date, choose the variable they want to visualize, and convert the temperature units between Kelvin, Celsius, and Fahrenheit. The application also includes a contour plot and a time series graph for deeper analysis.

## Features

- **Interactive Temperature Map**: Visualize temperature data for any selected date.
- **Unit Conversion**: Convert temperature data between Kelvin, Celsius, and Fahrenheit.
- **Contour Plot**: Generate a world contour plot of temperature data.
- **Time Series Graph**: View temperature trends over time for a selected location on the map.

## Usage

### Prerequisites

- A modern web browser that supports JavaScript and HTML5.
- The `data.json` file containing temperature data.

### Instructions

1. **Select a Date**: Use the date picker to select the date for which you want to view temperature data.
2. **Choose a Variable**: Select the variable you want to visualize from the dropdown menu. By default, temperature (`ta`) is selected.
3. **Select a Unit**: Choose the temperature unit (Kelvin, Celsius, or Fahrenheit) from the dropdown menu.
4. **Update Map**: Click the "Update Map" button to generate the temperature map based on your selections.
5. **Interactive Map**: Click on any point on the map to view a time series graph of the temperature data for that location.
6. **View Contour Plot**: A contour plot of the temperature data will be displayed below the map.

### Data Format

The `data.json` file should be structured as follows:

```json
{
    "locations": [
        {
            "lat": 34.05,
            "lon": -118.25,
            "ta": {
                "2024-09-01": 293.15,
                "2024-09-02": 294.15,
                ...
            }
        },
        ...
    ]
}
