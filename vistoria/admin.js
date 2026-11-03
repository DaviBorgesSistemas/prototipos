if (sessao()?.tipo !== 'equipe') location.replace('entrar.html');

const principal = document.getElementById('principal');
const dialogo = document.getElementById('dialogo');
const dias = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 86400000);

const toneStatus = { 'A agendar': 'moderada', 'Agendada': 'neutro', 'Realizada': 'aco', 'Laudo em revisão': 'moderada', 'Laudo entregue': 'leve',
  'Rascunho': 'neutro', 'Enviada': 'aco', 'Aprovada': 'leve', 'Recusada': 'grave',
  'Pago': 'leve', 'A receber': 'aco', 'Atrasado': 'grave', 'Novo': 'moderada', 'Proposta enviada': 'leve' };
const badge = s => `<span class="badge ${toneStatus[s] || 'neutro'}">${esc(s)}</span>`;
const iniciais = nome => `<span class="avatar" aria-hidden="true">${nome.split(' ').filter(p => p.length > 2).slice(0, 2).map(p => p[0]).join('').toUpperCase()}</span>`;
const cabeca = (titulo, sub, acao = '') => `<div class="cabeca"><div><h1>${titulo}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${acao}</div>`;

// Apontamentos do app de campo (mesmo navegador) têm prioridade sobre os de exemplo.
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
};
function apontamentosDe(id) {
  try {
    const app = JSON.parse(localStorage.getItem('prumo_apontamentos_v1'));
    const doApp = app && app.filter(a => a.vistoria === id);
    if (doApp && doApp.length) return { lista: doApp, origem: 'app' };
  } catch (e) { /* usa os de exemplo */ }
  return { lista: apontamentosBase[id] || [], origem: 'exemplo' };
}

/* ---------- roteamento ---------- */
const mapa = { painel, pedidos: pedidosView, vistorias: vistoriasView, laudo, clientes: clientesView, propostas: propostasView, equipe: equipeView, financeiro: financeiroView };

function rotear() {
  const [nome, param] = (location.hash.slice(1) || 'painel').split('/');
  (mapa[nome] || painel)(param);
  document.querySelectorAll('#nav a').forEach(a => {
    if (a.getAttribute('href') === '#' + (mapa[nome] ? nome : 'painel')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const novos = db.pedidos.filter(p => p.status === 'Novo').length;
  const cont = document.getElementById('cont-pedidos');
  cont.hidden = !novos;
  cont.textContent = novos;
}
window.addEventListener('hashchange', () => { rotear(); principal.focus({ preventScroll: true }); window.scrollTo(0, 0); });
aoMudar(() => { if (!dialogo.open) rotear(); });
document.getElementById('sair').addEventListener('click', sair);

function ligar() {
  principal.querySelectorAll('[data-ir]').forEach(el => el.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    location.hash = el.dataset.ir;
  }));
  principal.querySelectorAll('[data-acao]').forEach(b => b.addEventListener('click', () => acoes[b.dataset.acao](b.dataset.id)));
}

// Botões que mudam o estado compartilhado: o portal do cliente reflete na hora.
const acoes = {
  proposta: id => dialogoProposta(id),
  enviar: id => { enviarRascunho(id); rotear(); toast(`Proposta ${id} enviada. Já aparece no portal do cliente.`); },
  contrato: id => contratoServico(id),
  agendar: id => dialogoAgenda(id),
  avancar: id => { avancarVistoria(id); rotear(); toast(`Vistoria ${id}: ${vistoria(id).status.toLowerCase()}.`); },
  cobrar: id => toast(`Lembrete de pagamento da ${id} enviado ao cliente (simulado).`),
};

/* ---------- painel ---------- */
function pendencias() {
  const itens = [];
  db.pedidos.filter(p => p.status === 'Novo').forEach(p => itens.push({ ir: 'pedidos', tom: 'ouro', icone: 'mensagem', t: `Pedido ${p.id}, ${nomeCliente(p.clienteId)}`, s: `Chegou pelo site em ${dataBR(p.data)}`, a: 'Criar proposta' }));
  db.propostas.filter(p => p.status === 'Aprovada' && p.contrato === 'nenhum').forEach(p => itens.push({ ir: 'propostas', tom: '', icone: 'assinatura', t: `Proposta ${p.id} aprovada`, s: `${nomeCliente(p.clienteId)}, falta enviar o contrato`, a: 'Gerar contrato' }));
  db.vistorias.filter(v => v.status === 'A agendar').forEach(v => itens.push({ ir: 'vistorias', tom: 'moderada', icone: 'calendario', t: `Vistoria ${v.id} sem data`, s: `${nomeCliente(v.clienteId)} assinou o contrato`, a: 'Agendar' }));
  db.vistorias.filter(v => v.status === 'Realizada' || v.status === 'Laudo em revisão').forEach(v => itens.push({ ir: `laudo/${v.id}`, tom: 'ouro', icone: 'laudo', t: `Laudo ${v.id}, ${nomeCliente(v.clienteId)}`, s: v.status === 'Realizada' ? 'Vistoria feita, apontamentos recebidos' : 'Em revisão', a: v.status === 'Realizada' ? 'Revisar' : 'Emitir' }));
  db.financeiro.filter(f => f.status === 'Atrasado').forEach(f => itens.push({ ir: 'financeiro', tom: 'grave', icone: 'alerta', t: `Cobrança ${f.id} atrasada`, s: `${nomeCliente(f.clienteId)}, ${dinheiro(f.valor)}`, a: 'Cobrar' }));
  return itens;
}

function painel() {
  const semana = db.vistorias.filter(v => v.status === 'Agendada' || (v.data === HOJE && v.status === 'Realizada')).length;
  const revisao = db.vistorias.filter(v => v.status === 'Laudo em revisão' || v.status === 'Realizada').length;
  const aguardando = db.propostas.filter(p => p.status === 'Enviada').length;
  const receber = db.financeiro.filter(f => f.status !== 'Pago').reduce((s, f) => s + f.valor, 0);
  const hoje = db.vistorias.filter(v => v.data === HOJE);
  const pend = pendencias();
  principal.innerHTML = `
    ${cabeca('Painel', 'Sexta, 30 de outubro de 2026')}
    <div class="numeros">
      <div class="numero"><span class="icone-caixa">${ic('calendario')}</span><b>${semana}</b><span>vistorias na agenda</span></div>
      <div class="numero"><span class="icone-caixa ouro">${ic('laudo')}</span><b>${revisao}</b><span>laudos para revisar</span></div>
      <div class="numero"><span class="icone-caixa">${ic('enviar')}</span><b>${aguardando}</b><span>propostas aguardando o cliente</span></div>
      <div class="numero destaque"><span class="icone-caixa escuro">${ic('carteira')}</span><b>${dinheiro(receber).replace(',00', '')}</b><span>a receber</span></div>
    </div>
    <div class="duas">
      <section class="secao">
        <div class="secao-cabeca"><h2 class="sec">Precisa da sua atenção</h2><span class="badge ${pend.length ? 'moderada' : 'leve'}">${pend.length || 'Nada'} pendente${pend.length === 1 ? '' : 's'}</span></div>
        <ul class="tarefas">
          ${pend.map(i => `<li data-ir="${i.ir}"><span class="icone-caixa ${i.tom}">${ic(i.icone)}</span><div><strong>${esc(i.t)}</strong><small>${esc(i.s)}</small></div><span class="acao">${i.a} ${ic('seta')}</span></li>`).join('') || '<li><div><small>Tudo em dia.</small></div></li>'}
        </ul>
      </section>
      <section class="secao">
        <div class="secao-cabeca"><h2 class="sec">Vistorias de hoje</h2><a href="#vistorias">Ver todas ${ic('seta')}</a></div>
        <div class="tabela-rolar"><table><thead><tr><th>Cliente</th><th>Hora</th><th>Situação</th></tr></thead><tbody>
          ${hoje.map(v => `<tr class="clicavel" data-ir="laudo/${v.id}"><td>${esc(nomeCliente(v.clienteId))}<span class="sub">${esc(v.endereco)}</span></td><td>${v.hora}</td><td>${badge(v.status)}</td></tr>`).join('') || '<tr><td colspan="3" class="vazio-tab">Nenhuma vistoria hoje.</td></tr>'}
        </tbody></table></div>
      </section>
    </div>
    <section class="secao painel-largo">
      <div class="secao-cabeca"><h2 class="sec">Atividade recente</h2><span class="sub" style="font-size:.82rem;color:var(--texto-2)">Site, portal e equipe no mesmo lugar</span></div>
      <ul class="atividade">
        ${db.atividades.slice(0, 8).map(a => `<li><time>${quandoBR(a.quando)}</time><span>${esc(a.texto)}</span><span class="origem ${a.origem}">${a.origem}</span></li>`).join('')}
      </ul>
    </section>`;
  ligar();
}

/* ---------- pedidos do site ---------- */
function pedidosView() {
  principal.innerHTML = `
    ${cabeca('Pedidos do site', 'O formulário de orçamento da landing page cai aqui. Cada pedido vira cliente e pode virar proposta.')}
    <div class="tabela-rolar"><table><thead><tr><th>Código</th><th>Cliente e mensagem</th><th>Imóvel</th><th>Recebido</th><th>Situação</th><th></th></tr></thead><tbody>
      ${db.pedidos.map(p => { const c = cliente(p.clienteId); return `<tr><td class="cod">${p.id}</td>
        <td><span class="pessoa">${iniciais(c.nome)}<span>${esc(c.nome)}<span class="sub">${esc(c.email || c.telefone)}</span></span></span><p class="mensagem-pedido">"${esc(p.mensagem)}"</p></td>
        <td>${esc(p.tipo)}<span class="sub">${esc(p.cidade)}</span></td><td>${dataBR(p.data)}</td><td>${badge(p.status)}</td>
        <td>${p.status === 'Novo' ? `<button class="btn ouro pequeno" data-acao="proposta" data-id="${p.id}">${ic('enviar')}Criar proposta</button>` : ''}</td></tr>`; }).join('')
        || '<tr><td colspan="6" class="vazio-tab">Nenhum pedido ainda. Envie um pelo formulário do site.</td></tr>'}
    </tbody></table></div>`;
  ligar();
}

function dialogoProposta(pedidoId) {
  const ped = db.pedidos.find(p => p.id === pedidoId), c = cliente(ped.clienteId);
  dialogo.innerHTML = `
    <h2>Nova proposta para ${esc(c.nome)}</h2>
    <p class="aviso-box">${ic('mensagem')}<span>"${esc(ped.mensagem)}"</span></p>
    <form class="dialog-form" id="f-prop">
      <div class="largo"><label for="p-serv">Serviço</label><input id="p-serv" value="Vistoria e laudo de patologia" required></div>
      <div><label for="p-valor">Valor (R$)</label><input id="p-valor" type="number" min="0" step="50" value="2400" required></div>
      <div><label for="p-cidade">Cidade</label><input id="p-cidade" value="${esc(ped.cidade)}" disabled></div>
      <div class="largo"><label for="p-end">Endereço da vistoria</label><input id="p-end" value="${esc(c.endereco)}" placeholder="Rua, número, complemento" required></div>
      <div class="largo dialog-acoes">
        <button class="btn sec" type="button" id="d-cancelar">Cancelar</button>
        <button class="btn ouro" type="submit">${ic('enviar')}Enviar ao portal do cliente</button>
      </div>
    </form>`;
  dialogo.showModal();
  document.getElementById('d-cancelar').addEventListener('click', () => dialogo.close());
  document.getElementById('f-prop').addEventListener('submit', e => {
    e.preventDefault();
    const end = document.getElementById('p-end').value.trim();
    const p = criarProposta(c.id, document.getElementById('p-serv').value.trim(), Number(document.getElementById('p-valor').value), end && `${end}, ${ped.cidade}`, ped.id);
    dialogo.close();
    rotear();
    toast(`Proposta ${p.id} enviada. ${c.nome.split(' ')[0]} já vê no portal.`);
  });
}

/* ---------- vistorias ---------- */
let filtroVist = 'Todas';
function vistoriasView() {
  const estados = ['Todas', 'A agendar', 'Agendada', 'Realizada', 'Laudo em revisão', 'Laudo entregue'];
  const lista = db.vistorias.filter(v => filtroVist === 'Todas' || v.status === filtroVist).slice().reverse();
  const botao = v => ({
    'A agendar': `<button class="btn ouro pequeno" data-acao="agendar" data-id="${v.id}">${ic('calendario')}Agendar</button>`,
    'Agendada': `<button class="btn pequeno" data-acao="avancar" data-id="${v.id}">${ic('check')}Marcar realizada</button>`,
  }[v.status] || '');
  principal.innerHTML = `
    ${cabeca('Vistorias', 'Toque numa linha para abrir o laudo.')}
    <div class="filtros" role="group" aria-label="Filtrar por situação">
      ${estados.map(e => `<button type="button" aria-pressed="${e === filtroVist}" data-f="${e}">${e}</button>`).join('')}
    </div>
    <div class="tabela-rolar"><table><thead><tr><th>Código</th><th>Cliente</th><th>Data</th><th>Responsável</th><th>Apontamentos</th><th>Situação</th><th></th></tr></thead><tbody>
      ${lista.map(v => `<tr class="clicavel" data-ir="laudo/${v.id}"><td class="cod">${v.id}</td><td>${esc(nomeCliente(v.clienteId))}<span class="sub">${esc(v.endereco)}</span></td><td>${v.data ? `${dataBR(v.data)}<span class="sub">${v.hora}</span>` : '-'}</td><td>${esc(v.resp) || '-'}</td><td>${apontamentosDe(v.id).lista.length}</td><td>${badge(v.status)}</td><td>${botao(v)}</td></tr>`).join('') || '<tr><td colspan="7" class="vazio-tab">Nenhuma vistoria com essa situação.</td></tr>'}
    </tbody></table></div>`;
  principal.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { filtroVist = b.dataset.f; vistoriasView(); }));
  ligar();
}

function dialogoAgenda(vid) {
  const v = vistoria(vid);
  dialogo.innerHTML = `
    <h2>Agendar vistoria ${v.id}</h2>
    <p class="aviso-box">${ic('pino')}<span>${esc(nomeCliente(v.clienteId))}, ${esc(v.endereco)}</span></p>
    <form class="dialog-form" id="f-agenda">
      <div><label for="a-data">Data</label><input id="a-data" type="date" value="${somarDias(HOJE, 4)}" min="${HOJE}" required></div>
      <div><label for="a-hora">Hora</label><input id="a-hora" type="time" value="10:00" required></div>
      <div class="largo"><label for="a-resp">Responsável</label><select id="a-resp"><option>Engenheira (sócia)</option><option>Arquiteta</option></select></div>
      <div class="largo dialog-acoes">
        <button class="btn sec" type="button" id="d-cancelar">Cancelar</button>
        <button class="btn ouro" type="submit">${ic('calendario')}Confirmar e avisar o cliente</button>
      </div>
    </form>`;
  dialogo.showModal();
  document.getElementById('d-cancelar').addEventListener('click', () => dialogo.close());
  document.getElementById('f-agenda').addEventListener('submit', e => {
    e.preventDefault();
    agendarVistoria(v.id, document.getElementById('a-data').value, document.getElementById('a-hora').value, document.getElementById('a-resp').value);
    dialogo.close();
    rotear();
    toast(`Vistoria ${v.id} agendada. A data já aparece no portal do cliente.`);
  });
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

function conclusaoPadrao(lista) {
  if (!lista.length) return 'Sem apontamentos registrados até o momento.';
  if (lista.some(a => a.severidade === 'grave')) return 'Há manifestações de gravidade alta que exigem avaliação estrutural prioritária. Recomenda-se isolar a área afetada e iniciar o monitoramento imediatamente.';
  if (lista.some(a => a.severidade === 'moderada')) return 'As manifestações observadas têm gravidade moderada e tendem a evoluir sem intervenção. Recomenda-se tratar as causas nos próximos meses.';
  return 'As manifestações observadas têm gravidade leve. Recomenda-se acompanhamento periódico e correção estética após tratar a causa.';
}

function laudo(idParam) {
  const comLaudo = db.vistorias.filter(x => !['A agendar', 'Agendada'].includes(x.status));
  const v = vistoria(idParam) || comLaudo.find(x => x.status === 'Realizada') || comLaudo[0];
  const modelo = v.modelo || 'patologia';
  const { lista, origem } = apontamentosDe(v.id);
  const concl = db.conclusoes[v.id] ?? conclusaoPadrao(lista);
  const acao = {
    'Realizada': `<button class="btn" type="button" data-acao="avancar" data-id="${v.id}">${ic('check')}Enviar para revisão</button>`,
    'Laudo em revisão': `<button class="btn ouro" type="button" data-acao="avancar" data-id="${v.id}">${ic('enviar')}Emitir e liberar no portal</button>`,
    'Laudo entregue': '<span class="badge leve">Entregue ao cliente</span>',
  }[v.status] || badge(v.status);

  principal.innerHTML = `
    ${cabeca('Laudo', 'Os apontamentos do campo entram no documento sem redigitar.', `<div class="acoes-linha"><button class="btn sec" type="button" id="imprimir">${ic('imprimir')}Imprimir ou PDF</button>${acao}</div>`)}
    <div class="laudo-grade">
      <div class="controles">
        <div><label for="sel-vist">Vistoria</label>
          <select id="sel-vist">${(comLaudo.includes(v) ? comLaudo : [v, ...comLaudo]).map(x => `<option value="${x.id}" ${x.id === v.id ? 'selected' : ''}>${x.id}, ${esc(nomeCliente(x.clienteId))}</option>`).join('')}</select></div>
        <div><label for="sel-modelo">Modelo</label>
          <select id="sel-modelo">${Object.entries(modelos).map(([k, m]) => `<option value="${k}" ${k === modelo ? 'selected' : ''}>${m.nome}</option>`).join('')}</select></div>
        <div><label for="concl">Conclusão técnica</label>
          <textarea id="concl" rows="7">${esc(concl)}</textarea></div>
        <p class="aviso-box">${ic('nuvem')}<span>Apontamentos ${origem === 'app' ? 'do app de campo' : 'de exemplo'}: ${lista.length}.</span></p>
      </div>

      <article class="folha" id="folha">
        <div class="folha-marca"><img src="shared/img/logo.png" alt="Fidelix & Cavalcante, Engenharia Diagnóstica"><span>contato@exemplo.com.br<br>(48) 90000-0000</span></div>
        <div class="folha-corpo">
        <h1>${modelos[modelo].titulo}</h1>
        <p class="cab">Código ${v.id}. Emitido em ${dataBR(HOJE)}.</p>
        <dl>
          <dt>Cliente</dt><dd>${esc(nomeCliente(v.clienteId))}</dd>
          <dt>Endereço</dt><dd>${esc(v.endereco)}</dd>
          <dt>Data da vistoria</dt><dd>${dataBR(v.data) || 'A agendar'}</dd>
          <dt>Responsável</dt><dd>${esc(v.resp) || '-'}</dd>
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
  document.getElementById('sel-modelo').addEventListener('change', e => { v.modelo = e.target.value; salvarDb(); laudo(v.id); });
  document.getElementById('concl').addEventListener('input', e => {
    db.conclusoes[v.id] = e.target.value;
    salvarDb();
    document.getElementById('folha-concl').textContent = e.target.value;
  });
  document.getElementById('imprimir').addEventListener('click', () => window.print());
  ligar();
}

/* ---------- clientes ---------- */
function clientesView() {
  principal.innerHTML = `
    ${cabeca('Clientes', 'Quem pede orçamento pelo site entra aqui automaticamente e já pode usar o portal.')}
    <div class="tabela-rolar"><table><thead><tr><th>Cliente</th><th>Tipo</th><th>Contato</th><th>Cidade</th><th>Origem</th><th class="num">Vistorias</th></tr></thead><tbody>
      ${db.clientes.map(c => `<tr><td><span class="pessoa">${iniciais(c.nome)}${esc(c.nome)}</span></td><td>${esc(c.tipo)}</td><td>${esc(c.email)}<span class="sub">${esc(c.telefone)}</span></td><td>${esc(c.cidade)}</td><td><span class="origem ${c.origem}">${esc(c.origem)}</span></td><td class="num">${db.vistorias.filter(v => v.clienteId === c.id).length}</td></tr>`).join('')}
    </tbody></table></div>`;
}

/* ---------- propostas e contratos de serviço ---------- */
function propostasView() {
  const contrato = p => {
    if (p.status === 'Rascunho') return `<button class="btn pequeno" data-acao="enviar" data-id="${p.id}">${ic('enviar')}Enviar ao cliente</button>`;
    if (p.status !== 'Aprovada') return '<span class="sub">Aguardando o cliente</span>';
    if (p.contrato === 'nenhum') return `<button class="btn ouro pequeno" data-acao="contrato" data-id="${p.id}">${ic('assinatura')}Gerar contrato</button>`;
    return p.contrato === 'enviado' ? '<span class="badge aco">Aguardando assinatura</span>' : '<span class="badge leve">Contrato assinado</span>';
  };
  principal.innerHTML = `
    ${cabeca('Propostas', 'O cliente aprova pelo portal. Proposta aprovada gera o contrato de prestação de serviço.')}
    <div class="tabela-rolar"><table><thead><tr><th>Código</th><th>Cliente e serviço</th><th class="num">Valor</th><th>Validade</th><th>Situação</th><th></th></tr></thead><tbody>
      ${db.propostas.slice().reverse().map(p => `<tr><td class="cod">${p.id}</td><td>${esc(nomeCliente(p.clienteId))}<span class="sub">${esc(p.servico)}</span></td><td class="num">${dinheiro(p.valor)}</td><td>${dataBR(p.validade)}</td><td>${badge(p.status)}</td><td>${contrato(p)}</td></tr>`).join('')}
    </tbody></table></div>`;
  ligar();
}

function contratoServico(id) {
  const p = proposta(id);
  dialogo.innerHTML = `
    <h2>Contrato de prestação de serviço</h2>
    <p class="aviso-box">${ic('alerta')}<span>Rascunho gerado a partir da proposta ${p.id}. Revise o modelo com um advogado antes de usar.</span></p>
    <div class="contrato-texto">
      <h3>Partes</h3><p><strong>Contratada:</strong> Fidelix &amp; Cavalcante Engenharia Diagnóstica, CNPJ 00.000.000/0001-00.<br><strong>Contratante:</strong> ${esc(nomeCliente(p.clienteId))}.</p>
      <h3>Objeto</h3><p>${esc(p.servico)}.</p>
      <h3>Valor e pagamento</h3><p>${dinheiro(p.valor)}, conforme condições da proposta ${p.id}.</p>
      <h3>Prazo</h3><p>Vistoria em até 10 dias úteis após a assinatura. Laudo em até 7 dias úteis após a vistoria.</p>
      <h3>Responsabilidade técnica</h3><p>O laudo será assinado por profissional habilitada, com a respectiva ART/RRT.</p>
    </div>
    <div class="dialog-acoes">
      <button class="btn sec" type="button" id="d-fechar">Fechar</button>
      <button class="btn ouro" type="button" id="d-enviar">${ic('enviar')}Enviar para assinatura no portal</button>
    </div>`;
  dialogo.showModal();
  document.getElementById('d-fechar').addEventListener('click', () => dialogo.close());
  document.getElementById('d-enviar').addEventListener('click', () => {
    enviarContrato(p.id);
    dialogo.close();
    rotear();
    toast('Contrato enviado. O cliente assina pelo portal.');
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
      ${db.equipe.map(e => `<tr><td><span class="pessoa">${iniciais(e.nome)}${esc(e.nome)}</span></td><td>${esc(e.funcao)}</td><td>${esc(e.vinculo)}</td><td>${dataBR(e.inicio)}</td><td>${e.fim ? dataBR(e.fim) : '-'}</td><td>${situacaoContrato(e)}</td></tr>`).join('')}
    </tbody></table></div>`;
  document.getElementById('novo-contrato').addEventListener('click', novoContrato);
}
function novoContrato() {
  dialogo.innerHTML = `
    <h2>Novo contrato de pessoa</h2>
    <form class="dialog-form" id="f-contrato">
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
    db.equipe.push({
      nome: document.getElementById('n-nome').value.trim(),
      funcao: document.getElementById('n-funcao').value.trim(),
      vinculo: document.getElementById('n-vinculo').value,
      inicio: document.getElementById('n-inicio').value,
      fim: document.getElementById('n-fim').value,
    });
    salvarDb();
    dialogo.close();
    equipeView();
    toast('Contrato salvo.');
  });
}

/* ---------- financeiro ---------- */
function financeiroView() {
  const total = s => db.financeiro.filter(f => f.status === s).reduce((a, f) => a + f.valor, 0);
  principal.innerHTML = `
    ${cabeca('Financeiro', 'Cobranças geradas pelas propostas aprovadas e pelos laudos entregues. Pagamentos por Pix no portal baixam aqui.')}
    <div class="numeros">
      <div class="numero"><span class="icone-caixa" style="background:var(--leve-bg);color:var(--leve)">${ic('check')}</span><b>${dinheiro(total('Pago')).replace(',00', '')}</b><span>recebido</span></div>
      <div class="numero destaque"><span class="icone-caixa escuro">${ic('carteira')}</span><b>${dinheiro(total('A receber')).replace(',00', '')}</b><span>a receber</span></div>
      <div class="numero"><span class="icone-caixa" style="background:var(--grave-bg);color:var(--grave)">${ic('alerta')}</span><b>${dinheiro(total('Atrasado')).replace(',00', '')}</b><span>em atraso</span></div>
      <div class="numero"><span class="icone-caixa">${ic('laudo')}</span><b>${db.financeiro.length}</b><span>cobranças</span></div>
    </div>
    <div class="tabela-rolar"><table><thead><tr><th>Código</th><th>Cliente e descrição</th><th>Vencimento</th><th class="num">Valor</th><th>Situação</th><th></th></tr></thead><tbody>
      ${db.financeiro.slice().reverse().map(f => `<tr><td class="cod">${f.id}</td><td>${esc(nomeCliente(f.clienteId))}<span class="sub">${esc(f.desc)}</span></td><td>${dataBR(f.venc)}</td><td class="num">${dinheiro(f.valor)}</td><td>${badge(f.status)}</td><td>${f.status === 'Atrasado' ? `<button class="btn sec pequeno" data-acao="cobrar" data-id="${f.id}">Cobrar</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div>`;
  ligar();
}

barraDemo('admin');
rotear();
