export class Filtro {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.data = this.imageData.data;
    }

    devolverImagen(e) { // metodo usado frecuentemente
        return this.ctx.putImageData(this.imageData, 0, 0);
    }

    sepia() {
        for (let i = 0; i < this.data.length; i += 4) {
            let red = this.data[i];
            let green = this.data[i + 1];
            let blue = this.data[i + 2];

            // Fórmula para el filtro sepia con valores preestablecidos
            let nuevoRojo = 0.393 * red + 0.769 * green + 0.189 * blue;
            let nuevoVerde = 0.349 * red + 0.686 * green + 0.168 * blue;
            let nuevoAzul = 0.272 * red + 0.534 * green + 0.131 * blue;

            // Establece los componentes de color según los nuevos valores
            this.data[i] = Math.min(255, nuevoRojo);
            this.data[i + 1] = Math.min(255, nuevoVerde);
            this.data[i + 2] = Math.min(255, nuevoAzul);
        }
        this.devolverImagen();
    }

    negativo() {
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                let index = (x + y * this.canvas.width) * 4;
                this.data[index] = 255 - this.data[index];
                this.data[index + 1] = 255 - this.data[index + 1];
                this.data[index + 2] = 255 - this.data[index + 2];
            }
        }
        this.devolverImagen();
    }

    binarizacion() {
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                let index = (x + y * this.canvas.width) * 4;
                let r = this.data[index];
                let g = this.data[index + 1];
                let b = this.data[index + 2];
                let gris = (r + g + b) / 3;
                let valor = 0;

                if (gris > 128)
                    valor = 255; //si el color esta mas cerca de 255 el valor es 255
                else
                    valor = 0; //si el color esta mas cerca de 0 el valor es 0

                this.data[index] = valor;
                this.data[index + 1] = valor;
                this.data[index + 2] = valor;
            }
        }
        this.devolverImagen();
    }

    filtroBYN() {

        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {

                let index = (x + y * this.canvas.width) * 4;

                let r = this.data[index];
                let g = this.data[index + 1];
                let b = this.data[index + 2];

                let prom = Math.floor((r + g + b) / 3);

                this.data[index] = prom;
                this.data[index + 1] = prom;
                this.data[index + 2] = prom;
            }
        }
        this.devolverImagen();
    }

    brillo(valor) {

        for (let i = 0; i < this.data.length; i += 4) {
            this.data[i] = this.limitar (this.data[i] + valor);
            this.data[i + 1] = this.limitar (this.data[i + 1] + valor);
            this.data[i + 2] = this.limitar (this.data[i + 2] + valor);
        }
        this.devolverImagen();
    }

    saturacion(valor) {

        // Constantes para aplicar el filtro de saturación
        const rw = 0.3086;
        const gw = 0.6094;
        const bw = 0.0820;

        for (let i = 0; i < this.data.length; i += 4) {
            let r = this.data[i];
            let g = this.data[i + 1];
            let b = this.data[i + 2];

            let gris = r * rw + g * gw + b * bw;

            this.data[i] = this.limitar(gris + (r - gris) * (1 + valor));
            this.data[i + 1] = this.limitar(gris + (g - gris) * (1 + valor));
            this.data[i + 2] = this.limitar(gris + (b - gris) * (1 + valor));
        }
        this.devolverImagen();
    }

    limitar(valor) { // funcion para controlar que los valores se mantengan entre 0 y 255
        return Math.min(255, Math.max(0, valor));
    }

    desenfoque() {
        let copiaImageData = this.ctx.createImageData(canvas.width, canvas.height);

        let kernel = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];

        let kernelSize = 3;
        let offsetIndex;

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {

                let index = (x + y * this.canvas.width) * 4;
                let sumR = 0;
                let sumG = 0;
                let sumB = 0;

                let valorKernel;
                for (let i = 0; i < kernelSize; i++) {
                    for (let j = 0; j < kernelSize; j++) {

                        let offsetX = x + i - Math.floor(kernelSize / 2);
                        let offsetY = y + j - Math.floor(kernelSize / 2);

                        // Verificación de límites (para no salir del canvas)
                        offsetIndex = (offsetX + offsetY * this.canvas.width) * 4;
                        valorKernel = kernel[i][j];

                        sumR += this.data[offsetIndex] * kernel[i][j];
                        sumG += this.data[offsetIndex + 1] * kernel[i][j];
                        sumB += this.data[offsetIndex + 2] * kernel[i][j];
                    }
                }

                copiaImageData.data[index] = sumR / 9;
                copiaImageData.data[index + 1] = sumG / 9;
                copiaImageData.data[index + 2] = sumB / 9;
                copiaImageData.data[index + 3] = 255;
            }
        }

        this.ctx.putImageData(copiaImageData, 0, 0);
    }

    deteccionBordes() {
        let copiaImageData = this.ctx.createImageData(canvas.width, canvas.height);
        let kernelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        let kernelY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];
        let kernelSize = 3;

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {

                let magX = 0; // acumulo gradiente en x
                let magY = 0; // acumulo gradiente en y

                for (let i = 0; i < kernelSize; i++) {
                    for (let j = 0; j < kernelSize; j++) {

                        let nx = x + j - 1; // cordenada en x del pixel vencino
                        let ny = y + i - 1; // cordenada en y del pixel vencino

                        if (nx >= 0 && nx < this.canvas.width && ny >= 0 && ny < this.canvas.height) {
                            let neighborIndex = (ny * this.canvas.width + nx) * 4;

                            // Para detección de bordes primero convertimos a gris
                            let r = this.data[neighborIndex];
                            let g = this.data[neighborIndex + 1];
                            let b = this.data[neighborIndex + 2];
                            let intensidad = (r * 0.3 + g * 0.59 + b * 0.11);

                            magX += intensidad * kernelX[i][j];
                            magY += intensidad * kernelY[i][j];
                        }
                    }
                }
                
                // Calculo de la magnitud del gradiente (Pitágoras)
                let magnitud = Math.sqrt(magX * magX + magY * magY);
                let index = (y * this.canvas.width + x) * 4;
                
                // Se modificaca cada componente del pixel para que solo se muestre el borde
                
                let factor = magnitud / 100; // Se calcula un factor a partir de la marnitud para que el borde no sea solo blanco
                copiaImageData.data[index] = Math.min(255, this.data[index] * factor);
                copiaImageData.data[index + 1] = Math.min(255, this.data[index + 1] * factor);
                copiaImageData.data[index + 2] = Math.min(255, this.data[index + 2] * factor);
                copiaImageData.data[index + 3] = 255;
            }
        }
        this.ctx.putImageData(copiaImageData, 0, 0);
    }

    aberracionCromatica() {

        let copiaData = new Uint8ClampedArray(this.data); // Copia del arreglo de pixeles

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                let index = (y * this.canvas.width + x) * 4;

                // Rojo: Desplazado a la izquierda
                let rX = x - 7;
                if (rX >= 0) {
                    let rIndex = (y * this.canvas.width + rX) * 4;
                    this.data[index] = copiaData[rIndex];
                }

                // Azul: Desplazado a la derecha
                let bX = x + 7;
                if (bX < this.canvas.width) {
                    let bIndex = (y * this.canvas.width + bX) * 4;
                    this.data[index + 2] = copiaData[bIndex + 2];
                }
            }
        }
        this.devolverImagen();
    }

    pixelar() {
        let tamañoBloque = 8;
        // Cambia el recorrido de la imagen por bloques
        for (let y = 0; y < this.canvas.height; y += tamañoBloque) {
            for (let x = 0; x < this.canvas.width; x += tamañoBloque) {

                // Me quedo con el pixel central de cada bloque
                let centroX = x + Math.floor(tamañoBloque / 2);
                let centroY = y + Math.floor(tamañoBloque / 2);

                // Para que el centro no se salga de la imagen
                if (centroX < this.canvas.width && centroY < this.canvas.height) {
                    let index = (centroY * this.canvas.width + centroX) * 4;

                    //Obtengo el color de ese píxel central
                    let r = this.data[index];
                    let g = this.data[index + 1];
                    let b = this.data[index + 2];
                    let a = this.data[index + 3];

                    // Se pinta todo el bloque con ese mismo color
                    for (let iy = 0; iy < tamañoBloque; iy++) {
                        for (let ix = 0; ix < tamañoBloque; ix++) {

                            let px = x + ix;
                            let py = y + iy;

                            if (px < this.canvas.width && py < this.canvas.height) {
                                let nIndx = (py * this.canvas.width + px) * 4;
                                this.data[nIndx] = r;
                                this.data[nIndx + 1] = g;
                                this.data[nIndx + 2] = b;
                                this.data[nIndx + 3] = a;
                            }
                        }
                    }
                }
            }
        }
        this.devolverImagen();
    }
}