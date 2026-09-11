document.addEventListener('DOMContentLoaded', () => {
    const tablaItems = document.getElementById('itemsCarrito');
    const inputCupon = document.getElementById('codigoCupon');
    const btnAplicarCupon = document.getElementById('btnAplicarCupon');
    const elemSubtotal = document.getElementById('subtotal');
    const elemDescuento = document.getElementById('descuento');
    const elemTotal = document.getElementById('total');
    const btnVaciar = document.querySelector('.btn-vaciar');
    const btnConfirmar = document.querySelector('.btn-confirmar');

    let porcentajeDescuento = 0;

    const CARRITO_KEY = 'carritoMilSabores';

    // Lista de cupones válidos
    const cuponesValidos = {
        'FELICES50': 0.50, // 50% de descuento
        'DULCE10': 0.10,   // 10% de descuento
        'MILSABORES': 0.15  // 15% de descuento
    };

    function extraerNumero(texto) {
        return parseInt(texto.replace(/[^0-9]/g, '')) || 0;
    }

    function formatearCLP(numero) {
        return `$${numero.toLocaleString('es-CL')} CLP`;
    }

    function obtenerCarrito() {
        try {
            return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function escaparHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto || '';
        return div.innerHTML;
    }

    function crearFila(item) {
        return `
            <tr data-codigo="${item.codigo}" data-mensaje="${escaparHtml(item.mensaje)}">
                <td class="prod-nombre">${escaparHtml(item.nombre)}</td>
                <td class="prod-mensaje">${item.mensaje ? `"${escaparHtml(item.mensaje)}"` : '-'}</td>
                <td class="prod-precio">${formatearCLP(item.precio)}</td>
                <td>
                    <input type="number" value="${item.cantidad}" min="1" class="campo-cantidad">
                </td>
                <td class="prod-subtotal">${formatearCLP(item.precio * item.cantidad)}</td>
                <td>
                    <button type="button" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>
        `;
    }

    function guardarCarritoDesdeDOM() {
        const carrito = [];
        tablaItems.querySelectorAll('tr').forEach(fila => {
            if (fila.querySelector('.carrito-vacio')) return;
            carrito.push({
                codigo: fila.dataset.codigo || '',
                nombre: fila.querySelector('.prod-nombre').textContent,
                precio: extraerNumero(fila.querySelector('.prod-precio').textContent),
                mensaje: fila.dataset.mensaje || '',
                cantidad: parseInt(fila.querySelector('.campo-cantidad').value) || 1
            });
        });
        localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    }

    function cargarCarrito() {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            tablaItems.innerHTML = '';
            verificarCarritoVacio();
        } else {
            tablaItems.innerHTML = carrito.map(crearFila).join('');
        }
        actualizarTotales();
    }

    function actualizarTotales() {
        let subtotalGeneral = 0;
        const filas = tablaItems.querySelectorAll('tr');

        if (filas.length === 0 || (filas.length === 1 && filas[0].querySelector('.carrito-vacio'))) {
            elemSubtotal.innerHTML = '<strong>$0 CLP</strong>';
            elemDescuento.innerHTML = '<strong>$0 CLP</strong>';
            elemTotal.textContent = '$0 CLP';
            return;
        }

        filas.forEach(fila => {
            const elemPrecio = fila.querySelector('.prod-precio');
            const elemCantidad = fila.querySelector('.campo-cantidad');
            const elemSubtotalFila = fila.querySelector('.prod-subtotal');

            if (elemPrecio && elemCantidad && elemSubtotalFila) {
                const precio = extraerNumero(elemPrecio.textContent);
                const cantidad = parseInt(elemCantidad.value) || 1;
                const subtotalFila = precio * cantidad;

                elemSubtotalFila.textContent = formatearCLP(subtotalFila);
                subtotalGeneral += subtotalFila;
            }
        });

        const montoDescuento = Math.round(subtotalGeneral * porcentajeDescuento);
        const totalPagar = subtotalGeneral - montoDescuento;

        elemSubtotal.innerHTML = `<strong>${formatearCLP(subtotalGeneral)}</strong>`;
        elemDescuento.innerHTML = `<strong>${formatearCLP(montoDescuento)}</strong>`;
        elemTotal.textContent = formatearCLP(totalPagar);
    }

    function verificarCarritoVacio() {
        const filas = tablaItems.querySelectorAll('tr');
        if (filas.length === 0) {
            tablaItems.innerHTML = `
                <tr>
                    <td colspan="6" class="carrito-vacio" style="text-align: center; padding: 25px; color: #777;">
                        Tu carrito está vacío 
                    </td>
                </tr>
            `;
        }
    }

    tablaItems.addEventListener('input', (e) => {
        if (e.target.classList.contains('campo-cantidad')) {
            if (e.target.value < 1 || isNaN(e.target.value)) {
                e.target.value = 1;
            }
            actualizarTotales();
            guardarCarritoDesdeDOM();
        }
    });

    tablaItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const fila = e.target.closest('tr');
            if (fila) {
                fila.remove();
                verificarCarritoVacio();
                actualizarTotales();
                guardarCarritoDesdeDOM();
            }
        }
    });

    if (btnAplicarCupon) {
        btnAplicarCupon.addEventListener('click', () => {
            const codigo = inputCupon.value.trim().toUpperCase();

            if (cuponesValidos.hasOwnProperty(codigo)) {
                porcentajeDescuento = cuponesValidos[codigo];
                alert(`¡Cupón "${codigo}" aplicado con éxito! (${porcentajeDescuento * 100}% de descuento)`);
            } else if (codigo === '') {
                alert('Por favor, ingresa un código de descuento.');
            } else {
                porcentajeDescuento = 0;
                alert('El código promocional ingresado no es válido.');
            }

            actualizarTotales();
        });
    }

    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            const filas = tablaItems.querySelectorAll('tr');
            if (filas.length === 0 || filas[0].querySelector('.carrito-vacio')) {
                alert('El carrito ya está vacío.');
                return;
            }

            if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
                tablaItems.innerHTML = '';
                porcentajeDescuento = 0;
                if (inputCupon) inputCupon.value = '';
                verificarCarritoVacio();
                actualizarTotales();
                localStorage.setItem(CARRITO_KEY, JSON.stringify([]));
            }
        });
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            const filas = tablaItems.querySelectorAll('tr');
            if (filas.length === 0 || filas[0].querySelector('.carrito-vacio')) {
                alert('No tienes productos en tu carrito para realizar el pedido.');
                return;
            }

            const totalPagar = elemTotal.textContent;
            alert(`¡Gracias por tu compra en Pastelería Mil Sabores!\nTu pedido por ${totalPagar} ha sido registrado exitosamente.`);
            
            tablaItems.innerHTML = '';
            porcentajeDescuento = 0;
            if (inputCupon) inputCupon.value = '';
            verificarCarritoVacio();
            actualizarTotales();
            localStorage.setItem(CARRITO_KEY, JSON.stringify([]));
        });
    }

    cargarCarrito();
});