let categoriaActual = 'Todas';

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
            <article class="tarjeta-producto">
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
    
    if (typeof productos !== 'undefined') {
        renderizarProductos(productos);
    }
});