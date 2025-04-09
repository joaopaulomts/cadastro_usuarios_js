# 📋 Sistema de Cadastro de Clientes e Endereços

![Preview da Aplicação](assets/screenshot.png)

> Aplicação web completa para gerenciamento de clientes e endereços com banco de dados no navegador

## ✨ Funcionalidades Principais

### 🔐 Autenticação Segura
- Cadastro de usuários com validação
- Login com proteção de sessão
- Logout automático

### 👥 Gerenciamento de Clientes
- Cadastro completo com:
  - ✅ Nome completo
  - ✅ CPF com validação
  - ✅ Data de nascimento
  - ✅ Contatos telefônicos
- Edição e exclusão segura

### 🏠 Controle de Endereços
- Cadastro múltiplo por cliente
- Definição de endereço principal
- Busca automática por CEP via API

### 🔄 Backup Integrado
- Exportação completa para JSON
- Importação de dados
- Reset seguro do sistema

## 🛠 Tecnologias Utilizadas

- **Frontend**: 
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

- **Banco de Dados**: 
  ![AlaSQL](https://img.shields.io/badge/AlaSQL-2C3E50?style=flat&logo=sql&logoColor=white)

- **APIs**: 
  ![ViaCEP](https://img.shields.io/badge/ViaCEP-2C3E50?style=flat&logo=brave&logoColor=white)

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sistema-clientes.git
```

2. Inicie o servidor:
```bash
cd sistema-clientes
python -m http.server 8000
```

3. Acesse no navegador:
```
http://localhost:8000
```

## 🗂 Estrutura do Projeto

```
sistema-clientes/
├── index.html          # Tela de login/cadastro
├── clientes.html       # Gestão de clientes
├── enderecos.html      # Gestão de endereços
├── css/
│   └── style.css       # Estilos principais
├── js/
│   ├── app.js          # Configuração do banco
│   ├── auth.js         # Autenticação
│   ├── clientes.js     # Lógica de clientes
│   └── enderecos.js    # Lógica de endereços
└── assets/             # Imagens e recursos
```

## 🔍 Pré-requisitos

- Navegador moderno:
  - ![Chrome](https://img.shields.io/badge/Chrome-✓-green)
  - ![Firefox](https://img.shields.io/badge/Firefox-✓-green)
  - ![Edge](https://img.shields.io/badge/Edge-✓-green)

- Python (para servidor local)

## 📌 Primeiros Passos

1. **Cadastre seu primeiro usuário**
2. **Adicione clientes** com dados completos
3. **Cadastre endereços** para cada cliente
4. **Exporte seus dados** para backup

## 🛠 Troubleshooting

Problema | Solução
---|---
Lista não aparece | Verifique console (F12) por erros
Dados não persistem | Recarregue a página
Modal não abre | Verifique se há erros no auth.js

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes

---

✉ **Contato**: seu-email@exemplo.com  
🌐 **Repositório**: [github.com/seu-usuario/sistema-clientes](https://github.com/seu-usuario/sistema-clientes)  
🐛 **Reportar Bug**: [Issues](https://github.com/seu-usuario/sistema-clientes/issues)

---

<div align="center">
  <sub>Desenvolvido com ❤️ por [Seu Nome]</sub>
</div>

## ✨ Recursos Adicionais

- [Documentação AlaSQL](https://github.com/AlaSQL/alasql)
- [API ViaCEP](https://viacep.com.br)
- [Guia de Estilo](https://github.com/airbnb/javascript)

## 🎯 Roadmap

- [x] Sistema básico
- [ ] Validação avançada
- [ ] Dashboard estatístico
- [ ] Exportação para Excel

## 🌟 Destaques

✔ 100% client-side  
✔ Zero dependências externas  
✔ Mobile-friendly  
✔ Persistência local  

---

<div align="center">
  <img src="assets/qr-code.png" width="150" alt="QR Code para teste">
  <p>Teste no mobile</p>
</div>
