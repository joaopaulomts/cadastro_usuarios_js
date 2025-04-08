function checkAuth() {
  return localStorage.getItem("loggedIn") === "true";
}

function authGuard() {
  if (!checkAuth() && !window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
  }
}

document.getElementById("loginForm")?.addEventListener("submit", function (e) {
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

document
  .getElementById("registerForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    try {
      db.exec("INSERT INTO usuarios (username, password) VALUES (?, ?)", [
        username,
        password,
      ]);
      alert("Usuário cadastrado com sucesso!");
      document.querySelector("#registerModal .close").click();
    } catch (error) {
      alert("Erro ao cadastrar usuário: " + error.message);
    }
  });

document.getElementById("exportBtn")?.addEventListener("click", function () {
  const data = {
    usuarios: db.exec("SELECT * FROM usuarios"),
    clientes: db.exec("SELECT * FROM clientes"),
    enderecos: db.exec("SELECT * FROM enderecos"),
  };

  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "clientes-enderecos-backup.json";
  a.click();
});

document.getElementById("importBtn")?.addEventListener("click", function () {
  const fileInput = document.getElementById("dbFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Selecione um arquivo primeiro!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      // Limpa as tabelas existentes
      db.exec("DELETE FROM enderecos");
      db.exec("DELETE FROM clientes");
      db.exec("DELETE FROM usuarios");

      // Insere os novos dados
      if (data.usuarios)
        db.exec("INSERT INTO usuarios SELECT * FROM ?", [data.usuarios]);
      if (data.clientes)
        db.exec("INSERT INTO clientes SELECT * FROM ?", [data.clientes]);
      if (data.enderecos)
        db.exec("INSERT INTO enderecos SELECT * FROM ?", [data.enderecos]);

      alert("Banco de dados importado com sucesso!");
    } catch (error) {
      alert("Erro ao importar banco de dados: " + error.message);
    }
  };
  reader.readAsText(file);
});
