'use strict';

import { Filtro } from './Filtro.js';
import { Pencil } from './Pencil.js';

/** @type { HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
/** @type { CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d', { willReadFrequently: true });

window.addEventListener('DOMContentLoaded', main);

//------ Capturador botones de herramientas --------------------
const pencilBtn = document.getElementById('lapiz');
const eraserBtn = document.getElementById('goma');
const clearBtn = document.getElementById('limpiar');
const colorInput = document.getElementById('color');
const sizeInput = document.getElementById('espesor');
const limpiar = document.getElementById('borrarTodo');
const bienvenida = document.getElementById('bienvenida');

//------ Capturador botones de imagen ------------------------
const imagenCargada = document.getElementById('cargarImagen');
const btnCargar = document.getElementById('btnCargar');
const btnIniciarCarga = document.getElementById('btnIniciarCarga');
const btnGuardar = document.getElementById('btnGuardar');

//------ Capturador botones de filtros ------------------------
const filtroBlur = document.getElementById('blur');
const filtroBYN = document.getElementById('byn');
const filtroBinarizado = document.getElementById('binarizacion');
const filtroSepia = document.getElementById('sepia');
const filtroInvertir = document.getElementById('invertir');
const filtroBordes = document.getElementById('bordes');
const filtroAberracion = document.getElementById('aberracion');
const filtroPixel = document.getElementById('pixelArt');
const reducirBrillo = document.getElementById('reducirBri');
const aumentarBrillo = document.getElementById('aumentarBri');
const reducirSaturacion = document.getElementById('reducirSat');
const aumentarSaturacion = document.getElementById('aumentarSat');


// --------------------------------------------------
// Programa principal
// --------------------------------------------------

canvas.width = 1024;
canvas.height = 700;
let color = colorInput.value;
let estilo = sizeInput.value;
let mouseDown = false;
let herramientaSelecc = false; // saber si hay lapiz o goma clickeados
let lapiz = false; // para diferenciar entre lapiz y goma
let herramienta = null;


imagenCargada.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) { // funcion para cargar la imagen seleccionada al canvas
            const img = new Image();
            img.onload = function () { //
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // dibuja la imagen ajustada al tamaño del canvas
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    e.target.value = '';// con esto limpio el arreglo para poder cargar una nueva imagen si lo deseo
}); // metodo para cargar la imagen al canvas desde un archivo de manera local

// --------------------------------------------------
// Comportamiento del mouse
// --------------------------------------------------

canvas.addEventListener("mousedown", function (e) {
    mouseDown = true;
    if (herramientaSelecc) {
        let posX = e.offsetX;
        let posY = e.offsetY;
        herramienta = new Pencil(posX, posY, color, estilo);
        herramienta.draw(ctx);
    } // instancia un nuevo Pencil que puede ser un lapiz o goma dependiendo la selección del usuario
}); // mousedown

canvas.addEventListener("mousemove", function (e) {
    if (mouseDown && herramientaSelecc && herramienta != null) {
        let posX = e.offsetX;
        let posY = e.offsetY;
        herramienta.moveTo(posX, posY);
        herramienta.draw(ctx);
    } // mueve el lapiz o goma por el canvas mientras el mouse este presionado y se haya seleccionado una de las herramientas
}); // mousemove

canvas.addEventListener("mouseup", function (e) {
    mouseDown = false;
}); // mouseup

// --------------------------------------------------
// comportamiento de los botones
// --------------------------------------------------

// ---------Botones de lapiz y goma-----------------
pencilBtn.addEventListener("click", function () {
    herramientaSelecc = true;
    color = colorInput.value;
    lapiz = true; // diferencio con la goma para poder cambiar de color dinamicamente con el input de color
    pencilBtn.classList.add('active');
    eraserBtn.classList.remove('active');
});

eraserBtn.addEventListener("click", function () {
    estilo = sizeInput.value;
    herramientaSelecc = true;
    lapiz = false; // para diferenciar con el lapiz y asi solo usa color blanco (sin poder cambiarlo) para simular que borra
    color = "white";
    eraserBtn.classList.add('active');
    pencilBtn.classList.remove('active');
});

colorInput.addEventListener('input', function () {
    if (lapiz)
        color = colorInput.value;
}); // actualiza el color cada vez que cambia el input color solo si esta seleccionado el lápiz

sizeInput.addEventListener('input', function () {
    estilo = sizeInput.value;
}); // actualiza el tamano cada vez que cambia el input de tamaño

//---------------------------------------------
// ---------Botones de filtros-----------------
//---------------------------------------------

/* Como los filtros se encuentran como funciones de la clase Filtros el evento de hacer click lo que hace en cada caso es
instanciar un nuevo filtro y llama a la funcion del filtro correspondiente*/

filtroSepia.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.sepia();
}); // sepia

filtroBinarizado.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.binarizacion();
}); // binarización

filtroInvertir.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.negativo();
}); // invertir colores

filtroBYN.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.filtroBYN();
}); //  filtroBYN

filtroBlur.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.desenfoque();
}); // blur

filtroBordes.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.deteccionBordes();
}); // detección de bordes

filtroAberracion.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.aberracionCromatica();
}); // aberracion cromática

filtroPixel.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.pixelar();
}); // pixelArt

// Botones para midificar brillo
reducirBrillo.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.brillo(-10);
});

aumentarBrillo.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.brillo(10);
});

// Botones para modificar saturación
reducirSaturacion.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.saturacion(-0.3);
});

aumentarSaturacion.addEventListener('click', () => {
    let filtro = new Filtro(canvas, ctx);
    filtro.saturacion(0.3);
});

//---------------------------------------------
// -------Botones de modal limpiar canvas------
//---------------------------------------------
clearBtn.addEventListener("click", () => {
    limpiar.showModal();
}); // abre el modal para confirmar si se quiere limpiar el canvas

document.getElementById('btnConfirmar').addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    limpiar.close();
}); // borrar el canvas y cerrar el modal

document.getElementById('btnCancelar').addEventListener("click", () => {
    limpiar.close();
}); // cierra el modal sin borrar el canvas

//-----------------------------------------------------------
// -------Botones de modal bienvenida y carga de imágenes----
//-----------------------------------------------------------

btnCargar.addEventListener('click', () => {
    imagenCargada.click();
}); // uso de un boton para abrir el selector de archivos y cargar una imagen al canvas

btnGuardar.addEventListener('click', () => {
    const dataURL = canvas.toDataURL("image/jpeg");
    const descarga = document.createElement('a');
    descarga.download = "Creado con PaintPro.jpeg";
    descarga.href = dataURL;
    descarga.click();
});// funcion de guardado en formato jpeg cuando se oprime el botón guardar

btnIniciarCarga.addEventListener('click', () => {
    imagenCargada.click();
    bienvenida.close();
}); // uso de un boton para abrir el selector de archivos desde el modal de inicio

document.getElementById('btnEnBlanco').addEventListener("click", () => {
    bienvenida.close();
}); // cierra el modal y comienza el lienzo en blanco

function main() {
    bienvenida.showModal();
};// se muestra un modal de bienvenida para elegir entre lienzo en blanco o cargar una imagen










