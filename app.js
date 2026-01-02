document.addEventListener("DOMContentLoaded", () => {
  actualizar();
});

function calcular(){
let tabla = document.getElementById("tablaCubos");
let fila = tabla.insertRow(); 
fila.insertCell().textContent ="3X3";
fila.insertCell().textContent ="26";
fila.insertCell().textContent ="3";
fila.insertCell().textContent ="1";
fila.insertCell().textContent ="6";
fila.insertCell().textContent ="1";
fila.insertCell().textContent ="1";
fila.insertCell().textContent ="7";
fila.insertCell().textContent ="6";
fila.insertCell().textContent ="12";
fila.insertCell().textContent ="21";
fila.insertCell().textContent ="0";
fila.insertCell().textContent ="0";
fila.insertCell().textContent ="0";
fila.insertCell().textContent ="NO SE";
}

function actualizar(){
  let CUBOS=[];
  fetch("DataCubos.json")
  .then(response => response.json())
  .then(data => {
    cargarTabla(data);
  });
  
}
function cargarTabla(data){
  console.log("1");
  console.log(data);
  console.log("2");
let tabla = document.getElementById("tablaCubos");
for(let x=0;x<data.length;x++){  
  let fila = tabla.insertRow();
  fila.insertCell().textContent =data[x].cubo;
  fila.insertCell().textContent =data[x].cantiPiezas;
  fila.insertCell().textContent =data[x].tipoPiezas;
  fila.insertCell().textContent =data[x].cantGiros;
  fila.insertCell().textContent =data[x].tipoGiros;
  fila.insertCell().textContent =data[x].PasosMin;
  fila.insertCell().textContent =data[x].cantAlg;
  fila.insertCell().textContent =data[x].difPromAlg;
  fila.insertCell().textContent =data[x].difAlgTot;
  fila.insertCell().textContent =data[x].difBlock;
  fila.insertCell().textContent =data[x].difDeform;
  fila.insertCell().textContent =data[x].difParid;
  fila.insertCell().textContent =data[x].difAlgTot+data[x].difBlock+data[x].difDeform+data[x].difParid;
}
}






















