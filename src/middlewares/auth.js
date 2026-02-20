const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ erro: "Acesso negado. Faça login." });

    try {
        const tokenLimpo = token.split(" ")[1];
        const validado = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
        req.usuarioLogado = validado;
        next(); 
    } catch (err) {
        res.status(400).json({ erro: "Token inválido" });
    }
}

function verificarPermissao(req, res, next) {
    const { id } = req.params;
    const { cargo, id: usuarioId } = req.usuarioLogado;

   
    if (cargo === 'ADMIN' || id === usuarioId) {
        return next();
    }
    
    return res.status(403).json({ erro: "Você não tem permissão para isso." });
}

module.exports = { verificarToken, verificarPermissao };