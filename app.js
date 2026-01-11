let FILAS_VISIBLES = 5;
let e=2.718281828459;
let TablaCubos=[];
let ConjuntoAlgoritmos=[];
let cuboActivo = null;
let ordenAscendente = false; // false = descendente
document.querySelectorAll(".toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".contenido").forEach(c => {
      if (c !== btn.nextElementSibling) c.classList.add("oculto");
    });
    btn.nextElementSibling.classList.toggle("oculto");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  actualizar();
});
document.getElementById("buscador").addEventListener("input", actualizar);
document.getElementById("Tipo").addEventListener("change", actualizar);
const btnOrden = document.getElementById("btnOrden");

btnOrden.addEventListener("click", () => {
  ordenAscendente = !ordenAscendente;
  btnOrden.textContent = ordenAscendente ? "Ascendente-⬆" : "Descendente-⬇";
  actualizar();
});
function actualizar(){
  fetch("DataCubos.json")
  .then(response => response.json())
  .then(data => {
    cargarTabla(data);
  });
  
}
function cargarTabla(data){
let tabla = document.getElementById("tablaCubos");
  while(tabla.rows.length>1)
    tabla.deleteRow(1);
  filtrar(data);
  let algoritmos=[];
  cargarAlgoritmos(data,algoritmos);
}
function filtrar(data){
  let SubStr=document.getElementById("buscador").value;
  if(0<SubStr.length)
    for(let x=0;x<data.length;x++){
      if(!subcadena(data[x].cubo,SubStr)){
       data.splice(x,1);
        x--;
      }
    }
  
}
function subcadena(Str,SubStr){
  aux1=Str.toLowerCase();
  aux2=SubStr.toLowerCase();
  if(SubStr.length>Str.length||SubStr.length<=0)
    return false;
  else if(SubStr.length==Str.length)
    return aux1==aux2;
  for(let x=0;x<Str.length-SubStr.length+1;x++){
    let seguir=true;
    for(let y=0;y<SubStr.length&&seguir;y++){
      let char1=aux1[x+y];
      let char2=aux2[y];
      if(char1!=char2)
        seguir=false;
    }
    if(seguir)
      return true;
  }
  return false;
}
function cargarAlgoritmos(data,algoritmos){
  fetch(data[algoritmos.length].direccion)
  .then(response => response.json())
  .then(elemento => {
    algoritmos.push(elemento);
    if(algoritmos.length==data.length)
      ordenar(data,algoritmos);
    else
      cargarAlgoritmos(data,algoritmos);
  });
}
function ordenar(data,algoritmos){
  let TIPO=document.getElementById("Tipo").value;
  for(let x=0;x<data.length-1;x++){
    let aux1=asignar(data[x],TIPO,algoritmos[x]);
    let min=aux1;
    let idmin=x;
    for(let y=x+1;y<data.length;y++){
       let aux2=asignar(data[y],TIPO,algoritmos[y]);
       if(comparar(aux2,min)){
         min=aux2;
         idmin=y;
       }
     }
     if(comparar(min,aux1)){
       let aux3=data[x];
       data[x]=data[idmin];
       data[idmin]=aux3;
       let aux4=algoritmos[x];
       algoritmos[x]=algoritmos[idmin]
       algoritmos[idmin]=aux4
     }
  }
  ImprimirTabla(data,algoritmos);
}
function asignar(objeto,TIPO,algoritmos){
  let aux;
  if (TIPO=="DifTot"){
      aux=(dificultadAlgoritmicaTotal(algoritmos)+((e**(objeto.difBlock*2))-1)+((e**(objeto.difDeform*2))-1)+objeto.difParid.alg*objeto.difParid.parid);
    }
    else if(TIPO=="DifAlg"){
      aux=dificultadAlgoritmicaTotal(algoritmos);
    }
    else if(TIPO=="DifBlock"){
      aux=objeto.difBlock;
    }
    else if(TIPO=="DifDeform"){
      aux=objeto.difDeform;
    }
    else if(TIPO=="DifParid"){
      aux=objeto.difParid.alg*objeto.difParid.parid;
    }
    else if(TIPO=="CantPiezas"){
      aux=objeto.cantPiezas;
    }
    else if(TIPO=="CantGriros"){
      aux=objeto.cantGiros;
    }
    else if(TIPO=="CantAlg"){
      aux=algoritmos.length;
    }
    else if(TIPO=="Nombre"){
      aux=objeto.cubo;
    }
  return aux;
}

function comparar(A,B){
  if(ordenAscendente)
    return B<A;
  else
    return A<B;
}
function ImprimirTabla(data,algoritmos){
  TablaCubos=data;
  ConjuntoAlgoritmos=algoritmos;
  let tabla = document.getElementById("tablaCubos");
  for(let x=0;x<data.length;x++){  
    let fila = tabla.insertRow();
    fila.insertCell().textContent =data[x].cubo;
    fila.insertCell().textContent =data[x].cantPiezas;
    fila.insertCell().textContent =data[x].tipoPiezas;
    fila.insertCell().textContent =data[x].cantGiros;
    fila.insertCell().textContent =data[x].tipoGiros;
    fila.insertCell().textContent =data[x].pasosMin;
    fila.insertCell().textContent =algoritmos[x].length;
    let prom=setprecition(dificultadAlgoritmicaPromedio(algoritmos[x]))+" gands";
    fila.insertCell().textContent =prom;
    let algTot=setprecition(dificultadAlgoritmicaTotal(algoritmos[x]))+" gands";
    fila.insertCell().textContent =algTot;
    let Block=setprecition(((e**(data[x].difBlock*2))-1))+" gands";
    fila.insertCell().textContent =Block;
    let Deform=setprecition(((e**(data[x].difDeform*2))-1))+" gands";
    fila.insertCell().textContent =Deform;
    let Parid=setprecition(data[x].difParid.alg*data[x].difParid.parid)+" gands";
    fila.insertCell().textContent =Parid;
    let Tot=setprecition((dificultadAlgoritmicaTotal(algoritmos[x])+((e**(data[x].difBlock*2))-1)+((e**(data[x].difDeform*2))-1)+
                  data[x].difParid.alg*data[x].difParid.parid))+" gands";
    fila.insertCell().textContent =Tot;
    let celdaBtn = fila.insertCell();
    let btn = document.createElement("button");
    btn.textContent = "Ver cubo";

    // guardás el índice del cubo
    btn.dataset.index = x;

    // todos usan la misma función
    btn.addEventListener("click", verCubo);

    celdaBtn.appendChild(btn);
  }
  let cont = document.getElementById("contenedorTabla");
if (data.length <= FILAS_VISIBLES) {
  cont.style.overflowY = "hidden";
} else {
  cont.style.overflowY = "auto";
}
}
function setprecition(x) {
  return Number(x.toFixed(2));
}

function calculoDifAlgoritmica(algoritmo){
  let contador=[];
  for(let x=0;x<algoritmo.pasos.length;x++){
    let id=encontrar(contador,algoritmo.pasos[x]);
    if (id==contador.length){
      let estructura={pasos:algoritmo.pasos[x],contador:1};
      contador.push(estructura);
    }
    else {
      contador[id].contador=contador[id].contador+1;
    }
  }
  let max=contador[0].contador;
  let min=max;
  for(let x=1;x<contador.length;x++){
    if(contador[x].contador>max)
      max=contador[x].contador;
    if(contador[x].contador<min)
      min=contador[x].contador;
  }
  return (contador.length*max/min);
}

function dificultadAlgoritmicaPromedio(algoritmos){
  let contador=0;
  for(let x=0;x<algoritmos.length;x++){
    contador=contador+calculoDifAlgoritmica(algoritmos[x]);
  }
  return (contador/algoritmos.length);
}

function dificultadAlgoritmicaTotal(algoritmos){
  let contador_original=0;
  let contador_espejo=0;
  for(let x=0;x<algoritmos.length;x++){
    if(algoritmos[x].tipo=="original")
      contador_original=contador_original+calculoDifAlgoritmica(algoritmos[x]);
    else
      contador_espejo=contador_espejo+calculoDifAlgoritmica(algoritmos[x]);
  }
  return (contador_original+contador_espejo/2);
}

function encontrar(contador,elemento){
  let x;
  for(x=0;x<contador.length;x++){
    if(contador[x].pasos==elemento)
      return x;
  }
  return x;
}
function verCubo(event) {
  let index = Number(event.target.dataset.index);
  console.log("Cubo:", index);
  console.log("Cubo:", TablaCubos[index]);
  console.log("Algoritmos:", ConjuntoAlgoritmos[index]);
  if (cuboActivo === index) {
    cerrarDetalle();
  } 
  else {
    cuboActivo = index;
    mostrarSoloFila(index);
    mostrarDetalle(index);
  }
  console.log("Cubo:", index);
  console.log("Cubo:", TablaCubos[index]);
  console.log("Algoritmos:", ConjuntoAlgoritmos[index]);
}
function mostrarSoloFila(index) {
  let filas = document.getElementById("tablaCubos").rows;
  for (let i = 1; i < filas.length; i++) {
    filas[i].style.display = (i - 1 === index) ? "" : "none";
  }
}

function restaurarTabla() {
  let filas = document.getElementById("tablaCubos").rows;
  for (let i = 1; i < filas.length; i++) {
    filas[i].style.display = "";
  }
}
function mostrarDetalle(i) {
  let cont = document.getElementById("detalleCubo");
  cont.hidden = false;

  let cubo = TablaCubos[i];
  let algs = ConjuntoAlgoritmos[i];

  // HEADER
  document.getElementById("detalleHeader").innerHTML = `
    <h2>${cubo.cubo}</h2>
    <p>Piezas: ${cubo.cantPiezas}</p>
    <p>Dificultad total: ${
      setprecition(
        dificultadAlgoritmicaTotal(algs)
        + ((e ** (cubo.difBlock * 2)) - 1)
        + ((e ** (cubo.difDeform * 2)) - 1)
        + cubo.difParid.alg * cubo.difParid.parid
      )
    } gands</p>
  `;

  // FOOTER
  document.getElementById("detalleFooter").innerHTML =
    `<button onclick="cerrarDetalle()">Cerrar</button>`;

  // CONTENIDO (se carga aparte)
  cargarDescripcion(i);
}
function cerrarDetalle() {
  document.getElementById("detalleCubo").hidden = true;

  // limpiar contenido
  document.getElementById("detalleHeader").innerHTML = "";
  document.getElementById("detalleContenido").innerHTML = "";
  document.getElementById("detalleFooter").innerHTML = "";

  restaurarTabla();
  cuboActivo = null;
}
function cargarDescripcion(cuboId) {
  fetch(TablaCubos[cuboId].descripcion)
    .then(r => r.json())
    .then(elementos => {

      // ✔️ ESTE es el contenedor correcto
      let cont = document.getElementById("detalleContenido");

      // ✔️ borrar contenido previo ANTES de cargar
      cont.innerHTML = "";

      let filaImagenes = null;

      for (let e of elementos) {

        if (e.tipo === "imagen") {

          // si no existe fila, la creamos
          if (!filaImagenes) {
            filaImagenes = document.createElement("div");
            filaImagenes.className = "fila-imagenes";
            cont.appendChild(filaImagenes);
          }

          let img = document.createElement("img");
          img.src = e.contenido;
          filaImagenes.appendChild(img);

        } 
        else if (e.tipo === "texto") {

          // texto corta la fila de imágenes
          filaImagenes = null;

          let p = document.createElement("p");
          p.textContent = e.contenido;
          cont.appendChild(p);
        }
      }
    });
}






