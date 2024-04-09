const calcularPIRE = require("./Model/calculos.js");
const calcularDistancia = require("./Model/Distancia.js");
const calcularDistanciaOcupacional = require("./Model/DistanciaOcupacional.js");
const calcularDistanciaPoblacional = require("./Model/Distanciapoblacional.js");
const generarGraficoBurbujas = require("./Model/grafico.js");
const CalculaD = require("./Model/calculaD.js");
const { Client } = require("pg");
const express = require("express");
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
const fs = require("fs");
const path = require("path");
const Chart = require("chart.js");

// Configurar Express para usar EJS como motor de plantillas
app.set("view engine", "ejs");

// Configurar las rutas
app.get("/", (req, res) => {
  res.render("vista");
});
app.set("views", path.join(__dirname, "views"));

const config = require("./Model/conexion.js");
const client = new Client(config);
client
  .connect()
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.error("Error de conexión:", err));

// Ruta para servir la página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };
// Ruta para generar el gráfico de burbujas y servirlo
app.get("/grafico", async (req, res) => {
  const labels = ["A", "B", "C"]; // Ejemplo de etiquetas
  const data = {
    labels: ["Rebasamiento", "Ocupacional", "Poblacional"],
    datasets: [
      {
        backgroundColor: ["#38C200", "#38C200"],
        data: [20, 1000],
      },
      {
        backgroundColor: ["#FFC100", "#FFC100"],
        data: [30, 70],
      },
      {
        backgroundColor: ["#FF2D00", "#FF2D00"],
        data: [20, 80],
      },
    ],
  };
  const outputPath = path.join(__dirname, "output.png"); // Ruta de salida del gráfico

  await generarGraficoBurbujas(labels, data, outputPath);

  res.sendFile(outputPath);
});

app.post("/calcular", (req, res) => {
  let resultado = 0;
  let resultadodistancia = 0;
  let altura1 = 0;
  let rocupa = 0;
  let rpobla = 0;
  let resultadodistanciapobla = 0;
  let resultadodistanciaocupa = 0;
  var calculodeDocupa = 0;
  var calculodeDpobla = 0;
  var potencia = parseFloat(req.body.potencia);
  var ganancia = parseFloat(req.body.ganancia);
  var frecuencia = parseFloat(req.body.frecuencia);
  var altura = parseFloat(req.body.altura);
  var select = req.body.opciones;
  ////////////////////////////////////////////////////////

  resultado = calcularPIRE(potencia, ganancia);
  ////////////////////////////////////////////////////////
  resultadodistancia = calcularDistancia(resultado, altura, frecuencia);
  ////////////////////////////////////////////////////////

  altura1 = altura;
  if (resultadodistancia == 1) {
    altura1 = altura - 2;
  } else if (resultadodistancia == 2) {
    altura1 = altura - 2;
  } else if (resultadodistancia > altura1 - 2) {
    altura1 = resultadodistancia;
  } else if (resultadodistancia < altura1 - 2) {
    altura1 = altura1 = altura - 2;
  }

  resultadodistanciaocupa = calcularDistanciaOcupacional(resultado, frecuencia);

  resultadodistanciapobla = calcularDistanciaPoblacional(resultado, frecuencia);

  calculodeDocupa = CalculaD(resultadodistanciaocupa, altura1);
  calculodeDpobla = CalculaD(resultadodistanciapobla, altura1);

  /////////////////////////////////////////////////////////////////////////
  if (select == "Antena AM") {
    rocupa = "Necesita medicion debido a que es antena AM";
  } else if (resultadodistanciaocupa <= altura1 || calculodeDocupa < 0) {
    rocupa = "No necesita medición";
  } else {
    rocupa = "Necesita medicion";
  }

  if (select == "Antena AM") {
    rpobla = "Necesita medicion debido a que es antena AM";
  } else if (resultadodistanciapobla <= altura1 || calculodeDpobla < 0) {
    rpobla = "No necesita medición";
  } else {
    rpobla = "Necesita medicion";
  }

  console.log("r " + resultadodistanciaocupa);
  console.log("r " + resultadodistanciapobla);
  console.log("a " + altura1);
  /////////////////////////////////////////////////////////////////////////
  res.render("resultados", {
    resultadodistanciaocupa: rocupa,
    resultadodistanciapobla: rpobla,
  });
});

app.get("/resultados", (req, res) => {
  app.get("/resultados", (req, res) => {
    res.render("resultados"); // Renderizar resultados.ejs desde la carpeta views
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
