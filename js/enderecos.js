document.addEventListener("DOMContentLoaded", function () {
  authGuard();

  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get("cliente_id");

  if (!clienteId) {
    alert("Cliente não especificado!");
    window.location.href = "clientes.html";
    return;
  }

  document.getElementById("clienteId").value = clienteId;
  loadClienteInfo(clienteId);
  loadEnderecos(clienteId);

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });

  document
    .getElementById("enderecoForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      saveEndereco(clienteId);
    });

  document.getElementById("cancelBtn").addEventListener("click", resetForm);

  document.getElementById("cep").addEventListener("blur", function () {
    if (this.value.length === 8) {
      buscarCEP(this.value);
    }
  });
});

function loadClienteInfo(clienteId) {
  const cliente = db.exec("SELECT * FROM clientes WHERE id = ?", [
    clienteId,
  ])[0];

  if (cliente) {
    document.getElementById("clienteInfo").innerHTML = `
            <h3>Cliente: ${cliente.nome} (CPF: ${formatCPF(cliente.cpf)})</h3>
            <a href="clientes.html">Voltar para clientes</a>
        `;
  } else {
    alert("Cliente não encontrado!");
    window.location.href = "clientes.html";
  }
}

function loadEnderecos(clienteId) {
  const enderecos = db.exec(
    "SELECT * FROM enderecos WHERE cliente_id = ? ORDER BY principal DESC",
    [clienteId]
  );
  const tbody = document.querySelector("#enderecosTable tbody");
  tbody.innerHTML = "";

  enderecos.forEach((endereco) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${formatCEP(endereco.cep)}</td>
            <td>${endereco.rua}</td>
            <td>${endereco.bairro}</td>
            <td>${endereco.cidade}</td>
            <td>${endereco.estado}</td>
            <td>${endereco.pais}</td>
            <td>${endereco.principal ? "Sim" : "Não"}</td>
            <td>
                <button class="edit-btn" data-id="${
                  endereco.id
                }">Editar</button>
                <button class="delete-btn" data-id="${
                  endereco.id
                }">Excluir</button>
                ${
                  !endereco.principal
                    ? `<button class="set-main-btn" data-id="${endereco.id}">Tornar Principal</button>`
                    : ""
                }
            </td>
        `;

    tbody.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      editEndereco(this.getAttribute("data-id"));
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      deleteEndereco(this.getAttribute("data-id"), clienteId);
    });
  });

  document.querySelectorAll(".set-main-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      setEnderecoPrincipal(this.getAttribute("data-id"), clienteId);
    });
  });
}

function saveEndereco(clienteId) {
  const id = document.getElementById("enderecoId").value;
  const endereco = {
    cliente_id: clienteId,
    cep: document.getElementById("cep").value.replace(/\D/g, ""),
    rua: document.getElementById("rua").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value,
    pais: document.getElementById("pais").value,
    principal: document.getElementById("principal").checked,
  };

  try {
    if (endereco.principal) {
      db.exec("UPDATE enderecos SET principal = false WHERE cliente_id = ?", [
        clienteId,
      ]);
    }

    if (id) {
      db.exec("UPDATE enderecos SET ? WHERE id = ?", [endereco, id]);
    } else {
      const count = db.exec(
        "SELECT COUNT(*) AS total FROM enderecos WHERE cliente_id = ?",
        [clienteId]
      )[0].total;
      if (count === 0) {
        endereco.principal = true;
      }

      db.exec("INSERT INTO enderecos ?", [endereco]);
    }

    resetForm();
    loadEnderecos(clienteId);
  } catch (error) {
    alert("Erro ao salvar endereço: " + error.message);
  }
}

function editEndereco(id) {
  const endereco = db.exec("SELECT * FROM enderecos WHERE id = ?", [id])[0];

  document.getElementById("enderecoId").value = endereco.id;
  document.getElementById("cep").value = endereco.cep;
  document.getElementById("rua").value = endereco.rua;
  document.getElementById("bairro").value = endereco.bairro;
  document.getElementById("cidade").value = endereco.cidade;
  document.getElementById("estado").value = endereco.estado;
  document.getElementById("pais").value = endereco.pais;
  document.getElementById("principal").checked = endereco.principal;
}

function deleteEndereco(id, clienteId) {
  const endereco = db.exec("SELECT * FROM enderecos WHERE id = ?", [id])[0];

  if (endereco.principal) {
    alert(
      "Não é possível excluir o endereço principal! Primeiro defina outro endereço como principal."
    );
    return;
  }

  if (confirm("Tem certeza que deseja excluir este endereço?")) {
    try {
      db.exec("DELETE FROM enderecos WHERE id = ?", [id]);
      loadEnderecos(clienteId);
    } catch (error) {
      alert("Erro ao excluir endereço: " + error.message);
    }
  }
}

function setEnderecoPrincipal(id, clienteId) {
  try {
    db.exec("UPDATE enderecos SET principal = false WHERE cliente_id = ?", [
      clienteId,
    ]);
    db.exec("UPDATE enderecos SET principal = true WHERE id = ?", [id]);
    loadEnderecos(clienteId);
  } catch (error) {
    alert("Erro ao definir endereço principal: " + error.message);
  }
}

function resetForm() {
  document.getElementById("enderecoForm").reset();
  document.getElementById("enderecoId").value = "";
  document.getElementById("clienteId").value =
    document.getElementById("clienteId").value;
}

function formatCEP(cep) {
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function buscarCEP(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.erro) {
        document.getElementById("rua").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("estado").value = data.uf || "";
        document.getElementById("pais").value = "Brasil";
      }
    })
    .catch((error) => console.error("Erro ao buscar CEP:", error));
}
