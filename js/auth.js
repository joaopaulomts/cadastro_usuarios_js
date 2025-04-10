// Sistema de autenticação completo
function checkAuth() {
  return localStorage.getItem("loggedIn") === "true";
}

function authGuard() {
  if (!checkAuth() && !window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function initAuth() {
  // Verifica se está na página de login
  if (document.getElementById("loginForm")) {
    // Configura eventos de login
    document
      .getElementById("loginForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
          const user = db.exec(
            "SELECT * FROM usuarios WHERE username = ? AND password = ?",
            [username, password]
          );

          if (user.length > 0) {
            localStorage.setItem("loggedIn", "true");
            window.location.href = "clientes.html";
          } else {
            alert("Credenciais inválidas!");
          }
        } catch (error) {
          alert("Erro no login: " + error.message);
        }
      });

    // Configura modal de cadastro
    document
      .getElementById("registerBtn")
      .addEventListener("click", function () {
        document.getElementById("registerModal").style.display = "block";
      });

    // Configura cadastro de usuários
    document
      .getElementById("registerForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("newUsername").value.trim();
        const password = document.getElementById("newPassword").value.trim();

        try {
          db.exec("INSERT INTO usuarios (username, password) VALUES (?, ?)", [
            username,
            password,
          ]);
          alert("Cadastro realizado!");
          document.getElementById("registerModal").style.display = "none";
        } catch (error) {
          alert(
            error.message.includes("UNIQUE")
              ? "Usuário já existe!"
              : "Erro no cadastro"
          );
        }
      });

    // Configura backup/restore
    document.getElementById("exportBtn").addEventListener("click", exportData);
    document.getElementById("importBtn").addEventListener("click", importData);
  }
}

// Função para exportar dados
function exportData() {
  const data = {
    usuarios: db.exec("SELECT * FROM usuarios"),
    clientes: db.exec("SELECT * FROM clientes"),
    enderecos: db.exec("SELECT * FROM enderecos"),
  };

  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-clientes.json";
  a.click();
}

// Função para importar dados
function importData() {
  const file = document.getElementById("dbFile").files[0];
  if (!file) return alert("Selecione um arquivo!");

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      db.exec("DELETE FROM enderecos");
      db.exec("DELETE FROM clientes");
      db.exec("DELETE FROM usuarios");

      if (data.usuarios)
        db.exec("INSERT INTO usuarios SELECT * FROM ?", [data.usuarios]);
      if (data.clientes)
        db.exec("INSERT INTO clientes SELECT * FROM ?", [data.clientes]);
      if (data.enderecos)
        db.exec("INSERT INTO enderecos SELECT * FROM ?", [data.enderecos]);

      alert("Dados importados com sucesso!");
      document.getElementById("settingsModal").style.display = "none";
    } catch (error) {
      alert("Erro ao importar: " + error.message);
    }
  };
  reader.readAsText(file);
}

// Inicializa quando o banco estiver pronto
document.addEventListener("db-ready", initAuth);
