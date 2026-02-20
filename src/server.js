const express = require('express');
const prisma = require('./database');
const app = express();
app.use(express.json());

app.post('/pessoas', async (req, res) => {
    const { nome, email, conhecimentos } = req.body;
    try {
        const novaPessoa = await prisma.pessoa.create({
            data: {
                nome,
                email,
                conhecimentos: {
                    create: conhecimentos
                }
            }
        });
        res.status(201).json(novaPessoa);
    } catch (err) {
        res.status(400).json({ erro: "Erro ao criar pessoa, Email já existe" });
    }
});

app.get('/pessoas', async (req, res) => {
    const lista = await prisma.pessoa.findMany({
        include: { conhecimentos: true }
    });
    res.json(lista);
});

app.put('/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    try {
        const atualizada = await prisma.pessoa.update({
            where: { id },
            data: { nome, email }
        });
        res.json(atualizada);
    } catch (err) {
        res.status(404).json({ erro: "Pessoa não encontrada" });
    }
});

app.delete('/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.pessoa.delete({ where: { id } });
    res.status(204).send();
});

app.post('/conhecimentos', async (req, res) => {
    const { descricao, nivel, pessoaId } = req.body;
    const novoConhecimento = await prisma.conhecimento.create({
        data: { descricao, nivel, pessoaId }
    });
    res.status(201).json(novoConhecimento);
});

app.get('/conhecimentos', async (req, res) => {
    const lista = await prisma.conhecimento.findMany({
        include: { pessoa: true }
    });
    res.json(lista);
});

app.put('/conhecimentos/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, nivel } = req.body;
    try {
        const atualizado = await prisma.conhecimento.update({
            where: { id },
            data: { descricao, nivel }
        });
        res.json(atualizado);
    } catch (err) {
        res.status(404).json({ erro: "Conhecimento não encontrado" });
    }
});

app.delete('/conhecimentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.conhecimento.delete({ where: { id } });
        res.status(204).send();
    } catch (err) {
        res.status(404).json({ erro: "Conhecimento não encontrado" });
    }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));