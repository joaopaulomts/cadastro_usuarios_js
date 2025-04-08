function initAuth() {
  // Modal de cadastro
  document.getElementById("registerBtn").addEventListener("click", function () {
    console.log("Botão cadastrar clicado!"); // Para debug
    document.getElementById("registerModal").style.display = "block";
  });

  // Configurações
  document.getElementById("settingsBtn").addEventListener("click", function () {
    document.getElementById("settingsModal").style.display = "block";
  });

  // Fechar modais
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none";
    });
  });

  // Login
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = db.exec(
      "SELECT * FROM usuarios WHERE username = ? AND password = ?",
      [username, password]
    );

    if (user.length > 0) {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "clientes.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });

  // Cadastro
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("newUsername").value;
      const password = document.getElementById("newPassword").value;

      try {
        db.exec("INSERT INTO usuarios (username, password) VALUES (?, ?)", [
          username,
          password,
        ]);
        alert("Usuário cadastrado com sucesso!");
        document.getElementById("registerModal").style.display = "none";
      } catch (error) {
        alert(
          "Erro: " +
            (error.message.includes("UNIQUE")
              ? "Usuário já existe!"
              : error.message)
        );
      }
    });

  // Exportar
  document.getElementById("exportBtn").addEventListener("click", function () {
    const data = {
      usuarios: db.exec("SELECT * FROM usuarios"),
      clientes: db.exec("SELECT * FROM clientes"),
      enderecos: db.exec("SELECT * FROM enderecos"),
    };

    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
  });

  // Importar
  document.getElementById("importBtn").addEventListener("click", function () {
    const file = document.getElementById("dbFile").files[0];
    if (!file) {
      alert("Selecione um arquivo primeiro!");
      return;
    }

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
  });
}

// Chama a função quando o script é carregado
if (window.db) {
  initAuth();
} else {
  document.addEventListener("alasql-initialized", initAuth);
}
