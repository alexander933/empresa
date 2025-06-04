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
