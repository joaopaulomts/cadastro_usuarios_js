document.addEventListener("DOMContentLoaded", function () {
  if (!authGuard()) return;

  // Aguarda o banco estar pronto
  if (window.db) {
    initClientes();
  } else {
    document.addEventListener("db-ready", initClientes);
  }
});

function initClientes() {
  loadClientes();

  // Configura eventos
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });

  document
    .getElementById("clienteForm")
    .addEventListener("submit", saveCliente);
  document.getElementById("cancelBtn").addEventListener("click", resetForm);
}

function loadClientes() {
  try {
    const clientes = db.exec("SELECT * FROM clientes ORDER BY nome");
    const tbody = document.querySelector("#clientesTable tbody");
    tbody.innerHTML = "";

    if (clientes.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">Nenhum cliente cadastrado</td></tr>';
      return;
    }

    clientes.forEach((cliente) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${cliente.nome}</td>
              <td>${formatCPF(cliente.cpf)}</td>
              <td>${formatDate(cliente.data_nascimento)}</td>
              <td>${formatPhone(cliente.telefone) || "-"}</td>
              <td>${formatPhone(cliente.celular)}</td>
              <td class="actions">
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

    // Adiciona eventos dinâmicos
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => editCliente(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteCliente(btn.dataset.id));
    });
  } catch (error) {
    alert("Erro ao carregar clientes: " + error.message);
  }
}

// Funções auxiliares (adicionar ao final do arquivo)
function formatPhone(phone) {
  if (!phone) return "";
  const nums = phone.replace(/\D/g, "");
  return nums.length === 11
    ? nums.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    : nums.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}
