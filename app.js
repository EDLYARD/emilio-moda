const WA = '50575338609';

let admin = false;
let editando = -1;

let productos = JSON.parse(
    localStorage.getItem('emilioModa4') || '[]'
);

const productosView = document.getElementById('productos');

function save() {
    localStorage.setItem(
        'emilioModa4',
        JSON.stringify(productos)
    );

    render();
}

function mostrarBotonExportar() {

    if (document.getElementById('btnExportar')) {
        return;
    }

    const btn = document.createElement('button');

    btn.id = 'btnExportar';
    btn.innerHTML = 'Exportar Catalogo';

    btn.onclick = exportarJSON; 

    document
        .querySelector('.toolbar')
        .appendChild(btn);
}

document.querySelector('header h1').addEventListener('dblclick', () => {
    const adminBtn = document.getElementById('adminBtn');
    adminBtn.style.display = 'inline-block';

    adminBtn.onclick = () => {
        if (prompt('Contrasena') === '150919') {
            admin = true;
            mostrarBotonExportar();
            panel.showModal();
            adminBtn.style.display = 'none';
            render();
        }
    };
});

function guardarProducto() {

    const f = foto.files[0];

    if (editando === -1) {

        if (!f) {
            alert('Seleccione imagen');
            return;
        }

        const r = new FileReader();

        r.onload = e => {

            productos.push({
                nombre: nombre.value,
                precio: Number(precio.value),
                categoria: categoria.value,
                img: f.name
            });

            save();
        };

        r.readAsDataURL(f);

    } else {

        productos[editando].nombre = nombre.value;
        productos[editando].precio = Number(precio.value);
        productos[editando].categoria = categoria.value;

        if (f) {

            const r = new FileReader();

            r.onload = e => {

                productos[editando].img =
                    e.target.result;

                save();
            };

            r.readAsDataURL(f);

        } else {

            save();
        }

        editando = -1;
    }

    panel.close();
}

function editar(i) {

    let p = productos[i];

    nombre.value = p.nombre;
    precio.value = p.precio;
    categoria.value = p.categoria;

    editando = i;

    panel.showModal();
}

function eliminar(i) {

    if (confirm('¿Eliminar producto?')) {

        productos.splice(i, 1);

        save();
    }
}

function verImg(src) {

    imgGrande.src = src;

    modalImg.style.display = 'block';
}

function exportarJSON() {

    const fecha = new Date()
        .toISOString()
        .split('T')[0];

    const blob = new Blob(
        [
            JSON.stringify(
                productos,
                null,
                2
            )
        ],
        {
            type: 'application/json'
        }
    );

    const a = document.createElement('a');

    a.href = URL.createObjectURL(blob);

    a.download =
        `productos_${fecha}.json`;

    a.click();
}


function render() {

    let arr = [...productos];

    const texto = (buscar.value || '').toLowerCase();

    arr = arr.filter(
        p =>    
            p.nombre.toLowerCase().includes(texto) ||
            p.categoria.toLowerCase().includes(texto)
    );

    arr.sort((a, b) =>
        orden.value === 'az'
            ? a.precio - b.precio
            : b.precio - a.precio
    );

    productosView.innerHTML = '';

    arr.forEach(p => {

        const idx = productos.indexOf(p);

        const msg = encodeURIComponent(
`Hola Emilio Moda.

Me interesa este producto:

👕 ${p.nombre}
💰 Precio: C$ ${p.precio}
📂 Categoría: ${p.categoria}

¿Está disponible?`
        );

        productosView.innerHTML += `
        <div class="card">

           <img
            src="imagenes/${p.img}"
            alt="${p.nombre}"
           onclick="verImg(this.src)"
           >

            <div class="info">

                <small>${p.categoria}</small>

                <h3>${p.nombre}</h3>

                <div class="price">
                    C$ ${p.precio}
                </div>

                <a
                    class="wa"
                    target="_blank"
                    href="https://wa.me/${WA}?text=${msg}"
                >
                    Comprar por WhatsApp
                </a>

               ${admin ? `
                <button
                    type="button"
                    class="edit"
                    onclick="editar(${idx})"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="del"
                    onclick="eliminar(${idx})"
                >
                    Eliminar
                </button>

                ` : ''}

            </div>

        </div>
        `;
    });
}



buscar.oninput = render;
orden.onchange = render;

render();
