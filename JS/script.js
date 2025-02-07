var registrosXPagina = 10;
var paginaActual = 1;
var filaEditando = null;

let table; //let no se inicializa hasta que se ejecuta su declaracion

//inicializar DataTable
$(document).ready(function() {
    if (!$.fn.dataTable.isDataTable('#tabla')) {
        table = $('#tabla').DataTable();
    }

    cargarDatosTabla();
});

function agregarFila(nombreCientifico, nombreComun, habitat, descripcion, imagenURL, estado){
    let table = $('#tabla').DataTable();

    let botonEditar = `<button class="btn btn-warning btn-sm editar"><i class="fa-solid fa-pencil"></i></button>`;
    let botonEliminar = `<button class="btn btn-danger btn-sm eliminar"><i class="fa-solid fa-trash"></i></button>`;
    let imagenHTML = imagenURL ? `<img src="${imagenURL}" style="width:50px;">` : 'No imagen';

    let nuevaFila = table.row.add([
        nombreCientifico,
        nombreComun,
        habitat,
        descripcion,
        imagenHTML,
        estado,
        `${botonEditar} ${botonEliminar}`
    ]).draw().node(); //reflejar fila agregada en la tabla

    $(nuevaFila).addClass('fade-in-down'); //animacion fade-in-down cada vez que se inserte una especie

    $(nuevaFila).find('.eliminar').on('click', function(){
        let confirmarEliminar = confirm("¿Estás seguro de que quieres eliminar este registro?");
        if(confirmarEliminar){
            fila.addClass('fade-out'); //animacion fade-out cada vez que se elimina una especie
            setTimeout(() => { //tiempo de espera de ejecucion luego de ver la animacion
                table.row($(this).parents("tr")).remove().draw();
                guardarDatosTabla();
            }, 500);
        }
    });

    $(nuevaFila).find('.editar').on('click', function() {
        filaEditando = $(this).closest('tr');
        let datosFila = table.row(filaEditando).data();

        document.getElementById('nombreCientifico').value = datosFila[0];
        document.getElementById('nombreComun').value = datosFila[1];
        document.getElementById('habitat').value = datosFila[2];
        document.getElementById('descripcion').value = datosFila[3];

        let estadoTexto = datosFila[5].trim();
        let radiosEstado = document.querySelectorAll('input[name="estado"]');
        radiosEstado.forEach(radio => {
            radio.checked = radio.value.trim() === estadoTexto; //obtener el valor del radio button
        });

        $('#guardarEdicion').show();
        $('#cancelarEdicion').show();
        $('#agregarEspecie').hide();

        filaEditando.addClass('fade-in-left'); //animacion fade-in-left cada vez que se edita un registro
    });
    guardarDatosTabla();
}

document.getElementById('guardarEdicion').addEventListener('click', function(event) {
    event.preventDefault();

    if (!filaEditando) return;

    let imagen = document.getElementById('imagen');
    let imagenURL = filaEditando.find('td:eq(4) img').attr('src');

    if (imagen.files.length > 0) {
        let file = imagen.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            actualizarFila(e.target.result);
        };
    } else {
        actualizarFila(imagenURL);
    }

    function actualizarFila(nuevaImagenURL) {
        let table = $('#tabla').DataTable();
        
        let nuevaFila = [
            document.getElementById('nombreCientifico').value.trim(),
            document.getElementById('nombreComun').value.trim(),
            document.getElementById('habitat').value,
            document.getElementById('descripcion').value.trim(),
            `<img src="${nuevaImagenURL}" style="width:50px;">`,
            document.querySelector('input[name="estado"]:checked').value,
            '<button class="btn btn-warning btn-sm editar"><i class="fa-solid fa-pencil"></i></button> <button class="btn btn-danger btn-sm eliminar"><i class="fa-solid fa-trash"></i></button>'
        ];
    
        let rowIndex = table.row(filaEditando).index(); //obtener indice numerico de la fila
        table.row(rowIndex).data(nuevaFila).draw(); //reflejar cambios
    
        $('#tabla tbody').off('click', '.editar').on('click', '.editar', function() {
            filaEditando = $(this).closest('tr');
            let datosFila = table.row(filaEditando).data();
    
            document.getElementById('nombreCientifico').value = datosFila[0];
            document.getElementById('nombreComun').value = datosFila[1];
            document.getElementById('habitat').value = datosFila[2];
            document.getElementById('descripcion').value = datosFila[3];
    
            let estadoTexto = datosFila[5].trim();
            let radiosEstado = document.querySelectorAll('input[name="estado"]');
            radiosEstado.forEach(radio => {
                radio.checked = radio.value.trim() === estadoTexto;
            });
    
            $('#guardarEdicion').show();
            $('#cancelarEdicion').show();
            $('#agregarEspecie').hide();
        });
    
        $('#tabla tbody').off('click', '.eliminar').on('click', '.eliminar', function() {
            table.row($(this).parents('tr')).remove().draw();
        });

        filaEditando = null;
        document.getElementById('formEspecie').reset();
        $('#guardarEdicion').hide();
        $('#cancelarEdicion').hide();
        $('#agregarEspecie').show();
    }
});

document.getElementById('cancelarEdicion').addEventListener('click', function(event) {
    event.preventDefault();

    filaEditando = null;
    document.getElementById('formEspecie').reset();
    $('#guardarEdicion').hide();
    $('#cancelarEdicion').hide();
    $('#agregarEspecie').show();
});


document.getElementById('agregarEspecie').addEventListener('click', function(event) {
    event.preventDefault();

    let valido = true;
    let nombreCientifico = document.getElementById('nombreCientifico').value.trim();
    let nombreComun = document.getElementById('nombreComun').value.trim();
    let habitat = document.getElementById('habitat').value;
    let descripcion = document.getElementById('descripcion').value.trim();
    let imagen = document.getElementById('imagen');
    let estado = document.querySelector('input[name="estado"]:checked');

    let errorNombreCientifico = document.getElementById("errorNombreCientifico");
    let errorNombreComun = document.getElementById("errorNombreComun");
    let errorDescripcion = document.getElementById("errorDescripcion");
    let errorImagen = document.getElementById("errorImagen");

    if(nombreCientifico){
        let table = $('#tabla').DataTable();
        let nombreExiste = false;

        table.rows().every(function(){
            let data = this.data();
            if(data[0].toLowerCase() === nombreCientifico.toLowerCase()){
                nombreExiste = true;
            }
        });

        if(nombreExiste){
            errorNombreCientifico.innerText="El nombre científico ingresado ya existe";
            return;
        }else{
            if(!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreCientifico)){
                errorNombreCientifico.innerText="Nombre científico inválido, no puede contener números";
                valido = false;
            }else{
                errorNombreCientifico.innerText="Nombre científico ingresado correctamente";
            }
        }
    }else{
        errorNombreCientifico.innerText="Por favor ingrese el nombre científico";
        valido = false;
    }

    if(nombreComun){
        if(!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreComun)){
            errorNombreComun.innerText="Nombre común inválido, no puede contener números";
            valido = false;
        }else{
            errorNombreComun.innerText="Nombre común ingresado correctamente";
        }
    }else{
        errorNombreComun.innerText="Por favor ingrese el nombre común";
        valido = false;
    }

    if(descripcion){
        if(descripcion.length > 250){
            errorDescripcion.innerText="Descripción inválida, máximo 250 caracteres";
            valido = false;
        }else{
            errorDescripcion.innerText="Descripción ingresada correctamente";
        }
    }else{
        errorDescripcion.innerText="Por favor ingrese una descripción";
        valido = false;
    }

    if(imagen.files.length > 0){
        let file = imagen.files[0];
        const validTypes = ["image/jpeg", "image/png"];
        if(!validTypes.includes(file.type)){
            errorImagen.innerText="Formato inválido. Solo se permiten imágenes tipo JPG y PNG";
            valido = false;
        }else if(file.size > 2 * 1024 * 1024){
            errorImagen.innerText="El archivo no puede superar los 2MB";
            valido = false;
        }else{
            errorImagen.innerText="Imagen ingresada correctamente";
        }
    }else{
        errorImagen.innerText="Por favor ingrese una imagen";
        valido = false;
    }

    if(!valido){
        return;
    }
    
    let imagenURL = '';
    if (imagen.files.length > 0) {
        let file = imagen.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            if(filaEditando){
                $('#tabla').DataTable().row(filaEditando).remove().draw();
                filaEditando = null;
            }
            agregarFila(nombreCientifico, nombreComun, habitat, descripcion, e.target.result, estado.value);
            limpiarFormulario();
        };
    } else {
        if(filaEditando){
            $('#tabla').DataTable().row(filaEditando).remove().draw();
            filaEditando = null;
        }
        agregarFila(nombreCientifico, nombreComun, habitat, descripcion, imagenURL, estado.value);
        limpiarFormulario();
    }
});

document.getElementById('cancelarEdicion').addEventListener('click', function(){
    limpiarFormulario();
    filaEditando = null;
});

function limpiarFormulario(){
    document.getElementById('formEspecie').reset();
    document.getElementById('cancelarEdicion').style.display = 'none';
}

document.getElementById('exportarCSV').addEventListener('click', function(){
    exportarCSV();
});

function descargarCSV(csv, filename){
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function exportarCSV(filename){
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for(var i=0; i<rows.length; i++){
        var row = [], cols = rows[i].querySelectorAll("td, th"); //selecionar todas las celdas dentro de la fila actual

        for(var j=0; j<cols.length; j++){
            row.push(cols[j].innerText); //obtiene el texto de la celda
        }
        csv.push(row.join(",")); //une los valores de las filas con comas
    }
    descargarCSV(csv.join("\n"), filename);
}

function guardarDatosTabla(){
    let table = $('#tabla').DataTable();
    let datos = [];

    table.rows().every(function () {
        let data = this.data();
        if (data && data.length > 0) { //verifica que data no este vacio
            datos.push(data); //si la fila tiene datos, agrega el array datos
        }
    });

    if (datos.length > 0) {
        localStorage.setItem('datosTabla', JSON.stringify(datos)); //almacena el array en cadena de texto JSON
    }
}

function cargarDatosTabla(){
    let datos = localStorage.getItem('datosTabla');

    if(datos){
        let table = $('#tabla').DataTable();
        let datosParseados = JSON.parse(datos); //convierte la cadena en un objeto o array

        datosParseados.forEach(fila => {
            agregarFila(fila[0], fila[1], fila[2], fila[3], fila[4].includes('img') ? fila[4].match(/src="([^"]+)"/)[1] : '', fila[5]);
        });

        $('#tabla tbody').off('click', '.editar').on('click', '.editar', function() {
            filaEditando = $(this).closest('tr');
            let datosFila = table.row(filaEditando).data();

            document.getElementById('nombreCientifico').value = datosFila[0];
            document.getElementById('nombreComun').value = datosFila[1];
            document.getElementById('habitat').value = datosFila[2];
            document.getElementById('descripcion').value = datosFila[3];

            let estadoTexto = datosFila[5].trim();
            let radiosEstado = document.querySelectorAll('input[name="estado"]');
            radiosEstado.forEach(radio => {
                radio.checked = radio.value.trim() === estadoTexto;
            });

            $('#guardarEdicion').show();
            $('#cancelarEdicion').show();
            $('#agregarEspecie').hide();
        });

        $('#tabla tbody').off('click', '.eliminar').on('click', '.eliminar', function() {
            let confirmarEliminar = confirm("¿Estás seguro de que quieres eliminar este registro?");
            if(confirmarEliminar){
                table.row($(this).parents("tr")).remove().draw();
                guardarDatosTabla();
            }
        });
    }
}

$(document).ready(function(){
    cargarDatosTabla();
});

function actualizarGrafico() {
    let table = $('#tabla').DataTable();
    let especiesPorHabitat = {};

    table.rows().every(function() {
        let data = this.data();
        let habitat = data[2];

        if (especiesPorHabitat[habitat]) {
            especiesPorHabitat[habitat]++;
        } else {
            especiesPorHabitat[habitat] = 1;
        }
    });

    let etiquetas = Object.keys(especiesPorHabitat); //obtiene los nombres de los habitats
    let cantidades = Object.values(especiesPorHabitat); //obtiene la cantidad de especies por habitat

    var ctx = document.getElementById('graficoBarras').getContext('2d'); //crea un grafico de barras en 2d
    if(window.chartBarras){
        window.chartBarras.destroy(); //si ya hay un grafico creado, lo destruye para crear/actualizar otro
    }
    window.chartBarras = new Chart(ctx, {
        type: 'bar', //tipo de grafico de barras
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Cantidad de Especies',
                data: cantidades,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, //hace que el grafico sea responsivo
            scales: {
                y: {
                    beginAtZero: true //evita que el eje y comience desde un valor mayor al minimo
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    actualizarGrafico();
});

$('#tabla').on('draw.dt', function() {
    actualizarGrafico();
});
