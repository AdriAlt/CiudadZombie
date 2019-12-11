/* Para insipirarte para la implementacion del ZombieConductor podes usar
al ZombieCaminante de ejemplo. Tene en cuenta que tendra algunas diferencias.
Por ejemplo, la cantidad parametros que recibe su constructor. En ZombieConductor
no son exactamente los mismos parametros que en el objeto Enemigo, a diferencia
del ZombieCaminante que eran los mismos. */

var ZombieConductor = function(sprite, x, y, ancho, alto, velocidad, rangoMov, direccion) {
  Enemigo.call(this, sprite, x, y, ancho, alto, velocidad, rangoMov, direccion);
   this.mover = function() {
    switch (direccion){
      case "v":
        this.y += this.velocidad;
        break;
      case "h":
         this.x += this.velocidad;
        break;
      default:
    }
    if ((this.x < this.rangoMov.desdeX) || (this.x > this.rangoMov.hastaX)||
    (this.y < this.rangoMov.desdeY) || (this.y > this.rangoMov.hastaY)){
      this.velocidad *= -1;
    }
}

/* Completar creacion del ZombieConductor */
//estas 2 lineas obligatorias le dicen a la compuntadora que es un PROTOTYPE de este constructor
//Para agregar un funcion cuando tengo un constructor, la tengo q llamar de esta manera 
ZombieConductor.prototype = Object.create(Enemigo.prototype);
ZombieConductor.prototype.constructor = ZombieConductor;
  ZombieConductor.prototype.atacar = function (jugador) {
    jugador.perderVidas(5);
}
}