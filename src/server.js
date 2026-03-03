const express = require('express');
const cors = require('cors');
const { verificarToken } = require('./middlewares/auth'); 
const PessoaController = require('./controllers/pessoaController');
const ConhecimentoController = require('./controllers/conhecimentoController');

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
app.use(cors({
	origin: FRONTEND_URL,
	credentials: true,
}));

app.post('/pessoas', (req, res) => PessoaController.cadastrar(req, res));
app.post('/login', (req, res) => PessoaController.login(req, res));

app.get('/conhecimentos', (req, res) => ConhecimentoController.listar(req, res));
app.post('/conhecimentos', verificarToken, (req, res) => ConhecimentoController.criar(req, res));
app.put('/conhecimentos/:id', verificarToken, (req, res) => ConhecimentoController.atualizar(req, res));
app.delete('/conhecimentos/:id', verificarToken, (req, res) => ConhecimentoController.excluir(req, res));

app.listen(3000, () => console.log("Servidor rodando ORGANIZADO na porta 3000"));
