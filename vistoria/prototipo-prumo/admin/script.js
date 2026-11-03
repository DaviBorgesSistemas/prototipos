// Data fixa para a demonstração ficar estável (no sistema real seria a data do dia).
const HOJE = '2026-10-30';

const principal = document.getElementById('principal');
const dialogo = document.getElementById('dialogo');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dinheiro = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = iso => iso ? iso.split('-').reverse().join('/') : '';
const dias = (a, b) => Math.round((Date.UTC(...b.split('-').map((v, i) => i === 1 ? v - 1 : +v)) - Date.UTC(...a.split('-').map((v, i) => i === 1 ? v - 1 : +v))) / 86400000);

/* ---------- dados de exemplo ---------- */
const clientes = [
  { id: 'C-01', nome: 'Condomínio Aurora', tipo: 'Condomínio', contato: 'sindico@exemplo.com.br', cidade: 'Florianópolis' },
  { id: 'C-02', nome: 'Marina Alves', tipo: 'Apartamento', contato: '(48) 90000-0001', cidade: 'Florianópolis' },
  { id: 'C-03', nome: 'Oficina Rocha', tipo: 'Comercial', contato: '(48) 90000-0002', cidade: 'São José' },
  { id: 'C-04', nome: 'Paulo Menezes', tipo: 'Casa', contato: 'paulo@exemplo.com.br', cidade: 'Palhoça' },
];

const vistorias = [
  { id: 'VST-021', cliente: 'Condomínio Aurora', endereco: 'Rua das Acácias, 120, bloco B, Florianópolis', data: '2026-10-30', resp: 'Engenheira (sócia)', status: 'Realizada' },
  { id: 'VST-022', cliente: 'Marina Alves', endereco: 'Av. Beira Mar, 540, ap. 302, Florianópolis', data: '2026-10-30', resp: 'Engenheira (sócia)', status: 'Agendada' },
  { id: 'VST-023', cliente: 'Oficina Rocha', endereco: 'Rua Industrial, 88, São José', data: '2026-10-30', resp: 'Arquiteta', status: 'Agendada' },
  { id: 'VST-019', cliente: 'Paulo Menezes', endereco: 'Rua dos Ipês, 45, Palhoça', data: '2026-10-27', resp: 'Engenheira (sócia)', status: 'Laudo em revisão' },
  { id: 'VST-017', cliente: 'Marina Alves', endereco: 'Av. Beira Mar, 540, ap. 302, Florianópolis', data: '2026-10-20', resp: 'Arquiteta', status: 'Laudo entregue' },
];

const apontamentosBase = {
  'VST-021': [
    { patologia: 'Infiltração', local: 'Garagem', severidade: 'moderada', medida: '', obs: 'Mancha úmida no teto, perto da junta de dilatação.' },
    { patologia: 'Trinca', local: 'Fachada', severidade: 'grave', medida: '1.2', obs: 'Trinca inclinada a partir do canto da janela do 2º andar.' },
  ],
  'VST-019': [
    { patologia: 'Umidade ascendente', local: 'Quarto', severidade: 'moderada', medida: '', obs: 'Pintura empolada até 80 cm do piso, sem calçada impermeável no lado externo.' },
    { patologia: 'Eflorescência', local: 'Muro', severidade: 'leve', medida: '', obs: 'Depósito branco na base do muro de divisa.' },
  ],
  'VST-017': [
    { patologia: 'Fissura', local: 'Sala', severidade: 'leve', medida: '0.3', obs: 'Fissura horizontal na união entre parede e laje.' },
  ],
  'VST-022': [], 'VST-023': [],
};

// Se o app de campo estiver aberto no mesmo navegador/servidor, usa os apontamentos dele.
function apontamentosDe(id) {
  try {
    const app = JSON.parse(localStorage.getItem('prumo_apontamentos_v1'));
    const doApp = app && app.filter(a => a.vistoria === id);
    if (doApp && doApp.length) return { lista: doApp, origem: 'app' };
  } catch (e) { /* usa os de exemplo */ }
  return { lista: apontamentosBase[id] || [], origem: 'exemplo' };
}

const propostas = [
  { id: 'P-044', cliente: 'Condomínio Aurora', servico: 'Vistoria e laudo de fachada', valor: 4800, status: 'Aprovada', validade: '2026-11-15', contrato: false },
  { id: 'P-045', cliente: 'Oficina Rocha', servico: 'Laudo de infiltração em cobertura', valor: 2600, status: 'Enviada', validade: '2026-11-10', contrato: false },
  { id: 'P-046', cliente: 'Marina Alves', servico: 'Vistoria cautelar do apartamento', valor: 1900, status: 'Enviada', validade: '2026-11-12', contrato: false },
  { id: 'P-047', cliente: 'Paulo Menezes', servico: 'Acompanhamento de reparo (3 visitas)', valor: 3300, status: 'Rascunho', validade: '2026-11-20', contrato: false },
  { id: 'P-041', cliente: 'Paulo Menezes', servico: 'Vistoria e laudo de umidade', valor: 2200, status: 'Aprovada', validade: '2026-10-20', contrato: true },
];

const equipe = [
  { nome: 'Nome da sócia', funcao: 'Engenheira civil', vinculo: 'Sócia', inicio: '2026-10-01', fim: '' },
  { nome: 'Nome da sócia', funcao: 'Engenheira civil', vinculo: 'Sócia', inicio: '2026-10-01', fim: '' },
  { nome: 'Nome da sócia', funcao: 'Arquiteta', vinculo: 'Sócia', inicio: '2026-10-01', fim: '' },
  { nome: 'Nome do funcionário', funcao: 'Comercial', vinculo: 'PJ', inicio: '2026-09-01', fim: '2026-12-15' },
  { nome: 'Nome da estagiária', funcao: 'Estagiária de engenharia', vinculo: 'Estágio', inicio: '2026-08-03', fim: '2027-02-03' },
];

const financeiro = [
  { id: 'F-112', cliente: 'Paulo Menezes', desc: 'Vistoria e laudo de umidade (P-041)', valor: 2200, venc: '2026-10-25', status: 'Atrasado' },
  { id: 'F-113', cliente: 'Condomínio Aurora', desc: 'Entrada, 50% (P-044)', valor: 2400, venc: '2026-11-05', status: 'A receber' },
  { id: 'F-114', cliente: 'Marina Alves', desc: 'Vistoria cautelar (VST-017)', valor: 1900, venc: '2026-10-22', status: 'Pago' },
  { id: 'F-115', cliente: 'Condomínio Aurora', desc: 'Saldo, 50% (P-044)', valor: 2400, venc: '2026-12-05', status: 'A receber' },
];

const toneStatus = { 'Agendada': 'neutro', 'Realizada': 'aco', 'Laudo em revisão': 'moderada', 'Laudo entregue': 'leve',
  'Rascunho': 'neutro', 'Enviada': 'aco', 'Aprovada': 'leve', 'Recusada': 'grave',
  'Pago': 'leve', 'A receber': 'aco', 'Atrasado': 'grave' };
const badge = s => `<span class="badge ${toneStatus[s] || 'neutro'}">${esc(s)}</span>`;
const iniciais = nome => `<span class="avatar" aria-hidden="true">${nome.split(' ').filter(p => p.length > 2).slice(0, 2).map(p => p[0]).join('').toUpperCase()}</span>`;

/* ---------- roteamento ---------- */
const rotas = { painel, vistoriasView, laudo, clientesView, propostasView, equipeView, financeiroView };
const mapa = { painel: painel, vistorias: vistoriasView, laudo, clientes: clientesView, propostas: propostasView, equipe: equipeView, financeiro: financeiroView };

function rotear() {
  const [nome, param] = (location.hash.slice(1) || 'painel').split('/');
  (mapa[nome] || painel)(param);
  document.querySelectorAll('#nav a').forEach(a => {
    if (a.getAttribute('href') === '#' + (mapa[nome] ? nome : 'painel')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  principal.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', rotear);

const cabeca = (titulo, sub, acao = '') => `<div class="cabeca"><div><h1>${titulo}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${acao}</div>`;

/* ---------- painel ---------- */
function painel() {
  const semana = vistorias.filter(v => ['Agendada', 'Realizada'].includes(v.status)).length;
  const revisao = vistorias.filter(v => v.status === 'Laudo em revisão' || v.status === 'Realizada').length;
  const aguardando = propostas.filter(p => p.status === 'Enviada').length;
  const receber = financeiro.filter(f => f.status !== 'Pago').reduce((s, f) => s + f.valor, 0);
  principal.innerHTML = `
    ${cabeca('Painel', 'Sexta, 30 de outubro de 2026')}
    <div class="numeros">
      <div class="numero"><span class="icone-caixa">${ic('calendario')}</span><b>${semana}</b><span>vistorias nesta semana</span></div>
      <div class="numero"><span class="icone-caixa ouro">${ic('laudo')}</span><b>${revisao}</b><span>laudos para revisar</span></div>
      <div class="numero"><span class="icone-caixa">${ic('enviar')}</span><b>${aguardando}</b><span>propostas aguardando resposta</span></div>
      <div class="numero destaque"><span class="icone-caixa escuro">${ic('carteira')}</span><b>${dinheiro(receber).replace(',00', '')}</b><span>a receber</span></div>
    </div>
    <div class="duas">
      <section class="secao">
        <div class="secao-cabeca"><h2 class="sec">Vistorias de hoje</h2><a href="#vistorias">Ver todas ${ic('seta')}</a></div>
        <div class="tabela-rolar"><table><thead><tr><th>Cliente</th><th>Responsável</th><th>Situação</th></tr></thead><tbody>
          ${vistorias.filter(v => v.data === HOJE).map(v => `<tr class="clicavel" data-ir="vistorias"><td>${esc(v.cliente)}<span class="sub">${esc(v.endereco)}</span></td><td>${esc(v.resp)}</td><td>${badge(v.status)}</td></tr>`).join('')}
        </tbody></table></div>
      </section>
      <section class="secao">
        <div class="secao-cabeca"><h2 class="sec">Precisa da sua atenção</h2></div>
        <ul class="tarefas">
          <li data-ir="laudo/VST-021"><span class="icone-caixa ouro">${ic('laudo')}</span><div><strong>Laudo VST-021, Condomínio Aurora</strong><small>Vistoria feita hoje, apontamentos recebidos</small></div><span class="acao">Revisar ${ic('seta')}</span></li>
          <li data-ir="laudo/VST-019"><span class="icone-caixa moderada">${ic('relogio')}</span><div><strong>Laudo VST-019, Paulo Menezes</strong><small>Em revisão desde 27/10</small></div><span class="acao">Finalizar ${ic('seta')}</span></li>
          <li data-ir="propostas"><span class="icone-caixa">${ic('assinatura')}</span><div><strong>Proposta P-044 aprovada</strong><small>Falta gerar o contrato</small></div><span class="acao">Gerar contrato ${ic('seta')}</span></li>
          <li data-ir="financeiro"><span class="icone-caixa grave">${ic('alerta')}</span><div><strong>Cobrança F-112 atrasada</strong><small>Paulo Menezes, ${dinheiro(2200)}</small></div><span class="acao">Cobrar ${ic('seta')}</span></li>
        </ul>
      </section>
    </div>`;
  ligarLinhas();
}

function ligarLinhas() {
  principal.querySelectorAll('[data-ir]').forEach(el => el.addEventListener('click', () => { location.hash = el.dataset.ir; }));
}

/* ---------- vistorias ---------- */
let filtroVist = 'Todas';
function vistoriasView() {
  const estados = ['Todas', 'Agendada', 'Realizada', 'Laudo em revisão', 'Laudo entregue'];
  const lista = vistorias.filter(v => filtroVist === 'Todas' || v.status === filtroVist);
  principal.innerHTML = `
    ${cabeca('Vistorias', 'Toque numa linha para abrir o laudo.')}
    <div class="filtros" role="group" aria-label="Filtrar por situação">
      ${estados.map(e => `<button type="button" aria-pressed="${e === filtroVist}" data-f="${e}">${e}</button>`).join('')}
    </div>
    <div class="tabela-rolar"><table><thead><tr><th>Código</th><th>Cliente</th><th>Data</th><th>Responsável</th><th>Apontamentos</th><th>Situação</th></tr></thead><tbody>
      ${lista.map(v => `<tr class="clicavel" data-ir="laudo/${v.id}"><td class="cod">${v.id}</td><td>${esc(v.cliente)}<span class="sub">${esc(v.endereco)}</span></td><td>${dataBR(v.data)}</td><td>${esc(v.resp)}</td><td>${apontamentosDe(v.id).lista.length}</td><td>${badge(v.status)}</td></tr>`).join('') || '<tr><td colspan="6">Nenhuma vistoria com essa situação.</td></tr>'}
    </tbody></table></div>`;
  principal.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { filtroVist = b.dataset.f; vistoriasView(); }));
  ligarLinhas();
}

/* ---------- laudo ---------- */
const recomendacoes = {
  'Infiltração': 'Localizar e eliminar a fonte de água (impermeabilização, junta ou tubulação) antes de refazer o revestimento.',
  'Trinca': 'Instalar selos de gesso para acompanhar a evolução por 30 a 60 dias e investigar a causa (movimentação térmica, recalque ou sobrecarga) antes de tratar.',
  'Fissura': 'Monitorar a abertura e tratar com material flexível se a fissura for estável.',
  'Rachadura': 'Avaliação estrutural imediata e escoramento, se necessário.',
  'Umidade ascendente': 'Executar barreira contra umidade do solo e corrigir a drenagem externa, depois recompor o reboco.',
  'Eflorescência': 'Escovar, tratar a origem da umidade e aplicar proteção hidrofugante.',
  'Corrosão de armadura': 'Remover o concreto degradado, tratar ou substituir a armadura e recompor com argamassa de reparo estrutural.',
};
const modelos = {
  patologia: { nome: 'Laudo de patologia', titulo: 'Laudo técnico de patologia', objetivo: 'Identificar as manifestações patológicas observadas, indicar suas causas prováveis e recomendar o tratamento.' },
  cautelar: { nome: 'Vistoria cautelar', titulo: 'Laudo de vistoria cautelar', objetivo: 'Registrar o estado atual do imóvel, com fotos e medições, para resguardar as partes antes de obras ou eventos que possam causar danos.' },
};
const conclusoes = {};

function conclusaoPadrao(lista) {
  if (!lista.length) return 'Sem apontamentos registrados até o momento.';
  if (lista.some(a => a.severidade === 'grave')) return 'Há manifestações de gravidade alta que exigem avaliação estrutural prioritária. Recomenda-se isolar a área afetada e iniciar o monitoramento imediatamente.';
  if (lista.some(a => a.severidade === 'moderada')) return 'As manifestações observadas têm gravidade moderada e tendem a evoluir sem intervenção. Recomenda-se tratar as causas nos próximos meses.';
  return 'As manifestações observadas têm gravidade leve. Recomenda-se acompanhamento periódico e correção estética após tratar a causa.';
}

function laudo(idParam) {
  const id = idParam || 'VST-021';
  const v = vistorias.find(x => x.id === id) || vistorias[0];
  const modelo = (principal.dataset.modelo || 'patologia');
  const { lista, origem } = apontamentosDe(v.id);
  const concl = conclusoes[v.id] ?? conclusaoPadrao(lista);

  principal.dataset.modelo = modelo;
  principal.innerHTML = `
    ${cabeca('Laudo', 'Os apontamentos do campo entram no documento sem redigitar.', `<button class="btn" type="button" id="imprimir">${ic('imprimir')}Imprimir ou salvar em PDF</button>`)}
    <div class="laudo-grade">
      <div class="controles">
        <div><label for="sel-vist">Vistoria</label>
          <select id="sel-vist">${vistorias.map(x => `<option value="${x.id}" ${x.id === v.id ? 'selected' : ''}>${x.id}, ${esc(x.cliente)}</option>`).join('')}</select></div>
        <div><label for="sel-modelo">Modelo</label>
          <select id="sel-modelo">${Object.entries(modelos).map(([k, m]) => `<option value="${k}" ${k === modelo ? 'selected' : ''}>${m.nome}</option>`).join('')}</select></div>
        <div><label for="concl">Conclusão técnica</label>
          <textarea id="concl" rows="7">${esc(concl)}</textarea></div>
        <p class="aviso-box">${ic('nuvem')}<span>Apontamentos de ${origem === 'app' ? 'o app de campo (mesmo navegador)' : 'exemplo'}: ${lista.length}.</span></p>
      </div>

      <article class="folha" id="folha">
        <div class="folha-marca"><img src="../shared/img/logo.png" alt="Fidelix & Cavalcante, Engenharia Diagnóstica"><span>contato@exemplo.com.br<br>(48) 90000-0000</span></div>
        <div class="folha-corpo">
        <h1>${modelos[modelo].titulo}</h1>
        <p class="cab">Código ${v.id}. Emitido em ${dataBR(HOJE)}.</p>
        <dl>
          <dt>Cliente</dt><dd>${esc(v.cliente)}</dd>
          <dt>Endereço</dt><dd>${esc(v.endereco)}</dd>
          <dt>Data da vistoria</dt><dd>${dataBR(v.data)}</dd>
          <dt>Responsável</dt><dd>${esc(v.resp)}</dd>
        </dl>
        <h2>1. Objetivo</h2>
        <p>${modelos[modelo].objetivo}</p>
        <h2>2. Metodologia</h2>
        <p>Inspeção visual no local, registro fotográfico e medição das aberturas com fissurômetro. Localização georreferenciada dos pontos principais.</p>
        <h2>3. Constatações</h2>
        ${lista.length ? `<table><thead><tr><th>Patologia</th><th>Local</th><th>Medida</th><th>Gravidade</th></tr></thead><tbody>
          ${lista.map(a => `<tr><td>${esc(a.patologia)}<span class="sub">${esc(a.obs)}</span></td><td>${esc(a.local)}</td><td>${a.medida ? String(a.medida).replace('.', ',') + ' mm' : '-'}</td><td class="sev-${a.severidade}">${{ leve: 'Leve', moderada: 'Moderada', grave: 'Grave' }[a.severidade]}</td></tr>`).join('')}
        </tbody></table>` : '<p>Sem apontamentos registrados.</p>'}
        <h2>4. Conclusão técnica</h2>
        <p id="folha-concl">${esc(concl)}</p>
        <h2>5. Recomendações</h2>
        ${lista.length ? `<ul>${[...new Set(lista.map(a => a.patologia))].map(p => `<li><strong>${esc(p)}:</strong> ${recomendacoes[p] || 'Avaliar a causa em campo e definir o tratamento.'}</li>`).join('')}</ul>` : '<p>Aguardando apontamentos.</p>'}
        <div class="assin">Nome da engenheira<br>Engenheira civil, CREA nº 00000</div>
        </div>
      </article>
    </div>`;

  document.getElementById('sel-vist').addEventListener('change', e => { location.hash = 'laudo/' + e.target.value; });
  document.getElementById('sel-modelo').addEventListener('change', e => { principal.dataset.modelo = e.target.value; laudo(v.id); });
  document.getElementById('concl').addEventListener('input', e => {
    conclusoes[v.id] = e.target.value;
    document.getElementById('folha-concl').textContent = e.target.value;
  });
  document.getElementById('imprimir').addEventListener('click', () => window.print());
}

/* ---------- clientes ---------- */
function clientesView() {
  principal.innerHTML = `
    ${cabeca('Clientes', 'Quem chega pela landing page entra aqui como pedido de orçamento.')}
    <div class="tabela-rolar"><table><thead><tr><th>Cliente</th><th>Tipo</th><th>Contato</th><th>Cidade</th><th class="num">Vistorias</th></tr></thead><tbody>
      ${clientes.map(c => `<tr><td><span class="pessoa">${iniciais(c.nome)}${esc(c.nome)}</span></td><td>${esc(c.tipo)}</td><td>${esc(c.contato)}</td><td>${esc(c.cidade)}</td><td class="num">${vistorias.filter(v => v.cliente === c.nome).length}</td></tr>`).join('')}
    </tbody></table></div>`;
}

/* ---------- propostas e contratos de serviço ---------- */
function propostasView() {
  principal.innerHTML = `
    ${cabeca('Propostas', 'Proposta aprovada gera o contrato de prestação de serviço.')}
    <div class="tabela-rolar"><table><thead><tr><th>Código</th><th>Cliente e serviço</th><th class="num">Valor</th><th>Validade</th><th>Situação</th><th></th></tr></thead><tbody>
      ${propostas.map(p => `<tr><td class="cod">${p.id}</td><td>${esc(p.cliente)}<span class="sub">${esc(p.servico)}</span></td><td class="num">${dinheiro(p.valor)}</td><td>${dataBR(p.validade)}</td><td>${badge(p.status)}</td>
        <td>${p.status === 'Aprovada' ? (p.contrato ? '<span class="badge leve">Contrato enviado</span>' : `<button class="btn pequeno" data-contrato="${p.id}">Gerar contrato</button>`) : ''}</td></tr>`).join('')}
    </tbody></table></div>`;
  principal.querySelectorAll('[data-contrato]').forEach(b => b.addEventListener('click', () => contratoServico(b.dataset.contrato)));
}

function contratoServico(id) {
  const p = propostas.find(x => x.id === id);
  dialogo.innerHTML = `
    <h2>Contrato de prestação de serviço</h2>
    <p class="aviso-box">${ic('alerta')}<span>Rascunho gerado a partir da proposta ${p.id}. Revise o modelo com um advogado antes de usar.</span></p>
    <div class="contrato-texto">
      <h3>Partes</h3><p><strong>Contratada:</strong> Fidelix &amp; Cavalcante Engenharia Diagnóstica, CNPJ 00.000.000/0001-00.<br><strong>Contratante:</strong> ${esc(p.cliente)}.</p>
      <h3>Objeto</h3><p>${esc(p.servico)}.</p>
      <h3>Valor e pagamento</h3><p>${dinheiro(p.valor)}, conforme condições da proposta ${p.id}.</p>
      <h3>Prazo</h3><p>Vistoria em até 10 dias úteis após a assinatura. Laudo em até 7 dias úteis após a vistoria.</p>
      <h3>Responsabilidade técnica</h3><p>O laudo será assinado por profissional habilitada, com a respectiva ART/RRT.</p>
    </div>
    <div class="dialog-acoes">
      <button class="btn sec" type="button" id="d-fechar">Fechar</button>
      <button class="btn ouro" type="button" id="d-enviar">${ic('enviar')}Enviar para assinatura</button>
    </div>`;
  dialogo.showModal();
  document.getElementById('d-fechar').addEventListener('click', () => dialogo.close());
  document.getElementById('d-enviar').addEventListener('click', () => {
    p.contrato = true;
    dialogo.close();
    propostasView();
    toast('Contrato enviado para assinatura (simulado).');
  });
}

/* ---------- equipe e contratos de pessoas ---------- */
function situacaoContrato(e) {
  if (!e.fim) return '<span class="badge neutro">Sem prazo</span>';
  const d = dias(HOJE, e.fim);
  if (d < 0) return '<span class="badge grave">Vencido</span>';
  if (d <= 60) return `<span class="badge moderada">Vence em ${d} dias</span>`;
  return '<span class="badge leve">Vigente</span>';
}
function equipeView() {
  principal.innerHTML = `
    ${cabeca('Equipe e contratos', 'Contratos de pessoas com vigência e alerta de vencimento. Sem folha de pagamento.', `<button class="btn" type="button" id="novo-contrato">${ic('mais')}Novo contrato</button>`)}
    <div class="tabela-rolar"><table><thead><tr><th>Pessoa</th><th>Função</th><th>Vínculo</th><th>Início</th><th>Fim</th><th>Situação</th></tr></thead><tbody>
      ${equipe.map(e => `<tr><td><span class="pessoa">${iniciais(e.nome)}${esc(e.nome)}</span></td><td>${esc(e.funcao)}</td><td>${esc(e.vinculo)}</td><td>${dataBR(e.inicio)}</td><td>${e.fim ? dataBR(e.fim) : '-'}</td><td>${situacaoContrato(e)}</td></tr>`).join('')}
    </tbody></table></div>`;
  document.getElementById('novo-contrato').addEventListener('click', novoContrato);
}
function novoContrato() {
  dialogo.innerHTML = `
    <h2>Novo contrato de pessoa</h2>
    <form class="dialog-form" id="f-contrato" method="dialog">
      <div class="largo"><label for="n-nome">Nome</label><input id="n-nome" required></div>
      <div><label for="n-funcao">Função</label><input id="n-funcao" placeholder="Ex.: Marketing" required></div>
      <div><label for="n-vinculo">Vínculo</label><select id="n-vinculo"><option>CLT</option><option>PJ</option><option>Estágio</option><option>Sócia</option></select></div>
      <div><label for="n-inicio">Início</label><input id="n-inicio" type="date" value="${HOJE}" required></div>
      <div><label for="n-fim">Fim (se houver)</label><input id="n-fim" type="date"></div>
      <div class="largo dialog-acoes">
        <button class="btn sec" type="button" id="d-cancelar">Cancelar</button>
        <button class="btn" type="submit">Salvar contrato</button>
      </div>
    </form>`;
  dialogo.showModal();
  document.getElementById('d-cancelar').addEventListener('click', () => dialogo.close());
  document.getElementById('f-contrato').addEventListener('submit', e => {
    e.preventDefault();
    equipe.push({
      nome: document.getElementById('n-nome').value.trim(),
      funcao: document.getElementById('n-funcao').value.trim(),
      vinculo: document.getElementById('n-vinculo').value,
      inicio: document.getElementById('n-inicio').value,
      fim: document.getElementById('n-fim').value,
    });
    dialogo.close();
    equipeView();
    toast('Contrato salvo.');
  });
}

/* ---------- financeiro ---------- */
function financeiroView() {
  const total = s => financeiro.filter(f => f.status === s).reduce((a, f) => a + f.valor, 0);
  principal.innerHTML = `
    ${cabeca('Financeiro', 'Cobranças por proposta e vistoria.')}
    <div class="numeros">
      <div class="numero"><span class="icone-caixa" style="background:var(--leve-bg);color:var(--leve)">${ic('check')}</span><b>${dinheiro(total('Pago')).replace(',00', '')}</b><span>recebido</span></div>
      <div class="numero destaque"><span class="icone-caixa escuro">${ic('carteira')}</span><b>${dinheiro(total('A receber')).replace(',00', '')}</b><span>a receber</span></div>
      <div class="numero"><span class="icone-caixa" style="background:var(--grave-bg);color:var(--grave)">${ic('alerta')}</span><b>${dinheiro(total('Atrasado')).replace(',00', '')}</b><span>em atraso</span></div>
      <div class="numero"><span class="icone-caixa">${ic('laudo')}</span><b>${financeiro.length}</b><span>cobranças</span></div>
    </div>
    <div class="tabela-rolar"><table><thead><tr><th>Código</th><th>Cliente e descrição</th><th>Vencimento</th><th class="num">Valor</th><th>Situação</th></tr></thead><tbody>
      ${financeiro.map(f => `<tr><td class="cod">${f.id}</td><td>${esc(f.cliente)}<span class="sub">${esc(f.desc)}</span></td><td>${dataBR(f.venc)}</td><td class="num">${dinheiro(f.valor)}</td><td>${badge(f.status)}</td></tr>`).join('')}
    </tbody></table></div>`;
}

function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

rotear();
