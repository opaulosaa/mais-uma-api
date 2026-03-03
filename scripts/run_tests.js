// Script de testes automáticos para API local
// Requisitos: Node 18+ (fetch nativo)
(async () => {
  const base = 'http://localhost:3000';
  try {
    const email = `test${Date.now()}@example.com`;
    const senha = 'Senha123!';

    console.log('\n1) Registrando usuário...');
    let res = await fetch(`${base}/pessoas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Teste', email, senha, telefone: '123456', descricao: 'usuario de teste' })
    }).catch(e => { throw e });
    const registroBody = await (res.headers.get('content-type')?.includes('application/json') ? res.json() : null).catch(()=>null);
    console.log('Status:', res.status, 'Body:', registroBody);

    console.log('\n2) Fazendo login...');
    res = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    }).catch(e => { throw e });
    const loginBody = await res.json().catch(()=>null);
    console.log('Status:', res.status, 'Body:', loginBody);
    if (!loginBody || !loginBody.token) {
      console.error('Login falhou — abortando testes.');
      process.exit(1);
    }
    const token = loginBody.token;

    console.log('\n3) Listagem pública de conhecimentos (antes)...');
    res = await fetch(`${base}/conhecimentos`).catch(e => { throw e });
    const listBefore = await res.json().catch(()=>null);
    console.log('Status:', res.status, 'Encontrados:', Array.isArray(listBefore) ? listBefore.length : listBefore);

    console.log('\n4) Criando um conhecimento autenticado...');
    res = await fetch(`${base}/conhecimentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ titulo: 'Teste Auto', descricao: 'descrição teste', categoria: 'Geral', nivel: 'BASICO' })
    }).catch(e => { throw e });
    const created = await (res.status === 204 ? null : res.json().catch(()=>null));
    console.log('Status:', res.status, 'Body:', created);
    const createdId = created?.id;
    if (!createdId) {
      console.error('Criação do conhecimento falhou — abortando limpeza.');
      process.exit(1);
    }

    console.log('\n5) Listagem pública de conhecimentos (depois)...');
    res = await fetch(`${base}/conhecimentos`).catch(e => { throw e });
    const listAfter = await res.json().catch(()=>null);
    console.log('Status:', res.status, 'Encontrados:', Array.isArray(listAfter) ? listAfter.length : listAfter);

    console.log('\n6) Removendo o conhecimento criado...');
    res = await fetch(`${base}/conhecimentos/${createdId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).catch(e => { throw e });
    console.log('Status:', res.status);

    console.log('\nTeste concluído com sucesso (se todas as etapas retornaram códigos esperados).');
    process.exit(0);
  } catch (err) {
    console.error('Erro durante os testes:', err);
    process.exit(1);
  }
})();
