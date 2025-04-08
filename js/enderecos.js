document.addEventListener("DOMContentLoaded", function () {
  if (!authGuard()) return;

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
  try {
    const cliente = db.exec("SELECT * FROM clientes WHERE id = ?", [
      clienteId,
    ])[0];

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    document.getElementById("clienteInfo").innerHTML = `
            <h3>Cliente: ${cliente.nome} (CPF: ${formatCPF(cliente.cpf)})</h3>
            <a href="clientes.html" class="back-btn">← Voltar para clientes</a>
        `;
  } catch (error) {
    alert(error.message);
    window.location.href = "clientes.html";
  }
}

function loadEnderecos(clienteId) {
  try {
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
                <td>${endereco.principal ? "✔️" : "❌"}</td>
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

    // Adiciona eventos aos botões
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
  } catch (error) {
    alert("Erro ao carregar endereços: " + error.message);
  }
}

function saveEndereco(clienteId) {
  const id = document.getElementById("enderecoId").value;
  const endereco = {
    cliente_id: clienteId,
    cep: document.getElementById("cep").value.replace(/\D/g, ""),
    rua: document.getElementById("rua").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    estado: document.getElementById("estado").value.trim(),
    pais: document.getElementById("pais").value.trim(),
    principal: document.getElementById("principal").checked,
  };

  // Validações
  if (
    !endereco.cep ||
    !endereco.rua ||
    !endereco.bairro ||
    !endereco.cidade ||
    !endereco.estado ||
    !endereco.pais
  ) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  try {
    if (endereco.principal) {
      db.exec("UPDATE enderecos SET principal = false WHERE cliente_id = ?", [
        clienteId,
      ]);
    }

    if (id) {
      db.exec("UPDATE enderecos SET ? WHERE id = ?", [endereco, id]);
    } else {
      // Se for o primeiro endereço, define como principal
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
  try {
    const endereco = db.exec("SELECT * FROM enderecos WHERE id = ?", [id])[0];

    document.getElementById("enderecoId").value = endereco.id;
    document.getElementById("cep").value = endereco.cep;
    document.getElementById("rua").value = endereco.rua;
    document.getElementById("bairro").value = endereco.bairro;
    document.getElementById("cidade").value = endereco.cidade;
    document.getElementById("estado").value = endereco.estado;
    document.getElementById("pais").value = endereco.pais;
    document.getElementById("principal").checked = endereco.principal;
  } catch (error) {
    alert("Erro ao editar endereço: " + error.message);
  }
}

function deleteEndereco(id, clienteId) {
  try {
    const endereco = db.exec("SELECT * FROM enderecos WHERE id = ?", [id])[0];

    if (endereco.principal) {
      alert(
        "Não é possível excluir o endereço principal! Defina outro como principal primeiro."
      );
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;

    db.exec("DELETE FROM enderecos WHERE id = ?", [id]);
    loadEnderecos(clienteId);
  } catch (error) {
    alert("Erro ao excluir endereço: " + error.message);
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
}

function formatCEP(cep) {
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function buscarCEP(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => {
      if (!response.ok) throw new Error("CEP não encontrado");
      return response.json();
    })
    .then((data) => {
      if (data.erro) throw new Error("CEP não encontrado");

      document.getElementById("rua").value = data.logradouro || "";
      document.getElementById("bairro").value = data.bairro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("estado").value = data.uf || "";
      document.getElementById("pais").value = "Brasil";
    })
    .catch((error) => {
      console.error("Erro ao buscar CEP:", error);
      alert("CEP não encontrado ou erro na consulta");
    });
}
