var distancia;
var hb;
function CalculoDistancia(potencia, distancia, frecuencia) {
  if (potencia <= 10 && distancia >= 2.2) {
    console.log(
      "Estación base instalada de manera que la parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.2 metros por encima del piso de la zona de público en general."
    );
    return 1;
  } else if (potencia <= 100 && distancia >= 2.5) {
    console.log(
      "La parte más baja del sistema irradiante (antena(s)) está a una altura mínima de 2.5 metros por encima del piso de la zona de público en general."
    );
    return 2;
  } else {
    console.log("Necesita medicion");
    if (frecuencia >= 30 && frecuencia <= 400) {
      distancia = Math.sqrt(potencia / (4 * 3.14 * 2));
    } else if (frecuencia >= 400 && frecuencia <= 2000) {
      distancia = Math.sqrt(potencia / (4 * 3.14 * (frecuencia / 200)));
    } else if (frecuencia >= 2000 && frecuencia <= 300000) {
      distancia = Math.sqrt(potencia / (4 * 3.14 * 10));
    }
    hb = distancia * Math.tan(3.14 / 15);
    if (hb <= 3.5) {
      hb = 3.5;
    }
    console.log(hb);
    return hb;
  }
}

module.exports = CalculoDistancia;
