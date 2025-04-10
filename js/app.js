// Inicialização robusta do banco de dados
document.addEventListener("DOMContentLoaded", function () {
  window.db = alasql;

  // Criação das tabelas com verificação
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTOINCREMENT PRIMARY KEY,
          username STRING,
          password STRING,
          UNIQUE(username)
      )`);

    db.exec(`CREATE TABLE IF NOT EXISTS clientes (
          id INT AUTOINCREMENT PRIMARY KEY,
          nome STRING,
          cpf STRING,
          data_nascimento DATE,
          telefone STRING,
          celular STRING,
          UNIQUE(cpf)
      )`);

    db.exec(`CREATE TABLE IF NOT EXISTS enderecos (
          id INT AUTOINCREMENT PRIMARY KEY,
          cliente_id INT,
          cep STRING,
          rua STRING,
          bairro STRING,
          cidade STRING,
          estado STRING,
          pais STRING,
          principal BOOLEAN,
          FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      )`);

    console.log("Banco de dados inicializado com sucesso");
    document.dispatchEvent(new Event("db-ready"));
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
  }
});
