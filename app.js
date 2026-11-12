// ======================================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ======================================================

let FILAS_VISIBLES = 5;
const e = Math.E;

let TablaCubos = [];
let ConjuntoAlgoritmos = [];

// Array principal: cada elemento contiene un cubo y sus algoritmos.
let CubosCargados = [];

let cuboActivo = null;
let ordenAscendente = true; // true = Descendente-⬇
let precision = 2;

// Se utiliza para evitar que una descripción vieja
// aparezca si el usuario cambia de cubo rápidamente.
let solicitudDescripcion = 0;


// ======================================================
// INICIO DE LA PÁGINA
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  // Conectar los botones desplegables.
  document.querySelectorAll(".toggle").forEach(btn => {
    btn.addEventListener("click", () => {

      document.querySelectorAll(".contenido").forEach(contenido => {
        if (contenido !== btn.nextElementSibling) {
          contenido.classList.add("oculto");
        }
      });

      btn.nextElementSibling.classList.toggle("oculto");
    });
  });

  // Conectar los controles de la tabla.
  document.getElementById("buscador")
    .addEventListener("input", actualizarTabla);

  document.getElementById("Tipo")
    .addEventListener("change", actualizarTabla);

  document.getElementById("btnOrden")
    .addEventListener("click", () => {

      ordenAscendente = !ordenAscendente;

      document.getElementById("btnOrden").textContent =
        ordenAscendente ? "Ascendente-⬆" : "Descendente-⬇";

      actualizarTabla();
    });

  // Iniciar la carga de los datos.
  cargarDatosIniciales();
});


// ======================================================
// CARGA INICIAL DE LOS CUBOS Y SUS ALGORITMOS
// ======================================================

async function cargarDatosIniciales() {

  const estado = document.getElementById("estadoCarga");

  try {

    // Primero se descarga el archivo principal.
    const respuesta = await fetch("DataCubos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar DataCubos.json");
    }

    const datos = await respuesta.json();

    const totalCubos = datos.length;

    let intentosTerminados = 0;
    let cubosExitosos = 0;

    estado.textContent = `Cubos cargados: 0/${totalCubos}`;

    // Cada cubo se carga de forma independiente.
    // Promise.allSettled permite que un fallo no interrumpa
    // la carga de los demás cubos.

    const promesas = datos.map(async cubo => {

      try {

        const respuestaAlgoritmos = await fetch(cubo.direccion);

        if (!respuestaAlgoritmos.ok) {
          throw new Error(
            `No se pudo cargar el archivo de algoritmos de ${cubo.cubo}`
          );
        }

        const algoritmos = await respuestaAlgoritmos.json();

        // El cubo solamente se considera cargado si
        // también se pudieron cargar sus algoritmos.
        cubosExitosos++;

        return {
          cubo: cubo,
          algoritmos: algoritmos
        };

      } catch (error) {

        console.error(
          `Error al cargar el cubo ${cubo.cubo}:`,
          error
        );

        return null;

      } finally {

        intentosTerminados++;

        estado.textContent =
          `Cubos cargados: ${cubosExitosos}/${totalCubos}`;
      }

    });

    const resultados = await Promise.allSettled(promesas);

    // Nos quedamos únicamente con los cubos que se cargaron bien.
    CubosCargados = resultados
      .filter(resultado => resultado.status === "fulfilled")
      .map(resultado => resultado.value)
      .filter(elemento => elemento !== null);

    // Preparar y mostrar la tabla inicial.
    actualizarTabla();

    // Habilitar los controles y ocultar el contador.
    // Se hace dentro del mismo bloque de ejecución para que
    // el contador desaparezca al habilitar los controles.
    document.getElementById("buscador").disabled = false;
    document.getElementById("Tipo").disabled = false;
    document.getElementById("btnOrden").disabled = false;

    estado.hidden = true;

    if (cubosExitosos < totalCubos) {
      console.warn(
        `Se cargaron ${cubosExitosos} de ${totalCubos} cubos.`
      );
    }

  } catch (error) {

    console.error("Error durante la carga inicial:", error);

    estado.textContent =
      "No se pudieron cargar los datos de los cubos. Recargá la página.";

    estado.classList.add("error-carga");
  }
}


// ======================================================
// ACTUALIZAR, FILTRAR Y ORDENAR LA TABLA
// ======================================================

function actualizarTabla() {

  const buscador = document.getElementById("buscador");
  const tipoOrden = document.getElementById("Tipo").value;

  const texto = buscador.value.trim().toLowerCase();

  // Copiamos el array principal.
  // De esta manera, nunca modificamos CubosCargados.
  let cubosVisibles = CubosCargados.filter(elemento => {

    return elemento.cubo.cubo
      .toLowerCase()
      .includes(texto);

  });

  // Ordenar los cubos según el criterio seleccionado.
  cubosVisibles.sort((A, B) => {

    const valorA = asignar(A, tipoOrden);
    const valorB = asignar(B, tipoOrden);

    if (valorA === valorB) {
      return 0;
    }

    let resultado;

    if (typeof valorA === "string") {
      resultado = valorA.localeCompare(valorB);
    } else {
      resultado = valorA - valorB;
    }

    return ordenAscendente ? resultado : -resultado;
  });

  // Separar los cubos y sus algoritmos manteniendo
  // siempre la correspondencia entre ambos arrays.
  const datos = cubosVisibles.map(elemento => elemento.cubo);
  const algoritmos = cubosVisibles.map(elemento => elemento.algoritmos);

  ImprimirTabla(datos, algoritmos);
}


// ======================================================
// OBTENER EL VALOR POR EL QUE SE VA A ORDENAR
// ======================================================

function asignar(elemento, tipo) {

  const cubo = elemento.cubo;
  const algoritmos = elemento.algoritmos;

  if (tipo === "DifTot") {
    return calcularDificultadTotal(cubo, algoritmos);
  }

  else if (tipo === "DifAlg") {
    return dificultadAlgoritmicaTotal(algoritmos);
  }

  else if (tipo === "DifBlock") {
    return Number(cubo.difBlock);
  }

  else if (tipo === "DifDeform") {
    return Number(cubo.difDeform);
  }

  else if (tipo === "DifParid") {
    return obtenerCantidadParidades(cubo);
  }

  else if (tipo === "CantPiezas") {
    return Number(cubo.cantPiezas);
  }

  else if (tipo === "CantGiros") {
    return Number(cubo.cantGiros);
  }

  else if (tipo === "CantAlg") {
    return algoritmos.length;
  }

  else if (tipo === "Nombre") {
    return cubo.cubo.toLowerCase();
  }

  return 0;
}


// ======================================================
// OBTENER LA CANTIDAD DE PARIDADES
// ======================================================

function obtenerCantidadParidades(cubo) {

  // Se conserva la estructura que ya utiliza tu JSON:
  // difParid es un objeto y parid es la cantidad.
  return Number(cubo.difParid?.parid ?? 0);
}


// ======================================================
// IMPRIMIR LA TABLA
// ======================================================

function ImprimirTabla(data, algoritmos) {

  // Guardamos los datos que corresponden a las filas visibles.
  // Los botones de "Ver cubo" van a utilizar estos arrays.
  TablaCubos = data;
  ConjuntoAlgoritmos = algoritmos;

  const tabla = document.getElementById("cuerpoTabla");

  // Borrar las filas anteriores.
  tabla.innerHTML = "";

  for (let x = 0; x < data.length; x++) {

    const cubo = data[x];
    const algs = algoritmos[x];

    const fila = tabla.insertRow();

    fila.insertCell().textContent = cubo.cubo;
    fila.insertCell().textContent = cubo.cantPiezas;
    fila.insertCell().textContent = cubo.tipoPiezas;
    fila.insertCell().textContent = cubo.cantGiros;
    fila.insertCell().textContent = cubo.tipoGiros;
    fila.insertCell().textContent = cubo.pasosMin;
    fila.insertCell().textContent = algs.length;

    const promedio = dificultadAlgoritmicaPromedio(algs);
    fila.insertCell().textContent =
      setPrecision(promedio) + " gands";

    const totalAlgoritmica = dificultadAlgoritmicaTotal(algs);
    fila.insertCell().textContent =
      setPrecision(totalAlgoritmica) + " gands";

    fila.insertCell().textContent =
      setPrecision(cubo.difBlock);

    fila.insertCell().textContent =
      setPrecision(cubo.difDeform);

    fila.insertCell().textContent =
      setPrecision(obtenerCantidadParidades(cubo));

    const total = calcularDificultadTotal(cubo, algs);

    fila.insertCell().textContent =
      setPrecision(total) + " gands";

    // Botón para ver los detalles del cubo.
    const celdaBtn = fila.insertCell();

    const btn = document.createElement("button");

    btn.textContent = "Ver cubo";

    // El índice corresponde a la fila actual,
    // después de aplicar el filtro y el ordenamiento.
    btn.dataset.index = x;

    btn.addEventListener("click", verCubo);

    celdaBtn.appendChild(btn);
  }

  // Controlar si hace falta mostrar la barra de desplazamiento.
  const contenedor = document.getElementById("contenedorTabla");

  if (data.length <= FILAS_VISIBLES) {
    contenedor.style.overflowY = "hidden";
  } else {
    contenedor.style.overflowY = "auto";
  }

  // Si el cubo que estaba abierto ya no está visible,
  // cerrar su detalle para evitar mostrar datos incorrectos.
  if (cuboActivo !== null) {
    cerrarDetalle();
  }
}


// ======================================================
// REDONDEO
// ======================================================

function setPrecision(x) {

  const numero = Number(x);

  if (!Number.isFinite(numero)) {
    return 0;
  }

  return Number(numero.toFixed(precision));
}


// ======================================================
// DIFICULTAD DE UN ALGORITMO INDIVIDUAL
// ======================================================

function calculoDifAlgoritmica(algoritmo) {

  const pasos = algoritmo.pasos;

  if (!Array.isArray(pasos) || pasos.length === 0) {
    return 1;
  }

  // Contar cuántas veces aparece cada movimiento.
  const contador = [];

  for (let x = 0; x < pasos.length; x++) {

    const id = encontrar(contador, pasos[x]);

    if (id === contador.length) {

      const estructura = {
        pasos: pasos[x],
        contador: 1
      };

      contador.push(estructura);

    } else {

      contador[id].contador++;
    }
  }

  // Buscar la frecuencia mayor y la menor.
  let max = contador[0].contador;
  let min = max;

  for (let x = 1; x < contador.length; x++) {

    if (contador[x].contador > max) {
      max = contador[x].contador;
    }

    if (contador[x].contador < min) {
      min = contador[x].contador;
    }
  }

  // Fórmula individual:
  // D_alg = L * (Conteo mayor / Conteo menor)
  return contador.length * max / min;
}


// ======================================================
// DIFICULTAD ALGORÍTMICA PROMEDIO
// ======================================================

function dificultadAlgoritmicaPromedio(algoritmos) {

  if (!Array.isArray(algoritmos) || algoritmos.length === 0) {
    return 1;
  }

  let suma = 0;

  // Todos los algoritmos cuentan por igual:
  // originales, inversos, espejos e inversos de espejos.
  for (let x = 0; x < algoritmos.length; x++) {

    suma += calculoDifAlgoritmica(algoritmos[x]);
  }

  const promedio = suma / algoritmos.length;

  // V2: piso de 1.
  return Math.max(1, promedio);
}


// ======================================================
// DIFICULTAD ALGORÍTMICA TOTAL
// ======================================================

function dificultadAlgoritmicaTotal(algoritmos) {

  let sumaOriginales = 0;
  let sumaEspejos = 0;

  for (let x = 0; x < algoritmos.length; x++) {

    const dificultad = calculoDifAlgoritmica(algoritmos[x]);

    if (algoritmos[x].tipo === "original") {

      sumaOriginales += dificultad;

    } else {

      // Se conserva el criterio de tu código:
      // todo algoritmo cuyo tipo no sea "original"
      // se considera espejo.
      sumaEspejos += dificultad;
    }
  }

  const total = sumaOriginales + sumaEspejos / 2;

  // V2: piso de 1.
  return Math.max(1, total);
}


// ======================================================
// DIFICULTAD TOTAL DEL CUBO - MÉTODO GAND V2
// ======================================================

function calcularDificultadTotal(cubo, algoritmos) {

  const DA = dificultadAlgoritmicaTotal(algoritmos);
  const DAP = dificultadAlgoritmicaPromedio(algoritmos);

  const AB = e ** Number(cubo.difBlock);
  const AD = e ** Number(cubo.difDeform);

  const NP = obtenerCantidadParidades(cubo);

  // Fórmula V2:
  // D_T = D_A* * A_B * A_D + N_P * D_Aprom*
  return DA * AB * AD + NP * DAP;
}


// ======================================================
// BUSCAR UN MOVIMIENTO EN EL CONTADOR
// ======================================================

function encontrar(contador, elemento) {

  let x;

  for (x = 0; x < contador.length; x++) {

    if (contador[x].pasos === elemento) {
      return x;
    }
  }

  return x;
}


// ======================================================
// VER LOS DETALLES DE UN CUBO
// ======================================================

function verCubo(event) {

  const boton = event.target.closest("button");

  if (!boton) {
    return;
  }

  const index = Number(boton.dataset.index);

  if (cuboActivo === index) {

    cerrarDetalle();

  } else {

    cuboActivo = index;

    mostrarSoloFila(index);

    mostrarDetalle(index);
  }
}


// ======================================================
// MOSTRAR SOLAMENTE LA FILA SELECCIONADA
// ======================================================

function mostrarSoloFila(index) {

  const filas = document.getElementById("cuerpoTabla").rows;

  for (let i = 0; i < filas.length; i++) {

    filas[i].style.display = (i === index) ? "" : "none";
  }
}


// ======================================================
// RESTAURAR TODAS LAS FILAS
// ======================================================

function restaurarTabla() {

  const filas = document.getElementById("cuerpoTabla").rows;

  for (let i = 0; i < filas.length; i++) {

    filas[i].style.display = "";
  }
}


// ======================================================
// MOSTRAR EL DETALLE DEL CUBO
// ======================================================

function mostrarDetalle(i) {

  const cont = document.getElementById("detalleCubo");

  cont.hidden = false;

  const cubo = TablaCubos[i];
  const algs = ConjuntoAlgoritmos[i];

  const dificultadTotal = calcularDificultadTotal(cubo, algs);

  // Encabezado.
  document.getElementById("detalleHeader").innerHTML = `
    <h2>${cubo.cubo}</h2>
    <p>Piezas: ${cubo.cantPiezas}</p>
    <p>Dificultad total: ${setPrecision(dificultadTotal)} gands</p>
  `;

  // Mensaje inicial mientras se carga la descripción.
  document.getElementById("detalleContenido").textContent =
    "Cargando descripción...";

  // Botón para cerrar.
  document.getElementById("detalleFooter").innerHTML = "";

  const botonCerrar = document.createElement("button");

  botonCerrar.textContent = "Cerrar";
  botonCerrar.addEventListener("click", cerrarDetalle);

  document.getElementById("detalleFooter").appendChild(botonCerrar);

  // Cargar el JSON de descripción.
  cargarDescripcion(i);
}


// ======================================================
// CERRAR EL DETALLE
// ======================================================

function cerrarDetalle() {

  // Invalidar cualquier carga de descripción pendiente.
  solicitudDescripcion++;

  document.getElementById("detalleCubo").hidden = true;

  document.getElementById("detalleHeader").innerHTML = "";
  document.getElementById("detalleContenido").innerHTML = "";
  document.getElementById("detalleFooter").innerHTML = "";

  restaurarTabla();

  cuboActivo = null;
}


// ======================================================
// CARGAR LA DESCRIPCIÓN DEL CUBO
// ======================================================

async function cargarDescripcion(cuboId) {

  const cubo = TablaCubos[cuboId];

  const cont = document.getElementById("detalleContenido");

  // Identificador de esta solicitud.
  const solicitudActual = ++solicitudDescripcion;

  try {

    const respuesta = await fetch(cubo.descripcion);

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar la descripción.");
    }

    const elementos = await respuesta.json();

    // Si el usuario cambió de cubo mientras se descargaba,
    // no mostramos esta descripción.
    if (solicitudActual !== solicitudDescripcion) {
      return;
    }

    cont.innerHTML = "";

    let ultimoFueInline = false;
    let ultimoParrafo = null;
    let ultimoLi = null;
    let filaImagenes = null;

    for (const elemento of elementos) {

      // ----------------------------------------------
      // IMAGEN
      // ----------------------------------------------

      if (elemento.tipo === "imagen") {

        if (!filaImagenes) {

          filaImagenes = document.createElement("div");
          filaImagenes.className = "fila-imagenes";

          cont.appendChild(filaImagenes);
        }

        const img = document.createElement("img");

        img.src = elemento.contenido;
        img.alt = `Imagen de ${cubo.cubo}`;

        ultimoParrafo = null;
        ultimoLi = null;
        ultimoFueInline = false;

        filaImagenes.appendChild(img);
      }

      // ----------------------------------------------
      // TEXTO
      // ----------------------------------------------

      else if (elemento.tipo === "texto") {

        if (ultimoFueInline && ultimoParrafo) {

          ultimoParrafo.append(document.createTextNode(elemento.contenido));

        } else if (ultimoFueInline && ultimoLi) {

          ultimoLi.append(document.createTextNode(elemento.contenido));

        } else {

          const p = document.createElement("p");

          p.textContent = elemento.contenido;

          cont.appendChild(p);

          ultimoParrafo = p;
          ultimoLi = null;
        }

        ultimoFueInline = false;
      }

      // ----------------------------------------------
      // TÍTULO
      // ----------------------------------------------

      else if (elemento.tipo === "titulo") {

        const h = document.createElement("h3");

        h.textContent = elemento.contenido;

        ultimoParrafo = null;
        ultimoLi = null;
        ultimoFueInline = false;

        cont.appendChild(h);
      }

      // ----------------------------------------------
      // FÓRMULA CENTRADA
      // ----------------------------------------------

      else if (elemento.tipo === "formula") {

        const div = document.createElement("div");

        div.className = "formula";
        div.textContent = `\\[${elemento.contenido}\\]`;

        ultimoParrafo = null;
        ultimoLi = null;
        ultimoFueInline = false;

        cont.appendChild(div);
      }

      // ----------------------------------------------
      // FÓRMULA INLINE
      // ----------------------------------------------

      else if (elemento.tipo === "formulaInline") {

        const span = document.createElement("span");

        span.className = "ExplicacionFormulas";
        span.textContent = `\\(${elemento.contenido}\\)`;

        if (ultimoParrafo) {

          ultimoParrafo.appendChild(span);

        } else if (ultimoLi) {

          ultimoLi.appendChild(span);

        } else {

          cont.appendChild(span);
        }

        ultimoFueInline = true;
      }

      // ----------------------------------------------
      // LISTA
      // ----------------------------------------------

      else if (elemento.tipo === "lista") {

        const ul = document.createElement("ul");

        for (const item of elemento.contenido) {

          const li = document.createElement("li");

          li.textContent = item;

          ul.appendChild(li);

          ultimoLi = li;
        }

        ultimoParrafo = null;
        ultimoFueInline = false;

        cont.appendChild(ul);
      }

      // Una nueva fila de imágenes se crea cuando
      // se encuentra una imagen después de otro elemento.
      if (elemento.tipo !== "imagen") {
        filaImagenes = null;
      }
    }

    // Procesar todas las fórmulas juntas, una sola vez.
    if (window.MathJax && MathJax.typesetPromise) {

      await MathJax.typesetPromise([cont]);
    }

  } catch (error) {

    console.error(
      `Error al cargar la descripción de ${cubo.cubo}:`,
      error
    );

    if (solicitudActual === solicitudDescripcion) {

      cont.textContent =
        "No se pudo cargar la descripción de este cubo.";
    }
  }
}
