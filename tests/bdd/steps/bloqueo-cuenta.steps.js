const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert');
const { iniciarSesion } = require('../../../src/bloqueoCuenta');

// uso "this" para pasar la cuenta y el resultado de un paso a otro
// ojo: con funciones normales, porque con flecha "this" no funciona

Given('una cuenta {string} con contraseña {string} y {int} intentos fallidos', function (correo, contrasena, intentos) {
  this.ahora = 100;
  this.cuenta = {
    correo: correo,
    contrasena: contrasena,
    intentosFallidos: intentos,
    cuentaBloqueada: false,
    bloqueadaHasta: 0
  };
});

Given('una cuenta {string} con contraseña {string} bloqueada por {int} minutos más', function (correo, contrasena, minutos) {
  this.ahora = 100;
  this.cuenta = {
    correo: correo,
    contrasena: contrasena,
    intentosFallidos: 5,
    cuentaBloqueada: true,
    bloqueadaHasta: this.ahora + minutos
  };
});

When('inicia sesión con correo {string} y contraseña {string}', function (correo, contrasena) {
  this.resultado = iniciarSesion(this.cuenta, correo, contrasena, this.ahora);
});

When('inicia sesión con correo {string} y contraseña {string} desde otro dispositivo', function (correo, contrasena) {
  // otro dispositivo pero la misma cuenta, así que es la misma llamada
  this.resultado = iniciarSesion(this.cuenta, correo, contrasena, this.ahora);
});

Then('el sistema permite el acceso', function () {
  assert.strictEqual(this.resultado.acceso, true);
});

Then('el sistema niega el acceso', function () {
  assert.strictEqual(this.resultado.acceso, false);
});

Then('los intentos fallidos vuelven a {int}', function (intentos) {
  assert.strictEqual(this.cuenta.intentosFallidos, intentos);
});

Then('muestra que faltan {int} minutos de bloqueo', function (minutos) {
  assert.strictEqual(this.resultado.minutosRestantes, minutos);
  assert.ok(this.resultado.mensaje.includes(minutos + ' minutos'));
});

Then('muestra el mensaje {string}', function (mensaje) {
  assert.ok(this.resultado.mensaje.includes(mensaje));
});

Then('la cuenta queda bloqueada por {int} minutos', function (minutos) {
  assert.strictEqual(this.cuenta.cuentaBloqueada, true);
  assert.strictEqual(this.cuenta.bloqueadaHasta - this.ahora, minutos);
});

Then('marca los campos por rellenar {string}', function (campos) {
  assert.strictEqual(this.resultado.camposPorRellenar.join(', '), campos);
});
