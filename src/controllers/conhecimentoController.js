const ConhecimentoService = require('../services/conhecimentoService');

class ConhecimentoController {
    async listar(req, res) {
        const { categoria, nivel } = req.query;
        try {
            const ofertas = await ConhecimentoService.listar(categoria, nivel);
            res.json(ofertas);
        } catch (err) {
            res.status(500).json({ erro: "Erro ao buscar ofertas." });
        }
    }

    async criar(req, res) {
        try {
            const novaOferta = await ConhecimentoService.criar(req.body, req.usuarioLogado.id);
            res.status(201).json(novaOferta);
        } catch (err) {
            res.status(400).json({ erro: "Erro ao criar oferta." });
        }
    }

    async excluir(req, res) {
        const { id } = req.params;
        try {
            const oferta = await ConhecimentoService.buscarPorId(id);
            if (!oferta) return res.status(404).json({ erro: "Oferta não encontrada." });
           
            if (oferta.pessoa_id !== req.usuarioLogado.id && req.usuarioLogado.cargo !== 'ADMIN') {
                return res.status(403).json({ erro: "Sem permissão." });
            }

            await ConhecimentoService.excluir(id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: "Erro ao remover." });
        }
    }
}

module.exports = new ConhecimentoController();