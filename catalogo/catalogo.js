let categoriaActual = 'Todas';

const CARRITO_KEY = 'carritoMilSabores';

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

function agregarAlCarrito(producto, mensaje) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.codigo === producto.codigo && item.mensaje === mensaje);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            mensaje: mensaje || '',
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
}

function renderizarProductos(lista) {
    const contenedor = document.getElementById('contenedorProductos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = `<p class="mensaje-vacio">No se encontraron productos que coincidan con tu búsqueda.</p>`;
        return;
    }

    lista.forEach(p => {
        contenedor.innerHTML += `
            <article class="tarjeta-producto" data-codigo="${p.codigo}">
                <span class="badge-categoria">${p.categoria}</span>
                <h3 class="tarjeta-titulo">${p.nombre}</h3>
                <p class="tarjeta-descripcion">${p.descripcion}</p>
                <p class="tarjeta-precio"><strong>$${p.precio.toLocaleString('es-CL')} CLP</strong></p>
                
                <div class="campo-personalizacion">
                    <label for="msj-${p.codigo}">Mensaje personalizado:</label>
                    <input type="text" id="msj-${p.codigo}" placeholder="Ej: ¡Feliz Cumpleaños!">
                </div>

                <button type="button" class="btn-anadir">Añadir al Carrito</button>
            </article>
        `;
    });
}

function filtrarCategoria(cat, e) {
    categoriaActual = cat;
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
    if (e && e.target) e.target.classList.add('active');
    aplicarFiltros();
}

function aplicarFiltros() {
    const input = document.getElementById('inputBuscar');
    const texto = input ? input.value.toLowerCase() : '';
    
    if (typeof productos === 'undefined') return;

    const filtrados = productos.filter(p => {
        const matchesCat = (categoriaActual === 'Todas' || p.categoria === categoriaActual);
        const matchesText = p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto);
        return matchesCat && matchesText;
    });
    
    renderizarProductos(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('inputBuscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', aplicarFiltros);
    }

    const contenedor = document.getElementById('contenedorProductos');
    if (contenedor) {
        contenedor.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-anadir')) return;

            const tarjeta = e.target.closest('.tarjeta-producto');
            if (!tarjeta) return;

            const codigo = tarjeta.dataset.codigo;
            const producto = productos.find(p => p.codigo === codigo);
            if (!producto) return;

            const inputMensaje = tarjeta.querySelector('.campo-personalizacion input');
            const mensaje = inputMensaje ? inputMensaje.value.trim() : '';

            agregarAlCarrito(producto, mensaje);

            const textoOriginal = e.target.textContent;
            e.target.textContent = '¡Añadido! ✓';
            e.target.disabled = true;
            setTimeout(() => {
                e.target.textContent = textoOriginal;
                e.target.disabled = false;
            }, 900);
        });
    }
    
    if (typeof productos !== 'undefined') {
        renderizarProductos(productos);
    }
});