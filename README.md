Sistema de Agendamentos (Frontend + Mock API)

Resumo  

Projeto simples para agendamento de visitas com frontend (páginas públicas e dashboards para admin/operador) e um mock API em Node/Express que mantém dados em memória. Permite criar agendamentos, listar, editar (admin) e confirmar grupo (operador).

Credenciais de teste

admin / admin → acesso ao dashboard do admin (editar agendamentos)
operador / operador → acesso ao dashboard do operador (confirmar grupos)

Compatibilidade

Node.js >= 14
Navegador moderno
Recomenda-se servir via HTTP (não abrir arquivos com file://)

Estrutura do projeto
public/
    login.html
    dashboard.html
    dashboardoperador.html
    agendamento.html
    agendamento.css
    agendamento.js
src/
controllers/
    adminController.js
models/
    Usuario.js
    Integrantes.js
routes/
    adminRoutes.js
services/
    server.js

Descrição das páginas principais

login.html
Autenticação client-side (localStorage). Redireciona admin → /dashboard.html e operador → /dashboardoperador.html. Proteção básica contra força bruta via localStorage.

dashboard.html (admin)
Lista os agendamentos (GET /api/usuarios). Permite editar campos (nome, cpf, dataDeNascimento, email, telefone, cidade, estado) e salvar com PUT /api/usuarios/:id.

dashboardoperador.html (operador)
Mostra todas as informações em leitura e permite marcar/desmarcar somente o campo grupoConfirmado. Salva via PUT /api/usuarios/:id com payload { grupoConfirmado }.

agendamento.html (+ agendamento.css, agendamento.js)
Formulário público para criar agendamentos (POST /api/usuarios). Multi-step, validações de campos, máscaras e criação dinâmica de formulários para integrantes.

API (mock, em memória)
Endpoints expostos por /api (via Express)

GET /api/usuarios
Retorna array com todos os agendamentos (usuários).

POST /api/usuarios
Cria novo agendamento. Payload esperado (exemplo):
{
  nome, cpf, dataDeNascimento, email, telefone,
  logradouro, numero, complemento, bairro, cep, cidade, estado, sabendo,
  integrantes: [ { nome, cpf, dataDeNascimento, email }, ... ]
}
Retorna 201 e o usuário criado com id.

GET /api/usuarios/:id
Retorna o agendamento específico pelo ID(ou 404).

PUT /api/usuarios/:id
Atualiza o usuário — aceita payload parcial ou completo. Uso típico:
Admin: enviar objeto completo/atualizado (nome, cpf, ...).
Operador: enviar { grupoConfirmado: true/false } para apenas confirmar grupo.

DELETE /api/usuarios/:id
Remove usuário (retorna o objeto removido).

Instalação e execução (passo a passo)

1. Clone o repositorio `git clone https://github.com/JoaoCalorio/grupoRMC.git`
2. Rode npm init -y (vai escolher yes para todas as perguntas)
3. Instale as dependencias `npm install express cors`
4. criar um script para rodar apenas com o comando npm start 
5. Use o FRONT SEMPRE no localhost para consumir as informações

