# language: es
Característica: Bloqueo de cuenta después de 5 intentos fallidos
  Como usuario quiero que mi cuenta se bloquee 15 minutos después de 5 intentos fallidos
  para que nadie pueda adivinar mi contraseña

  Escenario: CP-01 sin intentos fallidos y datos correctos
    Dado una cuenta "pepe@gmail.com" con contraseña "Clave123" y 0 intentos fallidos
    Cuando inicia sesión con correo "pepe@gmail.com" y contraseña "Clave123"
    Entonces el sistema permite el acceso

  Escenario: CP-02 con 4 intentos fallidos y datos correctos
    Dado una cuenta "pepe@gmail.com" con contraseña "Clave123" y 4 intentos fallidos
    Cuando inicia sesión con correo "pepe@gmail.com" y contraseña "Clave123"
    Entonces el sistema permite el acceso
    Y los intentos fallidos vuelven a 0

  Escenario: CP-03 cuenta bloqueada entra desde otro dispositivo
    Dado una cuenta "pepe@gmail.com" con contraseña "Clave123" bloqueada por 10 minutos más
    Cuando inicia sesión con correo "pepe@gmail.com" y contraseña "Clave123" desde otro dispositivo
    Entonces el sistema niega el acceso
    Y muestra que faltan 10 minutos de bloqueo

  Escenario: CP-04 correo sin arroba
    Dado una cuenta "pepe@gmail.com" con contraseña "Clave123" y 0 intentos fallidos
    Cuando inicia sesión con correo "Pepegmail.com" y contraseña "Clave123"
    Entonces el sistema niega el acceso
    Y muestra el mensaje "Parámetro erróneo"

  Escenario: CP-05 datos incorrectos en el quinto intento
    Dado una cuenta "pepe@gmail.com" con contraseña "Clave123" y 4 intentos fallidos
    Cuando inicia sesión con correo "pepe@gmail.com" y contraseña "ClaveMala"
    Entonces el sistema niega el acceso
    Y la cuenta queda bloqueada por 15 minutos
    Y muestra el mensaje "Llegaste al máximo de intentos"

  Escenario: CP-06 campos vacíos
    Dado una cuenta "pepe@gmail.com" con contraseña "Clave123" y 0 intentos fallidos
    Cuando inicia sesión con correo "" y contraseña ""
    Entonces el sistema niega el acceso
    Y marca los campos por rellenar "correo, contrasena"
