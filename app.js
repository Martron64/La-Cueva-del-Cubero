document.addEventListener("DOMContentLoaded", () => {
  actualizar();
});
document.getElementById("buscador").addEventListener("input", actualizar);
document.getElementById("orden").addEventListener("change", actualizar);
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
  let ch =document.getElementById("orden").value;
  console.log(ch);
  let A_D =document.getElementById("AscDes").value;
  console.log(A_D);
let tabla = document.getElementById("tablaCubos");
  while(tabla.rows.length>1)
    tabla.deleteRow(1);
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































