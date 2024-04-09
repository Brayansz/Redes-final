// grafico.js

const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");
const Chart = require("chart.js");

// Función para generar el gráfico de burbujas
async function generarGraficoBurbujas(labels, data, outputPath) {
  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            generateLabels: function (chart) {
              // Get the default label list
              const original =
                Chart.overrides.pie.plugins.legend.labels.generateLabels;
              const labelsOriginal = original.call(this, chart);

              // Build an array of colors used in the datasets of the chart
              let datasetColors = chart.data.datasets.map(function (e) {
                return e.backgroundColor;
              });
              datasetColors = datasetColors.flat();

              // Modify the color and hide state of each label
              labelsOriginal.forEach((label) => {
                // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                label.datasetIndex = (label.index - (label.index % 2)) / 2;

                // The hidden state must match the dataset's hidden state
                label.hidden = !chart.isDatasetVisible(label.datasetIndex);

                // Change the color to match the dataset
                label.fillStyle = datasetColors[label.index];
              });

              return labelsOriginal;
            },
          },
          onClick: function (mouseEvent, legendItem, legend) {
            // toggle the visibility of the dataset from what it currently is
            legend.chart.getDatasetMeta(legendItem.datasetIndex).hidden =
              legend.chart.isDatasetVisible(legendItem.datasetIndex);
            legend.chart.update();
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const labelIndex = context.datasetIndex * 2 + context.dataIndex;
              return (
                context.chart.data.labels[labelIndex] +
                ": " +
                context.formattedValue
              );
            },
          },
        },
      },
    },
  };

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });

  try {
    const image = await chartJSNodeCanvas.renderToBuffer(config);
    fs.writeFileSync(outputPath, image);
    console.log("Gráfico generado y guardado como", outputPath);
  } catch (error) {
    console.error("Error al generar el gráfico:", error);
  }
}

module.exports = generarGraficoBurbujas;
