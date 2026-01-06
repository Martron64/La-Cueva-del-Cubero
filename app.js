let e=2.7182;
let TablaCubos=[];
let ConjuntoAlgoritmos=[];
document.addEventListener("DOMContentLoaded", () => {
  actualizar();
});
document.getElementById("buscador").addEventListener("input", actualizar);
document.getElementById("Tipo").addEventListener("change", actualizar);
document.getElementById("Orden").addEventListener("change", actualizar);
function actualizar(){
  fetch("DataCubos.json")
  .then(response => response.json())
  .then(data => {
    cargarTabla(data);
  });
  
}
function cargarTabla(data){
  let text =document.getElementById("buscador").value;
  console.log(text);
  let ch =document.getElementById("Tipo").value;
  console.log(ch);
  let A_D =document.getElementById("Orden").value;
  console.log(A_D);
  console.log("-----------------------");
let tabla = document.getElementById("tablaCubos");
  while(tabla.rows.length>1)
    tabla.deleteRow(1);
  filtrar(data);
  let algoritmos=[];
  cargarAlgoritmos(data,algoritmos);
}
function ordenar(data,algoritmos){
  let TIPO=document.getElementById("Tipo").value;
  let A_D =document.getElementById("Orden").value;
  for(let x=0;x<data.length-1;x++){
    let aux1=asignar(data[x],TIPO,algoritmos[x]);
    let min=aux1;
    let idmin=x;
    for(let y=x+1;y<data.length;y++){
       let aux2=asignar(data[y],TIPO,algoritmos[y]);
       if(comparar(aux2,min,A_D)){
         min=aux2;
         idmin=y;
       }
     }
     if(comparar(min,aux1,A_D)){
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
      aux=(dificultadAlgoritmicaTotal(algoritmos)+((e**objeto.difBlock)-1)+((e**objeto.difDeform)-1)+objeto.difParid.alg/objeto.difParid.parid);
    }
    else if(TIPO=="DifAlg"){
      aux=dificultadAlgoritmicaTotal(algoritmos);
    }
    else if(TIPO=="DifBlock"){
      aux=(e**objeto.difBlock)-1;
    }
    else if(TIPO=="DifDeform"){
      aux=(e**objeto.difDeform)-1;
    }
    else if(TIPO=="DifParid"){
      aux=objeto.difParid.alg/objeto.difParid.parid;
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

function comparar(A,B,A_D){
  if(A_D=="Asc")
    return B<A;
  else if(A_D=="Des")
    return A<B;
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
    let prom=dificultadAlgoritmicaPromedio(algoritmos[x])+" gands";
    fila.insertCell().textContent =prom;
    let algTot=dificultadAlgoritmicaTotal(algoritmos[x])+" gands";
    fila.insertCell().textContent =algTot;
    let Block=((e**data[x].difBlock)-1)+" gands";
    fila.insertCell().textContent =Block;
    let Deform=((e**data[x].difDeform)-1)+" gands";
    fila.insertCell().textContent =Deform;
    let Parid=data[x].difParid.alg/data[x].difParid.parid+" gands";
    fila.insertCell().textContent =Parid;
    let Tot=(dificultadAlgoritmicaTotal(algoritmos[x])+((e**data[x].difBlock)-1)+((e**data[x].difDeform)-1)+data[x].difParid.alg/data[x].difParid.parid)+" gands";
    fila.insertCell().textContent =Tot;
}
}
function encontrar(contador,elemento){
  let x;
  for(x=0;x<contador.length;x++){
    if(contador[x].pasos==elemento)
      return x;
  }
  return x;
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




















