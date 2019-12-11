/* El objeto Juego sera el encargado del control de todo el resto de los Objetos
existentes.
Le dara ordenes al Dibujante para que dibuje entidades en la pantalla. Cargara
el mapa, chequeara colisiones entre los objetos y actualizara sus movimientos
y ataques. Gran parte de su implementacion esta hecha, pero hay espacios con el
texto COMPLETAR que deben completarse segun lo indique la consigna.

El objeto Juego contiene mucho codigo. Tomate tu tiempo para leerlo tranquilo
y entender que es lo que hace en cada una de sus partes. */

var Juego = {
  // Aca se configura el tamanio del canvas del juego
  anchoCanvas: 961,
  altoCanvas: 577,
  jugador: Jugador,
  vidasInicial: Jugador.vidas,
  // Indica si el jugador gano
  ganador: false,

  obstaculosCarretera: [
    /*Aca se van a agregar los obstaculos visibles. Tenemos una valla horizontal
    de ejemplo, pero podras agregar muchos mas. */
    new Obstaculo('imagenes/valla_horizontal.png', 70, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 545, 375, 30, 30, 1),
    new Obstaculo('imagenes/valla_vertical.png', 290, 80, 30, 30, 1),
    new Obstaculo("imagenes/bache.png", 300, 450, 30, 30, 1 ),
    new Obstaculo("imagenes/valla_vertical.png", 420, 380, 30, 30, 1),
    new Obstaculo("imagenes/bache.png", 450, 260, 30, 30, 1),
    new Obstaculo("imagenes/bache.png", 340, 190, 30, 30, 1),
    new Obstaculo("imagenes/bache.png", 745, 160, 30, 30, 1),
    new Obstaculo("imagenes/auto_verde_abajo.png", 175, 235, 15, 30, 1),
    new Obstaculo("imagenes/auto_verde_abajo.png", 865, 390, 15, 30, 1),
    new Obstaculo("imagenes/auto_verde_derecha.png", 475, 480, 30, 15, 1)
  ],

  /* Estos son los bordes con los que se puede chocar, por ejemplo, la vereda.
   Ya estan ubicados en sus lugares correspondientes. Ya aparecen en el mapa, ya
   que son invisibles. No tenes que preocuparte por ellos.*/
  bordes: [
    // // Bordes
    new Obstaculo('', 0, 5, 961, 18, 0),
    new Obstaculo('', 0, 559, 961, 18, 0),
    new Obstaculo('', 0, 5, 18, 572, 0),
    new Obstaculo('', 943, 5, 18, 572, 0),
    // Veredas
    new Obstaculo('', 18, 23, 51, 536, 2),
    new Obstaculo('', 69, 507, 690, 52, 2),
    new Obstaculo('', 587, 147, 173, 360, 2),
    new Obstaculo('', 346, 147, 241, 52, 2),
    new Obstaculo('', 196, 267, 263, 112, 2),
    new Obstaculo('', 196, 23, 83, 244, 2),
    new Obstaculo('', 279, 23, 664, 56, 2),
    new Obstaculo('', 887, 79, 56, 480, 2)
  ],

  // Los enemigos
  enemigos: [
     new ZombieCaminante("imagenes/zombie1.png", 85, 275, 10, 10, 0.5, {desdeX: 85, hastaX: 90, desdeY: 275, hastaY: 280}),
     new ZombieCaminante("imagenes/zombie1.png", 161, 390, 10, 10, 0.5, {desdeX: 161, hastaX: 165, desdeY: 390, hastaY: 393}),
     new ZombieCaminante("imagenes/zombie2.png", 530, 230, 10, 10, 0.5, {desdeX: 530, hastaX: 535, desdeY: 230, hastaY: 240}),
     new ZombieCaminante("imagenes/zombie3.png", 489, 125, 10, 10, 0.5, {desdeX: 489, hastaX: 510, desdeY: 125, hastaY: 120}),
     new ZombieCaminante("imagenes/zombie4.png", 850, 227, 10, 10, 0.5, {desdeX: 850, hastaX: 852, desdeY: 227, hastaY: 233}),
     new ZombieCaminante("imagenes/zombie4.png", 830, 100, 10, 10, 0.5, {desdeX: 800, hastaX: 803, desdeY: 100, hastaY: 105}),
  
     new ZombieConductor("imagenes/tren_vertical.png", 644, 0, 30, 90, 10, {desdeX: 0, hastaX: 961, desdeY: 0, hastaY: 577}, "v"),
     new ZombieConductor("imagenes/tren_vertical.png", 678, 0, 30, 90, 10, {desdeX: 0, hastaX: 961, desdeY: 0, hastaY: 577}, "v"),
     new ZombieConductor("imagenes/tren_horizontal.png", 400, 322, 90, 30, 10, {desdeX: 0, hastaX: 961, desdeY: 0, hastaY: 577}, "h"),
  ]

}

/* Se cargan los recursos de las imagenes, para tener un facil acceso
a ellos. No hace falta comprender esta parte. Pero si queres agregar tus propies
imagenes tendras que poner su ruta en la lista para que pueda ser precargada como
todas las demas. */
Juego.iniciarRecursos = function() {
  Resources.load([
    'imagenes/mapa.png',
    'imagenes/mensaje_gameover.png',
    'imagenes/Splash.png',
    'imagenes/SplashWin.png',
    'imagenes/bache.png',
    'imagenes/tren_horizontal.png',
    'imagenes/tren_vertical.png',
    'imagenes/valla_horizontal.png',
    'imagenes/valla_vertical.png',
    'imagenes/zombie1.png',
    'imagenes/zombie2.png',
    'imagenes/zombie3.png',
    'imagenes/zombie4.png',
    'imagenes/auto_rojo_abajo.png',
    'imagenes/auto_rojo_arriba.png',
    'imagenes/auto_rojo_derecha.png',
    'imagenes/auto_rojo_izquierda.png',
    'imagenes/auto_verde_abajo.png',
    'imagenes/auto_verde_derecha.png'
  ]);
  Resources.onReady(this.comenzar.bind(Juego));
};

// Agrega los bordes de las veredas a los obstaculos de la carretera
Juego.obstaculos = function() {
  return this.obstaculosCarretera.concat(this.bordes);
};

Juego.comenzar = function() {
  // Inicializar el canvas del juego
  Dibujante.inicializarCanvas(this.anchoCanvas, this.altoCanvas);
  /* El bucle principal del juego se llamara continuamente para actualizar
  los movimientos y el pintado de la pantalla. Sera el encargado de calcular los
  ataques, colisiones, etc*/
  this.buclePrincipal();
};

Juego.buclePrincipal = function() {
  this.dibujar();
  this.update();
  window.requestAnimationFrame(this.buclePrincipal.bind(this));
};

Juego.update = function() {
  this.calcularAtaques();
  this.moverEnemigos();
}
Juego.capturarMovimiento = function(tecla) {
  var movX = 0;
  var movY = 0;
  var velocidad = this.jugador.velocidad;
  if (tecla == 'izq') {
    movX = -velocidad;
    Jugador.sprite = "imagenes/auto_rojo_izquierda.png";
    Jugador.alto = 15;
    Jugador.ancho = 30;
  }
  if (tecla == 'arriba') {
    movY = -velocidad;
    Jugador.sprite = "imagenes/auto_rojo_arriba.png";
    Jugador.alto = 30;
    Jugador.ancho = 15;
  }
  if (tecla == 'der') {
    movX = velocidad;
    Jugador.sprite = "imagenes/auto_rojo_derecha.png";
    Jugador.alto = 15;
    Jugador.ancho = 30;
  }
  if (tecla == 'abajo') {
    movY = velocidad;
    Jugador.sprite = "imagenes/auto_rojo_abajo.png";
    Jugador.alto = 30;
    Jugador.ancho = 15;
  }

  // Si se puede mover hacia esa posicion hay que hacer efectivo este movimiento
  if (this.chequearColisiones(movX + this.jugador.x, movY + this.jugador.y)) {
    //Movimiento del jugador
    Jugador.x += movX;
    Jugador.y += movY;
  }
};

Juego.dibujar = function() {
  Dibujante.borrarAreaDeJuego();
  this.dibujarFondo();
    //Dibujo el jugador (entidad)
  Dibujante.dibujarEntidad(Jugador);
  this.obstaculosCarretera.forEach(function(obstaculo) {
    Dibujante.dibujarEntidad(obstaculo);
  });

  // Se recorren los enemigos pintandolos
  this.enemigos.forEach(function(enemigo) {
    Dibujante.dibujarEntidad(enemigo);
  });

  // El dibujante dibuja las vidas del jugador
  var tamanio = this.anchoCanvas / this.vidasInicial;
  Dibujante.dibujarRectangulo('white', 0, 0, this.anchoCanvas, 8);
  for (var i = 0; i < this.jugador.vidas; i++) {
    var x = tamanio * i
    Dibujante.dibujarRectangulo('red', x, 0, tamanio, 8);
  }
};

/* Recorre los enemigos haciendo que se muevan. De la misma forma que hicimos
un recorrido por los enemigos para dibujarlos en pantalla ahora habra que hacer
una funcionalidad similar pero para que se muevan.*/
Juego.moverEnemigos = function() {
  this.enemigos.forEach(function(enemigo) {
    enemigo.mover();
  });
};

/* Recorre los enemigos para ver cual esta colisionando con el jugador
Si colisiona empieza el ataque el zombie, si no, deja de atacar.
Para chequear las colisiones estudiar el metodo posicionValida. Alli
se ven las colisiones con los obstaculos. En este caso sera con los zombies. */
Juego.calcularAtaques = function() {
  this.enemigos.forEach(function(enemigo) {
    {
    if (this.intersecan(enemigo, this.jugador, this.jugador.x, this.jugador.y)) {
      //Si el enemigo colisiona debe empezar su ataque
       enemigo.comenzarAtaque(this.jugador);
    } else { 
      //Sino, debe dejar de atacar
      var enemy = new Enemigo(enemigo.sprite, enemigo.x, enemigo.y, enemigo.ancho, enemigo.velocidad );
      enemy.dejarDeAtacar();
    }
  } }, this);
};

/* Aca se chequea si el jugador se peude mover a la posicion destino.
 Es decir, que no haya obstaculos que se interpongan. De ser asi, no podra moverse */
Juego.chequearColisiones = function(x, y) {
  var puedeMoverse = true
  this.obstaculos().forEach(function(obstaculo) {
    if (this.intersecan(obstaculo, this.jugador, x, y)) {
      /*COMPLETAR, obstaculo debe chocar al jugador*/
      //funcion que esta dentro de otra funcion. esto es un closures, ya que recuerda su entorno. 
      obstaculo.chocar(this.jugador);
      puedeMoverse = false
    }
  }, this)
    return puedeMoverse
};

/* Este metodo chequea si los elementos 1 y 2 si cruzan en x e y
 x e y representan la coordenada a la cual se quiere mover el elemento2*/
Juego.intersecan = function(elemento1, elemento2, x, y) {
  var izquierda1 = elemento1.x
  var derecha1 = izquierda1 + elemento1.ancho
  var techo1 = elemento1.y
  var piso1 = techo1 + elemento1.alto
  var izquierda2 = x
  var derecha2 = izquierda2 + elemento2.ancho
  var techo2 = y
  var piso2 = y + elemento2.alto

  return ((piso1 >= techo2) && (techo1 <= piso2) &&
    (derecha1 >= izquierda2) && (izquierda1 <= derecha2))
};

Juego.dibujarFondo = function() {
  // Si se termino el juego hay que mostrar el mensaje de game over de fondo
  if (this.terminoJuego()) {
    Dibujante.dibujarImagen('imagenes/mensaje_gameover.png', 0, 5, this.anchoCanvas, this.altoCanvas);
    document.getElementById('reiniciar').style.visibility = 'visible';
  }
  // Si se gano el juego hay que mostrar el mensaje de ganoJuego de fondo
  else if (this.ganoJuego()) {
    Dibujante.dibujarImagen('imagenes/SplashWin.png'  , 190, 113, 500, 203);
    document.getElementById('reiniciar').style.visibility = 'visible';
  } else {
    Dibujante.dibujarImagen('imagenes/mapa.png', 0, 5, this.anchoCanvas, this.altoCanvas);
    Dibujante.dibujarRectangulo("#fdd043", 760, 510, 126, 126);
  }
};

Juego.terminoJuego = function() {
  return this.jugador.vidas <= 0;
};

/* Se gana el juego si se sobre pasa cierto altura y */
Juego.ganoJuego = function() {
  return (this.jugador.y + this.jugador.alto) > 530;
};
Juego.iniciarRecursos();

// Activa las lecturas del teclado al presionar teclas
// Documentacion: https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener
document.addEventListener('keydown', function(e) {
  var allowedKeys = {
    37: 'izq',
    38: 'arriba',
    39: 'der',
    40: 'abajo'
  };

  Juego.capturarMovimiento(allowedKeys[e.keyCode]);
});
