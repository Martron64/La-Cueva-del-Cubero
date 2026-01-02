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
    CUBOS=data;
  });
  console.log("1");
console.log(CUBOS[0]);
  console.log("2");
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




















