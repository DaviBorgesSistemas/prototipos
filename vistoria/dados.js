// Base única do protótipo integrado: site, portal e painel leem e gravam aqui.
// Fica no localStorage do navegador; abas abertas lado a lado se atualizam sozinhas.
const CHAVE_DADOS = 'fc_integrado_v1';
const CHAVE_SESSAO = 'fc_sessao_v1';
const HOJE = '2026-10-30'; // data fixa para a demonstração ficar estável
const EMAIL_EQUIPE = 'equipe@exemplo.com.br';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dinheiro = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = iso => iso ? iso.slice(0, 10).split('-').reverse().join('/') : '';
const quandoBR = iso => `${dataBR(iso)}, ${iso.slice(11, 16)}`;
const somarDias = (iso, n) => { const d = new Date(iso + 'T12:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const agora = () => `${HOJE}T${new Date().toTimeString().slice(0, 5)}`;

function semente() {
  return {
    versao: 1,
    clientes: [
      { id: 'C-01', nome: 'Condomínio Aurora', tipo: 'Condomínio', email: 'sindico@exemplo.com.br', telefone: '(48) 90000-0010', cidade: 'Florianópolis', endereco: 'Rua das Acácias, 120, bloco B, Florianópolis', origem: 'Indicação' },
      { id: 'C-02', nome: 'Marina Alves', tipo: 'Apartamento', email: 'marina@exemplo.com.br', telefone: '(48) 90000-0001', cidade: 'Florianópolis', endereco: 'Av. Beira Mar, 540, ap. 302, Florianópolis', origem: 'Site' },
      { id: 'C-03', nome: 'Oficina Rocha', tipo: 'Comercial', email: 'oficina@exemplo.com.br', telefone: '(48) 90000-0002', cidade: 'São José', endereco: 'Rua Industrial, 88, São José', origem: 'Indicação' },
      { id: 'C-04', nome: 'Paulo Menezes', tipo: 'Casa', email: 'paulo@exemplo.com.br', telefone: '(48) 90000-0003', cidade: 'Palhoça', endereco: 'Rua dos Ipês, 45, Palhoça', origem: 'Site' },
      { id: 'C-05', nome: 'Rogério Lima', tipo: 'Casa', email: 'rogerio@exemplo.com.br', telefone: '', cidade: 'Biguaçu', endereco: '', origem: 'Site' },
    ],
    pedidos: [
      { id: 'PED-007', clienteId: 'C-05', tipo: 'Casa', cidade: 'Biguaçu', mensagem: 'Rachadura diagonal na parede da sala, aumentando desde o inverno.', data: '2026-10-29', status: 'Novo' },
    ],
    propostas: [
      { id: 'P-041', clienteId: 'C-04', servico: 'Vistoria e laudo de umidade', valor: 2200, status: 'Aprovada', validade: '2026-10-20', contrato: 'assinado' },
      { id: 'P-044', clienteId: 'C-01', servico: 'Vistoria e laudo de fachada', valor: 4800, status: 'Aprovada', validade: '2026-11-15', contrato: 'assinado' },
      { id: 'P-045', clienteId: 'C-03', servico: 'Laudo de infiltração em cobertura', valor: 2600, status: 'Enviada', validade: '2026-11-10', contrato: 'nenhum' },
      { id: 'P-046', clienteId: 'C-02', servico: 'Vistoria cautelar do apartamento', valor: 1900, status: 'Enviada', validade: '2026-11-12', contrato: 'nenhum' },
      { id: 'P-047', clienteId: 'C-04', servico: 'Acompanhamento de reparo (3 visitas)', valor: 3300, status: 'Rascunho', validade: '2026-11-20', contrato: 'nenhum' },
    ],
    vistorias: [
      { id: 'VST-017', clienteId: 'C-02', propostaId: '', endereco: 'Av. Beira Mar, 540, ap. 302, Florianópolis', data: '2026-10-20', hora: '10:00', resp: 'Arquiteta', status: 'Laudo entregue', modelo: 'cautelar' },
      { id: 'VST-019', clienteId: 'C-04', propostaId: 'P-041', endereco: 'Rua dos Ipês, 45, Palhoça', data: '2026-10-27', hora: '14:00', resp: 'Engenheira (sócia)', status: 'Laudo em revisão', modelo: 'patologia' },
      { id: 'VST-021', clienteId: 'C-01', propostaId: 'P-044', endereco: 'Rua das Acácias, 120, bloco B, Florianópolis', data: '2026-10-30', hora: '09:00', resp: 'Engenheira (sócia)', status: 'Realizada', modelo: 'patologia' },
    ],
    financeiro: [
      { id: 'F-112', clienteId: 'C-04', desc: 'Vistoria e laudo de umidade (P-041)', valor: 2200, venc: '2026-10-25', status: 'Atrasado' },
      { id: 'F-113', clienteId: 'C-01', desc: 'Entrada, 50% (P-044)', valor: 2400, venc: '2026-11-05', status: 'A receber' },
      { id: 'F-114', clienteId: 'C-02', desc: 'Vistoria cautelar (VST-017)', valor: 1900, venc: '2026-10-22', status: 'Pago' },
    ],
    equipe: [
      { nome: 'Nome da sócia', funcao: 'Engenheira civil', vinculo: 'Sócia', inicio: '2026-10-01', fim: '' },
      { nome: 'Nome da sócia', funcao: 'Engenheira civil', vinculo: 'Sócia', inicio: '2026-10-01', fim: '' },
      { nome: 'Nome da sócia', funcao: 'Arquiteta', vinculo: 'Sócia', inicio: '2026-10-01', fim: '' },
      { nome: 'Nome do funcionário', funcao: 'Comercial', vinculo: 'PJ', inicio: '2026-09-01', fim: '2026-12-15' },
      { nome: 'Nome da estagiária', funcao: 'Estagiária de engenharia', vinculo: 'Estágio', inicio: '2026-08-03', fim: '2027-02-03' },
    ],
    conclusoes: {},
    atividades: [
      { quando: '2026-10-30T09:31', origem: 'Campo', clienteId: 'C-01', texto: 'Apontamentos da vistoria VST-021 recebidos do app de campo.' },
      { quando: '2026-10-29T16:10', origem: 'Site', clienteId: 'C-05', texto: 'Novo pedido de orçamento de Rogério Lima.' },
      { quando: '2026-10-28T11:02', origem: 'Equipe', clienteId: 'C-02', texto: 'Proposta P-046 enviada para Marina Alves.' },
      { quando: '2026-10-22T10:15', origem: 'Portal', clienteId: 'C-02', texto: 'Marina Alves pagou a cobrança F-114.' },
    ],
  };
}

let db = carregarDb();
function carregarDb() {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE_DADOS));
    if (s && s.versao === 1) return s;
  } catch (e) { /* segue com a semente */ }
  return semente();
}
function salvarDb() {
  try { localStorage.setItem(CHAVE_DADOS, JSON.stringify(db)); } catch (e) { /* protótipo: ignora falta de espaço */ }
}
function reiniciarDb() { db = semente(); salvarDb(); }

// Outra aba gravou: recarrega e redesenha a tela atual.
function aoMudar(fn) {
  window.addEventListener('storage', e => { if (e.key === CHAVE_DADOS) { db = carregarDb(); fn(); } });
}

/* ---------- consultas ---------- */
const cliente = id => db.clientes.find(c => c.id === id);
const proposta = id => db.propostas.find(p => p.id === id);
const vistoria = id => db.vistorias.find(v => v.id === id);
const nomeCliente = id => cliente(id)?.nome || '-';
const proximoId = (prefixo, lista) => `${prefixo}-${String(Math.max(0, ...lista.map(x => +x.id.split('-')[1])) + 1).padStart(3, '0')}`;
const acharClientePorContato = txt => {
  const t = txt.trim().toLowerCase(), digitos = t.replace(/\D/g, '');
  return db.clientes.find(c => c.email.toLowerCase() === t || (digitos.length >= 10 && c.telefone.replace(/\D/g, '') === digitos));
};

/* ---------- ações (as mesmas regras valem para todas as telas) ---------- */
function registrar(texto, origem, clienteId) {
  db.atividades.unshift({ quando: agora(), origem, clienteId, texto });
}

function novoPedido(d) {
  const contato = d.contato.trim();
  const email = /@/.test(contato) ? contato.toLowerCase() : '';
  let c = acharClientePorContato(contato);
  if (!c) {
    c = { id: proximoId('C', db.clientes), nome: d.nome.trim(), tipo: d.tipo, email, telefone: email ? '' : contato, cidade: d.cidade.trim(), endereco: '', origem: 'Site' };
    db.clientes.push(c);
  }
  const p = { id: proximoId('PED', db.pedidos), clienteId: c.id, tipo: d.tipo, cidade: d.cidade.trim(), mensagem: d.mensagem.trim(), data: HOJE, status: 'Novo' };
  db.pedidos.unshift(p);
  registrar(`Novo pedido de orçamento de ${c.nome}.`, 'Site', c.id);
  salvarDb();
  return c;
}

function criarProposta(clienteId, servico, valor, endereco, pedidoId) {
  const p = { id: proximoId('P', db.propostas), clienteId, servico, valor, status: 'Enviada', validade: somarDias(HOJE, 15), contrato: 'nenhum' };
  db.propostas.push(p);
  if (endereco) cliente(clienteId).endereco = endereco;
  const ped = db.pedidos.find(x => x.id === pedidoId);
  if (ped) ped.status = 'Proposta enviada';
  registrar(`Proposta ${p.id} enviada para ${nomeCliente(clienteId)}.`, 'Equipe', clienteId);
  salvarDb();
  return p;
}

function enviarRascunho(pid) {
  const p = proposta(pid);
  p.status = 'Enviada';
  registrar(`Proposta ${p.id} enviada para ${nomeCliente(p.clienteId)}.`, 'Equipe', p.clienteId);
  salvarDb();
}

function aprovarProposta(pid) {
  const p = proposta(pid);
  p.status = 'Aprovada';
  db.financeiro.push({ id: proximoId('F', db.financeiro), clienteId: p.clienteId, desc: `Entrada, 50% (${p.id})`, valor: p.valor / 2, venc: somarDias(HOJE, 7), status: 'A receber' });
  registrar(`${nomeCliente(p.clienteId)} aprovou a proposta ${p.id}.`, 'Portal', p.clienteId);
  salvarDb();
}

function enviarContrato(pid) {
  const p = proposta(pid);
  p.contrato = 'enviado';
  registrar(`Contrato da proposta ${p.id} enviado para assinatura.`, 'Equipe', p.clienteId);
  salvarDb();
}

function assinarContrato(pid) {
  const p = proposta(pid), c = cliente(p.clienteId);
  p.contrato = 'assinado';
  db.vistorias.push({ id: proximoId('VST', db.vistorias), clienteId: c.id, propostaId: p.id, endereco: c.endereco || c.cidade, data: '', hora: '', resp: '', status: 'A agendar', modelo: /cautelar/i.test(p.servico) ? 'cautelar' : 'patologia' });
  registrar(`${c.nome} assinou o contrato da proposta ${p.id}.`, 'Portal', c.id);
  salvarDb();
}

function agendarVistoria(vid, data, hora, resp) {
  const v = vistoria(vid);
  Object.assign(v, { data, hora, resp, status: 'Agendada' });
  registrar(`Vistoria ${v.id} agendada para ${dataBR(data)}, ${hora}.`, 'Equipe', v.clienteId);
  salvarDb();
}

const fluxoVistoria = {
  'Agendada': { para: 'Realizada', texto: v => `Vistoria ${v.id} realizada.` },
  'Realizada': { para: 'Laudo em revisão', texto: v => `Laudo da vistoria ${v.id} em revisão.` },
  'Laudo em revisão': { para: 'Laudo entregue', texto: v => `Laudo da vistoria ${v.id} emitido e disponível no portal.` },
};
function avancarVistoria(vid) {
  const v = vistoria(vid), passo = fluxoVistoria[v.status];
  if (!passo) return;
  v.status = passo.para;
  if (v.status === 'Laudo entregue' && v.propostaId) {
    const p = proposta(v.propostaId);
    db.financeiro.push({ id: proximoId('F', db.financeiro), clienteId: v.clienteId, desc: `Saldo, 50% (${p.id})`, valor: p.valor / 2, venc: somarDias(HOJE, 10), status: 'A receber' });
  }
  registrar(passo.texto(v), 'Equipe', v.clienteId);
  salvarDb();
}

function pagar(fid) {
  const f = db.financeiro.find(x => x.id === fid);
  f.status = 'Pago';
  registrar(`${nomeCliente(f.clienteId)} pagou a cobrança ${f.id} por Pix.`, 'Portal', f.clienteId);
  salvarDb();
}

/* ---------- sessão ---------- */
const sessao = () => { try { return JSON.parse(localStorage.getItem(CHAVE_SESSAO)); } catch (e) { return null; } };
const entrar = s => { try { localStorage.setItem(CHAVE_SESSAO, JSON.stringify(s)); } catch (e) { /* ignora */ } };
const sair = () => { try { localStorage.removeItem(CHAVE_SESSAO); } catch (e) { /* ignora */ } };

/* ---------- interface comum ---------- */
function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// Barra da demonstração: troca de papel sem passar pelo login.
function barraDemo(atual) {
  const itens = [
    ['site', 'index.html', 'Site'],
    ['portal', 'portal.html', 'Portal do cliente'],
    ['admin', 'admin.html', 'Painel da equipe'],
  ];
  document.body.insertAdjacentHTML('beforeend', `
    <nav class="demo-barra" aria-label="Demonstração">
      <span class="demo-rotulo">Ver como</span>
      ${itens.map(([k, href, nome]) => `<a href="${href}" data-papel="${k}" ${k === atual ? 'aria-current="page"' : ''}>${nome}</a>`).join('')}
      <button type="button" id="demo-zerar" title="Volta aos dados de exemplo">Reiniciar dados</button>
    </nav>`);
  document.querySelector('[data-papel="portal"]').addEventListener('click', () => { if (sessao()?.tipo !== 'cliente') entrar({ tipo: 'cliente', clienteId: 'C-02' }); });
  document.querySelector('[data-papel="admin"]').addEventListener('click', () => entrar({ tipo: 'equipe' }));
  document.getElementById('demo-zerar').addEventListener('click', () => {
    if (!confirm('Apagar o que foi feito na demonstração e voltar aos dados de exemplo?')) return;
    reiniciarDb();
    location.reload();
  });
}
