document.addEventListener("DOMContentLoaded", function () {
  authGuard();
  loadClientes();

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });

  document
    .getElementById("clienteForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      saveCliente();
    });

  document.getElementById("cancelBtn").addEventListener("click", resetForm);
});

function loadClientes() {
  const clientes = db.exec("SELECT * FROM clientes ORDER BY nome");
  const tbody = document.querySelector("#clientesTable tbody");
  tbody.innerHTML = "";

  clientes.forEach((cliente) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
              <td>${cliente.nome}</td>
              <td>${formatCPF(cliente.cpf)}</td>
              <td>${formatDate(cliente.data_nascimento)}</td>
              <td>${cliente.telefone || "-"}</td>
              <td>${cliente.celular}</td>
              <td>
                  <button class="edit-btn" data-id="${
                    cliente.id
                  }">Editar</button>
                  <button class="delete-btn" data-id="${
                    cliente.id
                  }">Excluir</button>
                  <a href="enderecos.html?cliente_id=${
                    cliente.id
                  }" class="address-btn">Endereços</a>
              </td>
          `;

    tbody.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      editCliente(this.getAttribute("data-id"));
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      deleteCliente(this.getAttribute("data-id"));
    });
  });
}

function saveCliente() {
  const id = document.getElementById("clienteId").value;
  const cliente = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value.replace(/\D/g, ""),
    data_nascimento: document.getElementById("dataNascimento").value,
    telefone: document.getElementById("telefone").value,
    celular: document.getElementById("celular").value,
  };

  try {
    if (id) {
      db.exec("UPDATE clientes SET ? WHERE id = ?", [cliente, id]);
    } else {
      db.exec("INSERT INTO clientes ?", [cliente]);
    }

    resetForm();
    loadClientes();
  } catch (error) {
    alert("Erro ao salvar cliente: " + error.message);
  }
}

function editCliente(id) {
  const cliente = db.exec("SELECT * FROM clientes WHERE id = ?", [id])[0];

  document.getElementById("clienteId").value = cliente.id;
  document.getElementById("nome").value = cliente.nome;
  document.getElementById("cpf").value = cliente.cpf;
  document.getElementById("dataNascimento").value = cliente.data_nascimento;
  document.getElementById("telefone").value = cliente.telefone || "";
  document.getElementById("celular").value = cliente.celular;
}

function deleteCliente(id) {
  if (confirm("Tem certeza que deseja excluir este cliente?")) {
    try {
      const enderecos = db.exec(
        "SELECT * FROM enderecos WHERE cliente_id = ?",
        [id]
      );

      if (enderecos.length > 0) {
        if (
          !confirm(
            "Este cliente possui endereços cadastrados. Deseja excluir todos os endereços também?"
          )
        ) {
          return;
        }

        db.exec("DELETE FROM enderecos WHERE cliente_id = ?", [id]);
      }

      db.exec("DELETE FROM clientes WHERE id = ?", [id]);
      loadClientes();
    } catch (error) {
      alert("Erro ao excluir cliente: " + error.message);
    }
  }
}

function resetForm() {
  document.getElementById("clienteForm").reset();
  document.getElementById("clienteId").value = "";
}

function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}
