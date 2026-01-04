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
let tabla = document.getElementById("tablaCubos");
  while(tabla.rows.length>1)
    tabla.deleteRow(1);
  ordenar(data);
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
  fila.insertCell().textContent =((2.718281828**data[x].difBlock)-1);
  fila.insertCell().textContent =((2.718281828**data[x].difDeform)-1);
  fila.insertCell().textContent =data[x].difParid;
  fila.insertCell().textContent =data[x].difAlgTot+((2.718281828**data[x].difBlock)-1)+((2.718281828**data[x].difDeform)-1)+data[x].difParid;
}
}
function ordenar(data){
  let TIPO=document.getElementById("Tipo").value;
  let A_D =document.getElementById("Orden").value;
  for(let x=0;x<data.length-1;x++){
    let aux1=asignar(data[x],TIPO);
    let min=aux1;
    let idmin=x;
    for(let y=x+1;y<data.length;y++){
       let aux2=asignar(data[y],TIPO);
       if(comparar(aux2,min,A_D)){
         min=aux2;
         idmin=y;
       }
     }
     if(comparar(min,aux1,A_D)){
       let aux3=data[x];
       data[x]=data[idmin];
       data[idmin]=aux3;
     }
  }
}
function asignar(objeto,TIPO){
  let aux;
  if (TIPO=="DifTot"){
      aux=objeto.difAlgTot+((2.718281828**objeto.difBlock)-1)+((2.718281828**objeto.difDeform)-1)+objeto.difParid;
    }
    else if(DifAlg=="DifAlg"){
      aux=objeto.difAlgTot;
    }
    else if(DifAlg=="DifBlock"){
      aux=(2.718281828**objeto.difBlock)-1;
    }
    else if(DifAlg=="DifDeform"){
      aux=(2.718281828**objeto.difDeform)-1;
    }
    else if(DifAlg=="DifParid"){
      aux=objeto.difParid;
    }
    else if(DifAlg=="CantPiezas"){
      aux=objeto.cantPiezas;
    }
    else if(DifAlg=="CantGriros"){
      aux=objeto.cantGiros;
    }
    else if(DifAlg=="CantAlgo"){
      aux=objeto.cantAlg;
    }
    else if(DifAlg=="Nombre"){
      aux=objeto.cubo;
    }
  return aux;
}
function comparar(A,B,A_D){
  if(A_D=="Asc")
    return A<B;
  else if(A_D=="Des")
    return B<A
}































