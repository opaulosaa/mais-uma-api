const prisma = require('../database');

class ConhecimentoService {
    async listar(categoria, nivel) {
        return await prisma.conhecimento.findMany({
            where: {
                categoria: categoria ? String(categoria) : undefined,
                nivel: nivel ? String(nivel) : undefined,
            },
            include: { responsavel: true }
        });
    }

    async criar(dados, usuarioId) {
        return await prisma.conhecimento.create({
            data: { ...dados, pessoa_id: usuarioId }
        });
    }

    async atualizar(id, dados) {
        return await prisma.conhecimento.update({
            where: { id },
            data: dados
        });
    }

    async buscarPorId(id) {
        return await prisma.conhecimento.findUnique({ where: { id } });
    }

    async excluir(id) {
        return await prisma.conhecimento.delete({ where: { id } });
    }
}

module.exports = new ConhecimentoService();