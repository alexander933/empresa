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
      const lista = document.getElementById('listaClientes');
      lista.innerHTML = '';

      clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.innerHTML = `
        <strong>ID:</strong> ${cliente.id} <br>
        <strong>${cliente.nombre_completo}</strong> - ${cliente.correo_electronico} - ${cliente.telefono}
          <span class="acciones">
            <button onclick="editarCliente(${cliente.id}, '${cliente.nombre_completo}', '${cliente.correo_electronico}', '${cliente.telefono}')">Editar</button>
            <button onclick="eliminarCliente(${cliente.id})">Eliminar</button>
          </span>
        `;
        lista.appendChild(li);
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
