(async () => {
  try {
    const prisma = require('../src/database');

    console.log('\nProcurando usuários de teste (email contendo "test" e "@example.com")...');
    const users = await prisma.pessoa.findMany({ where: { email: { contains: 'test', mode: 'insensitive' } } });
    console.log('Usuários encontrados:', users.length);
    users.forEach(u => console.log({ id: u.id, email: u.email, nome: u.nome }));

    if (users.length > 0) {
      const u = users[0];
      console.log(`\nProcurando conhecimentos do usuário ${u.id}...`);
      const conhecimentos = await prisma.conhecimento.findMany({ where: { pessoa_id: u.id } });
      console.log('Conhecimentos encontrados:', conhecimentos.length);
      conhecimentos.forEach(c => console.log({ id: c.id, titulo: c.titulo }));
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao consultar o banco:', err.message || err);
    process.exit(1);
  }
})();
