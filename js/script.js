const apiUrl = 'http://localhost:3000/clientes';

document.addEventListener('DOMContentLoaded', () => {
  cargarClientes();

  const form = document.getElementById('clienteForm');
  form.addEventListener('submit', guardarCliente);
});

function cargarClientes() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(clientes => {
      const tabla = document.getElementById('listaClientes');
      tabla.innerHTML = '';

      clientes.forEach(cliente => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${cliente.nombre_completo}</td>
          <td>${cliente.correo_electronico}</td>
          <td>${cliente.telefono}</td>
          <td class="acciones">
            <button onclick="editarCliente(${cliente.id}, '${cliente.nombre_completo}', '${cliente.correo_electronico}', '${cliente.telefono}')">✏️</button>
            <button onclick="eliminarCliente(${cliente.id})">🗑️</button>
          </td>
        `;
        tabla.appendChild(fila);
      });
    });
}


function guardarCliente(e) {
  e.preventDefault();

  const id = document.getElementById('clienteId').value;
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const telefono = document.getElementById('telefono').value;

  const cliente = { nombre_completo: nombre, correo_electronico: correo, telefono };

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrl}/${id}` : apiUrl;

  fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('clienteForm').reset();
      cargarClientes();
     if (metodo === 'POST') {
        alert('✅ Cliente creado con éxito');
      } else {
        alert('✏️ Cliente actualizado con éxito');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('❌ Hubo un error al guardar el cliente');
    });
}
    

function editarCliente(id, nombre, correo, telefono) {
  if (confirm('¿Estás seguro de que deseas editar este cliente?')){
  document.getElementById('clienteId').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('correo').value = correo;
  document.getElementById('telefono').value = telefono;
}
}

function eliminarCliente(id) {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => cargarClientes());
  }
}


const productosApiUrl = 'http://localhost:3000/productos';

document.addEventListener('DOMContentLoaded', () => {
  const productoForm = document.getElementById('productoForm');
  if (productoForm) {
    cargarProductos();
    productoForm.addEventListener('submit', guardarProducto);
  }
});

function cargarProductos() {
  fetch(productosApiUrl)
    .then(res => res.json())
    .then(productos => {
      const tabla = document.getElementById('listaProductos');
      tabla.innerHTML = '';

      productos.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${p.nombre_producto}</td>
          <td>${p.serial}</td>
          <td class="acciones">
            <button onclick="editarProducto(${p.id}, '${p.nombre_producto}', '${p.serial}')">✏️</button>
            <button onclick="eliminarProducto(${p.id})">🗑️</button>
          </td>
        `;
        tabla.appendChild(fila);
      });
    });
}

function guardarProducto(e) {
  e.preventDefault();

  const id = document.getElementById('productoId').value;
  const nombre = document.getElementById('nombreProducto').value;
  const serial = document.getElementById('serial').value;

  const producto = { nombre_producto: nombre, serial };

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${productosApiUrl}/${id}` : productosApiUrl;

  fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('productoForm').reset();
      cargarProductos();
      alert(metodo === 'POST' ? '✅ Producto creado con éxito' : '✏️ Producto actualizado');
    });
}

function editarProducto(id, nombre, serial) {
  if (confirm('¿Editar este producto?')) {
    document.getElementById('productoId').value = id;
    document.getElementById('nombreProducto').value = nombre;
    document.getElementById('serial').value = serial;
  }
}

function eliminarProducto(id) {
  if (confirm('¿Eliminar este producto?')) {
    fetch(`${productosApiUrl}/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => cargarProductos());
  }
}

