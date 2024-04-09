var resultado;

function CalcularZonaPoblacional(Pire, Frecuencia) {
  if (Frecuencia >= 30 && Frecuencia <= 400) {
    resultado = 0.319 * Math.sqrt(Pire);
  } else if (Frecuencia >= 400 && Frecuencia <= 2000) {
    resultado = 6.38 * (Math.sqrt(Pire) / Frecuencia);
  } else if (Frecuencia >= 2000 && Frecuencia <= 300000) {
    resultado = 0.143 * Math.sqrt(Pire);
  }

  return resultado;
}

module.exports = CalcularZonaPoblacional;
