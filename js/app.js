let db = alasql;

function initDatabase() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTOINCREMENT PRIMARY KEY,
            username STRING,
            password STRING,
            UNIQUE(username)
        );
        
        CREATE TABLE IF NOT EXISTS clientes (
            id INT AUTOINCREMENT PRIMARY KEY,
            nome STRING,
            cpf STRING,
            data_nascimento DATE,
            telefone STRING,
            celular STRING,
            UNIQUE(cpf)
        );
        
        CREATE TABLE IF NOT EXISTS enderecos (
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
        );
    `);
}

window.onload = initDatabase;
