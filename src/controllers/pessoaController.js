const PessoaService = require('../services/pessoaService');

class PessoaController {
    async cadastrar(req, res) {
        try {
            const novaPessoa = await PessoaService.cadastrar(req.body);
            res.status(201).json(novaPessoa);
        } catch (err) {
                        
            if (err.code === 'P2002') {
                return res.status(400).json({ erro: "E-mail já cadastrado." });
            }
            res.status(500).json({ erro: "Erro ao criar usuário." });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const dados = await PessoaService.login(email, senha);
            res.json(dados);
        } catch (err) {
            res.status(401).json({ erro: err.message });
        }
    }
}

module.exports = new PessoaController();