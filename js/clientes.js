document.addEventListener("DOMContentLoaded", function () {
  // Verifica autenticação
  if (!checkAuth()) {
    window.location.href = "index.html";
    return;
  }

  // Aguarda o banco de dados estar pronto
  const checkDB = setInterval(() => {
    if (window.db) {
      clearInterval(checkDB);
      initClientes();
    }
  }, 100);
});

function initClientes() {
  console.log("Inicializando módulo de clientes...");

  // Carrega clientes imediatamente
  loadClientes();

  // Configura eventos
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document
    .getElementById("clienteForm")
    .addEventListener("submit", saveCliente);
  document.getElementById("cancelBtn").addEventListener("click", resetForm);

  console.log("Módulo de clientes pronto!");
}

function loadClientes() {
  try {
    console.log("Carregando clientes...");
    const clientes = db.exec("SELECT * FROM clientes ORDER BY nome");
    console.log("Clientes encontrados:", clientes);

    const tbody = document.querySelector("#clientesTable tbody");
    tbody.innerHTML = "";

    if (clientes.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center">Nenhum cliente cadastrado</td></tr>';
      return;
    }

    clientes.forEach((cliente) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${cliente.nome || ""}</td>
                <td>${formatCPF(cliente.cpf) || ""}</td>
                <td>${formatDate(cliente.data_nascimento) || ""}</td>
                <td>${formatPhone(cliente.telefone) || "-"}</td>
                <td>${formatPhone(cliente.celular) || ""}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${
                      cliente.id
                    }">✏️ Editar</button>
                    <button class="delete-btn" data-id="${
                      cliente.id
                    }">🗑️ Excluir</button>
                    <a href="enderecos.html?cliente_id=${
                      cliente.id
                    }" class="address-btn">🏠 Endereços</a>
                </td>
            `;
      tbody.appendChild(tr);
    });

    // Adiciona eventos aos botões
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => editCliente(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteCliente(btn.dataset.id));
    });
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
    alert("Erro ao carregar clientes. Consulte o console para detalhes.");
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
