const { registrarIntentoFallido, iniciarSesion, validarCorreo, revisarCamposVacios, calcularMinutosRestantes, MINUTOS_BLOQUEO } = require('../../src/bloqueoCuenta');

// CP-05: en el 5.º intento fallido la cuenta se bloquea por 15 minutos
test('CP-05: al 5.º intento fallido la cuenta queda bloqueada 15 minutos', function () {
  const cuenta = { intentosFallidos: 4, cuentaBloqueada: false, bloqueadaHasta: 0 };
  const ahora = 100; // minuto 100, un número cualquiera

  registrarIntentoFallido(cuenta, ahora);

  expect(cuenta.cuentaBloqueada).toBe(true);
  expect(cuenta.bloqueadaHasta - ahora).toBeCloseTo(MINUTOS_BLOQUEO);
});

// CP-01: sin intentos fallidos y datos correctos, entra
test('CP-01: con 0 intentos fallidos y credenciales correctas deja ingresar', function () {
  const cuenta = { correo: 'pepe@gmail.com', contrasena: 'Clave123', intentosFallidos: 0, cuentaBloqueada: false, bloqueadaHasta: 0 };

  const resultado = iniciarSesion(cuenta, 'pepe@gmail.com', 'Clave123', 100);

  expect(resultado.acceso).toBe(true);
});

// CP-02: con 4 fallos todavía no está bloqueada, así que entra
test('CP-02: con 4 intentos fallidos y credenciales correctas deja ingresar', function () {
  const cuenta = { correo: 'pepe@gmail.com', contrasena: 'Clave123', intentosFallidos: 4, cuentaBloqueada: false, bloqueadaHasta: 0 };

  const resultado = iniciarSesion(cuenta, 'pepe@gmail.com', 'Clave123', 100);

  expect(resultado.acceso).toBe(true);
  expect(cuenta.intentosFallidos).toBe(0);
});

// CP-04: un correo sin @ es un parámetro erróneo
test('CP-04: el correo "Pepegmail.com" no es válido porque no tiene @', function () {
  const correoValido = validarCorreo('Pepegmail.com');

  expect(correoValido).toBe(false);
});

// CP-06: si los campos están vacíos hay que marcar cuáles faltan
test('CP-06: con correo y contraseña vacíos marca los dos campos por rellenar', function () {
  const camposVacios = revisarCamposVacios('', '');

  expect(camposVacios).toEqual(['correo', 'contrasena']);
});

// CP-03: la cuenta bloqueada tiene que decir cuánto le falta
test('CP-03: una cuenta bloqueada hasta el minuto 110 en el minuto 100 le faltan 10 minutos', function () {
  const cuenta = { correo: 'pepe@gmail.com', contrasena: 'Clave123', intentosFallidos: 5, cuentaBloqueada: true, bloqueadaHasta: 110 };

  const minutosRestantes = calcularMinutosRestantes(cuenta, 100);

  expect(minutosRestantes).toBe(10);
});
