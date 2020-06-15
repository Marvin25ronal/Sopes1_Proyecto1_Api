Asset
> En esta carpeta se encuentra la pagina que muestra nuestra aplicacion.

arbol.html
>Este archivo html nos muestra la jerarquia de los procesos.

Chart.js
>Este archivo es una libreria la cual nos permite visualizar graficas de una manera mas facil

index.html
> Este archivo es la pagina principal en la cual esta integradas las graficas y tambien nos muestra una tabla de los resumenes
>de nuestra computadora.

listado.html
>En este archivo muestra una pagina en el cual aparecen todos los procesos con una opcion que le permite al usuario terminar dicho proceso.

main.js
>Es un archivo en el cual se utiliza Vuejs para desarrollar las funciones y que los datos se refresquen dinamicamente.
```javascript
const socket=io();
```
> Esta parte nos permite realizar la conexion con la api ya que es por medio de socket.
> Luego viene la parte de configuracion de variaables y configuracion de los metodos que se implementan en Vue.

```javascript
terminarproceso();
```
>Este metodo nos permite eliminar el proceso seleccionado emitiendo un mensaje por socket el cual la api busca el pid del proceso para eliminarlo


