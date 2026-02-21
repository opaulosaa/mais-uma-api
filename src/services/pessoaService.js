const prisma = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class PessoaService {
    async cadastrar(dados) {
        const { nome, email, senha, telefone, descricao } = dados;
        
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        
        return await prisma.pessoa.create({
            data: { 
                nome, 
                email, 
                senha: senhaHash, 
                telefone, 
                descricao, 
                cargo: 'USER' 
            }
        });
    }

    async login(email, senha) {
      
        const pessoa = await prisma.pessoa.findUnique({ where: { email } });
        if (!pessoa) throw new Error("Usuário não encontrado");

        
        const senhaValida = await bcrypt.compare(senha, pessoa.senha);
        if (!senhaValida) throw new Error("Senha incorreta");

        
        const token = jwt.sign(
            { id: pessoa.id, cargo: pessoa.cargo || 'USER' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return { token, cargo: pessoa.cargo };
    }
}

module.exports = new PessoaService();