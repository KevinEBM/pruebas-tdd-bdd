// reglas del escenario C
const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;

// "ahora" es un número en minutos, así puedo controlar el tiempo en las pruebas
function registrarIntentoFallido(cuenta, ahora) {
  cuenta.intentosFallidos = cuenta.intentosFallidos + 1;

  if (cuenta.intentosFallidos >= MAX_INTENTOS) {
    cuenta.cuentaBloqueada = true;
    cuenta.bloqueadaHasta = ahora + MINUTOS_BLOQUEO;
  }

  return cuenta;
}

function iniciarSesion(cuenta, correo, contrasena, ahora) {
  // si está bloqueada no importa el dispositivo, se niega el acceso
  if (cuenta.cuentaBloqueada && ahora < cuenta.bloqueadaHasta) {
    const minutosRestantes = calcularMinutosRestantes(cuenta, ahora);
    return {
      acceso: false,
      mensaje: 'Cuenta bloqueada. Faltan ' + minutosRestantes + ' minutos',
      minutosRestantes: minutosRestantes
    };
  }

  // primero reviso que no haya campos vacíos
  const camposPorRellenar = revisarCamposVacios(correo, contrasena);
  if (camposPorRellenar.length > 0) {
    return {
      acceso: false,
      mensaje: 'Faltan campos por rellenar: ' + camposPorRellenar.join(', '),
      camposPorRellenar: camposPorRellenar
    };
  }

  // si el correo no tiene @ ni lo cuento como intento, es un dato mal escrito
  if (!validarCorreo(correo)) {
    return { acceso: false, mensaje: 'Parámetro erróneo: el correo debe tener @' };
  }

  const datosCorrectos = correo === cuenta.correo && contrasena === cuenta.contrasena;

  if (datosCorrectos) {
    // si entra bien, se reinician los intentos
    cuenta.intentosFallidos = 0;
    cuenta.cuentaBloqueada = false;
    return { acceso: true, mensaje: 'Bienvenido' };
  } else {
    registrarIntentoFallido(cuenta, ahora);
    if (cuenta.cuentaBloqueada) {
      return {
        acceso: false,
        mensaje: 'Llegaste al máximo de intentos. Cuenta bloqueada por ' + MINUTOS_BLOQUEO + ' minutos'
      };
    }
    return { acceso: false, mensaje: 'Correo o contraseña incorrectos' };
  }
}

function validarCorreo(correo) {
  if (correo.includes('@')) {
    return true;
  } else {
    return false;
  }
}

function revisarCamposVacios(correo, contrasena) {
  const camposPorRellenar = [];
  if (correo === '') {
    camposPorRellenar.push('correo');
  }
  if (contrasena === '') {
    camposPorRellenar.push('contrasena');
  }
  return camposPorRellenar;
}

function calcularMinutosRestantes(cuenta, ahora) {
  return cuenta.bloqueadaHasta - ahora;
}

module.exports = { registrarIntentoFallido, iniciarSesion, validarCorreo, revisarCamposVacios, calcularMinutosRestantes, MAX_INTENTOS, MINUTOS_BLOQUEO };
