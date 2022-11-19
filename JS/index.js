function cargarAsientos() {
    for(let i = 1; i <= 11; i++) {
        let asientos = document.createElement('div');
        asientos.classList.add('asientos');
        // Crear cuatro asientos por fila
        for(let j = 1; j <= 4; j++) {
            let asiento = document.createElement('div');
            asiento.classList.add('asiento');
            //Agregar ID a cada asiento
            asiento.id = `asiento-${i}-${j}`;
            // Agregar imagen a asiento:
            let img = document.createElement('img');
            img.src = 'img/asiento1.png';
            img.width = '80';
            // Agregar número de asiento:
            let num = document.createElement('p');
            num.classList.add('nAsiento');
            num.innerHTML = (i * 4) - (4 - j);

            // Seleccionar número de asiento:
            asiento.onclick = function() {
                seleccionarAsiento(asiento.id);
            }

            // Agregar los asientos al contenedor:
            asiento.appendChild(img);
            asiento.appendChild(num);
            asientos.appendChild(asiento);
        }
        document.getElementById('autobus').appendChild(asientos);
    }
}


// Cargar asientos:
function indicarAsiento(id) {
    // Indicar que se seleccionó el asiento:
    document.getElementById(id).classList.add('seleccionado');
    
    // Desmarcar los demás asientos:
    for(let i = 1; i <= 11; i++) {
        for(let j = 1; j <= 4; j++) {
            // Verificar que el alemento anteriormente seleccionado no es el actual:
            if(document.getElementById(`asiento-${i}-${j}`).classList.contains('seleccionado') && document.getElementById(`asiento-${i}-${j}`).id != id) {
                document.getElementById(`asiento-${i}-${j}`).classList.remove('seleccionado');
            }
        }
    }
}


// Seleccionar elemento con clase "asiento":
function seleccionarAsiento(id) {
    // Evitar hacer click cuando un asiento tiene una clase:
    if(document.getElementById(id).classList.contains('ocupado')) {
        document.getElementById('num').value = '';
    } 
    // Si no está ocupado, seleccionar asiento:
    else {
        // Obtener I:
        let value_i = 0;
        (id.length == 12) ? value_i = id.slice(8, 10) : value_i = id.slice(8, 9);
        // Obtener J:
        let value_j = 0;
        (id.length == 12) ? value_j = id.slice(11, 12) : value_j = id.slice(10, 11);
        
        // Número de asiento:
        let numAsiento;
        numAsiento = (value_i * 4) - (4 - value_j);
        
        // Poner número de asiento en input:
        document.getElementById('num').value = numAsiento;

        // Indicar asiento seleccionado:
        indicarAsiento(id);
    }
}


// Vueltas:
let vuelta = 0;
// Agregar reservaciones:
document.getElementById('reservar').onclick = function(e) {
    // Evitar que la página se refresque con el botón:
    e.preventDefault();

    // Variables:
    let num, nombre, apellido;

    // Comprobar que los campos no estén vacíos:
    if(document.getElementById('num').value == '' || document.getElementById('nombre').value == '' || document.getElementById('apellido').value == '') {
        alert('Por favor, llene todos los campos.');
    } 
    else {
        // Variables:
        let asiento, asiento_i, asiento_j;
        // Marcar asiento como ocupado:
        asiento = document.getElementById('num').value;
        // Obtener coordenadas asiento:
        asiento_i = Math.ceil(asiento / 4);
        (asiento % 4 == 0) ? asiento_j = 4 : asiento_j = asiento % 4;
        // Asignar clase ocupado:
        document.getElementById(`asiento-${asiento_i}-${asiento_j}`).classList.add('ocupado');
        // Asignar clase último:
        document.getElementById(`asiento-${asiento_i}-${asiento_j}`).classList.add(`ultimo${vuelta}`);
        // Eliminar clase seleccionado:
        document.getElementById(`asiento-${asiento_i}-${asiento_j}`).classList.remove('seleccionado');



        // Obtener valores:
        nombre = document.getElementById('nombre').value;
        apellido = document.getElementById('apellido').value;
        num = document.getElementById('num').value;
        
        // Crear reservación:
        let reservacion = document.createElement('tr');
        // Agregar información en el renglón:
        reservacion.innerHTML = `
            <td class="reservacion-text" id="nombre_r${vuelta}">${nombre}</td>
            <td class="reservacion-text" id="apellido_r${vuelta}">${apellido}</td>
            <td class="reservacion-text" id="asiento_r${vuelta}">${num}</td>
        `;

        // Agregar botones:
        let buttons = document.createElement('td');
        let btn_area = document.createElement('form');
        buttons.classList.add('form_btns');

        // Botón de eliminar:
        let btn_del = document.createElement('input');
        btn_del.type = 'submit';
        btn_del.value = 'Eliminar';
        btn_del.classList.add('form_btn');
        btn_del.classList.add('btn-del');
        btn_del.id = `del${vuelta}`;
        btn_del.onclick = function(e) {
            // Evitar que la página se refresque con el botón:
            e.preventDefault();

            // Ir al ID del asiento:
            vuelta--;

            // Desmarcar asiento:
            let del_marca = document.getElementsByClassName(`ultimo${vuelta}`)[0];
            del_marca.classList.remove('ocupado');
            reservacion.remove();
        }
        // Botón de modificar:
        let btn_mod = document.createElement('input');
        btn_mod.type = 'submit';
        btn_mod.value = 'Modificar';
        btn_mod.id = 'modificar';
        btn_mod.classList.add('form_btn');
        btn_mod.classList.add('btn-mod');
        btn_mod.id = `mod${vuelta}`;
        btn_mod.onclick = function(e) {
            // Evitar que la página se refresque con el botón:
            e.preventDefault();
            // Modificar reservación:
            modificarReservacion(btn_mod.id);
        }

        // Agregar botones al formulario:
        btn_area.appendChild(btn_del);
        btn_area.appendChild(btn_mod);
        // Agregar formulario a la celda:
        buttons.appendChild(btn_area);
        // Agregar celda a la reservación:
        reservacion.appendChild(buttons);


        // Agregar reservación a tabla:
        document.getElementById('elements').appendChild(reservacion);

        // Fin de esta vuelta:
        vuelta++;

        // Limpiar campos:
        document.getElementById('num').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
    }
}


// Modificar reservación:
function modificarReservacion(id_btn) {
    // Variables:
    let nombre, apell, asien, id;

    // Obtener ID vuelta:
    (id_btn.length == 4) ? id = id_btn.slice(3, 4) : id = id_btn.slice(3, 5);

    // Mostrar valores en los inputs:
    nombre = document.getElementById('nombre');
    nombre.value = document.getElementById(`nombre_r${id}`).innerHTML;
    
    apell = document.getElementById('apellido');
    apell.value = document.getElementById(`apellido_r${id}`).innerHTML;

    asien = document.getElementById('num');
    asien.value = document.getElementById(`asiento_r${id}`).innerHTML;

    // Crear aviso:
    document.getElementById('aviso').classList.remove('ocultar');

    // Crear botón de confirmación:
    let btn_confirm = document.getElementById('confirmar');
    btn_confirm.classList.remove('ocultar');

    // Crear botón de cancelación:
    let btn_cancel = document.getElementById('cancelar');
    btn_cancel.classList.remove('ocultar');

    // Eliminar botón de reservación:
    document.getElementById('reservar').classList.add('ocultar');

    btn_confirm.onclick = function(e) {
        // Evitar que la página se refresque con el botón:
        e.preventDefault();

        // Obtener valores:
        nombre = document.getElementById('nombre').value;
        apellido = document.getElementById('apellido').value;
        num = document.getElementById('num').value;
        
        confirmAct(nombre, apellido, num, id);
    }

    btn_cancel.onclick = function(e) {
        // Evitar que la página se refresque con el botón:
        e.preventDefault();

        cancelAct();
    }
}

// Corregir esto del asiento indicador:
// Botones para modificaciones:
function confirmAct(nombre, apellido, asiento, id) {
    
    // Modificar reservación:
    document.getElementById(`nombre_r${id}`).innerHTML = nombre;
    document.getElementById(`apellido_r${id}`).innerHTML = apellido;
    document.getElementById(`asiento_r${id}`).innerHTML = asiento;

    // Eliminar clase ocupado del asiento anterior:
    let a_i, a_j;
    a_i = Math.ceil(asiento / 4);
    (asiento % 4 == 0) ? a_j = 4 : a_j = asiento % 4;

    // Marcar el nuevo asiento como ocupado solamente:
    if(document.getElementsByClassName('seleccionado')[0] != undefined) {
        // Eliminar clase ocupado anterior:
        let ult = document.getElementsByClassName(`ultimo${id}`)[0];
        ult.classList.remove(`ocupado`);
        ult.classList.remove(`ultimo${id}`);


        // Marcando el nuevo asiento como ocupado:
        let sel = document.getElementsByClassName('seleccionado')[0];
        sel.classList.add('ocupado');
        sel.classList.add(`ultimo${id}`);
        sel.classList.remove('seleccionado');
    }

    // Volver al menú de reservación:
    document.getElementById('reservar').classList.remove('ocultar');
    document.getElementById('confirmar').classList.add('ocultar');
    document.getElementById('cancelar').classList.add('ocultar');

    // Eliminar aviso:
    document.getElementById('aviso').classList.add('ocultar');

    // Limpiar campos:
    document.getElementById('num').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
}


function cancelAct() {
    // Limpiar campos del input:
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('num').value = '';

    // Ocultar alerta de aviso:
    document.getElementById('aviso').classList.add('ocultar');

    // Ocultar los botones:
    document.getElementById('confirmar').classList.add('ocultar');
    document.getElementById('cancelar').classList.add('ocultar');

    // Mostrar botón de reservación:
    document.getElementById('reservar').classList.remove('ocultar');

    // Eliminar la clase seleccionado:
    if(document.getElementsByClassName('seleccionado') != undefined) {
        document.getElementsByClassName('seleccionado')[0].classList.remove('seleccionado');
    }
}