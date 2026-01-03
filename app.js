document.addEventListener("DOMContentLoaded", () => {
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
  let text =document.getElementById("buscador").value.ToLowerCase();
  console.log(text);
  console.log(data);
  console.log("2");
let tabla = document.getElementById("tablaCubos");
for(let x=0;x<data.length;x++){  
  let fila = tabla.insertRow();
  fila.insertCell().textContent =data[x].cubo;
  fila.insertCell().textContent =data[x].cantPiezas;
  fila.insertCell().textContent =data[x].tipoPiezas;
  fila.insertCell().textContent =data[x].cantGiros;
  fila.insertCell().textContent =data[x].tipoGiros;
  fila.insertCell().textContent =data[x].pasosMin;
  fila.insertCell().textContent =data[x].cantAlg;
  fila.insertCell().textContent =data[x].difPromAlg;
  fila.insertCell().textContent =data[x].difAlgTot;
  fila.insertCell().textContent =data[x].difBlock;
  fila.insertCell().textContent =data[x].difDeform;
  fila.insertCell().textContent =data[x].difParid;
  fila.insertCell().textContent =data[x].difAlgTot+data[x].difBlock+data[x].difDeform+data[x].difParid;
}
}


























