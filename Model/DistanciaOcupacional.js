var resultado;

function CalcularZonaOcupacional(Pire, Frecuencia) {
  if (Frecuencia >= 30 && Frecuencia <= 400) {
    resultado = 0.143 * Math.sqrt(Pire);
  } else if (Frecuencia >= 400 && Frecuencia <= 2000) {
    resultado = 2.92 * (Math.sqrt(Pire) / Frecuencia);
  } else if (Frecuencia >= 2000 && Frecuencia <= 300000) {
    resultado = 0.0638 * Math.sqrt(Pire);
  }

  return resultado;
}

module.exports = CalcularZonaOcupacional;
