const s = sessao();
if (s?.tipo !== 'cliente') location.replace('entrar.html');

const $ = id => document.getElementById(id);
const dialogo = $('dialogo');
const etapas = ['Proposta aprovada', 'Contrato assinado', 'Vistoria realizada', 'Laudo em revisão', 'Laudo entregue'];
const etapaDaVistoria = { 'A agendar': 2, 'Agendada': 2, 'Realizada': 3, 'Laudo em revisão': 4, 'Laudo entregue': 5 };

// O serviço acompanhado é a proposta mais recente que a equipe já enviou.
function situacao(clienteId) {
  const p = db.propostas.filter(x => x.clienteId === clienteId && x.status !== 'Rascunho').at(-1);
  if (!p) return { p: null, v: null, etapa: -1 };
  const v = db.vistorias.find(x => x.propostaId === p.id) || null;
  let etapa = 0;
  if (p.status === 'Aprovada') etapa = p.contrato === 'assinado' ? etapaDaVistoria[v?.status] ?? 2 : 1;
  return { p, v, etapa };
}

function desenhar() {
  const c = cliente(s?.clienteId);
  if (!c) { sair(); location.replace('entrar.html'); return; }
  const { p, v, etapa } = situacao(c.id);

  $('avatar').textContent = c.nome.split(' ').filter(x => x.length > 2).slice(0, 2).map(x => x[0]).join('').toUpperCase();
  $('nome-cliente').textContent = c.nome;
  $('faixa-sobre').textContent = p ? `Proposta ${p.id}` : 'Pedido de orçamento';
  $('faixa-titulo').textContent = p ? p.servico : `Olá, ${c.nome.split(' ')[0]}`;
  $('faixa-endereco').innerHTML = `${ic('pino')}${esc(c.endereco || c.cidade || 'Endereço a confirmar')}`;

  // linha do tempo
  $('linha-tempo').innerHTML = etapas.map((nome, i) => {
    const cls = i < etapa ? 'feito' : i === etapa ? 'atual' : '';
    const extra = i === 2 && v?.status === 'Agendada' ? `<small>Combinada para ${dataBR(v.data)}, ${v.hora}</small>` : '';
    return `<li class="${cls}" ${cls === 'atual' ? 'aria-current="step"' : ''}>${nome}${extra}</li>`;
  }).join('');

  // próximo passo
  const aguarde = t => `<span class="aguarde">${ic('relogio')}${t}</span>`;
  let prox;
  if (!p) prox = { t: 'Recebemos seu pedido', p: 'A equipe está analisando as informações e vai enviar a proposta aqui no portal em até 2 dias úteis.', a: aguarde('Aguardando a equipe') };
  else if (etapa === 0) prox = { t: 'Aprove a proposta para começar', p: `Proposta ${p.id}: ${esc(p.servico.toLowerCase())}, no valor de ${dinheiro(p.valor)}. Válida até ${dataBR(p.validade)}.`, a: `<button class="btn sec" data-acao="ver-proposta">Ver proposta</button><button class="btn ouro" data-acao="aprovar">Aprovar proposta</button>` };
  else if (etapa === 1 && p.contrato === 'nenhum') prox = { t: 'Proposta aprovada', p: 'A equipe está preparando o contrato de prestação de serviço. Ele aparece aqui para você assinar.', a: aguarde('Aguardando o contrato') };
  else if (etapa === 1) prox = { t: 'Assine o contrato', p: 'Enviamos o contrato de prestação de serviço. Leia e assine digitalmente.', a: `<button class="btn sec" data-acao="ver-contrato">Ler contrato</button><button class="btn ouro" data-acao="assinar">Assinar contrato</button>` };
  else if (v?.status === 'A agendar') prox = { t: 'Vamos agendar a vistoria', p: 'A equipe vai confirmar a data e o horário com você. A data aparece aqui assim que for marcada.', a: aguarde('Aguardando agendamento') };
  else prox = [
    null, null,
    { t: 'Vistoria agendada', p: `A profissional vai até o imóvel em ${dataBR(v?.data)}, às ${v?.hora}. Se precisar remarcar, fale com a equipe.`, a: '' },
    { t: 'Vistoria concluída', p: 'A equipe está preparando o laudo com as fotos e medições.', a: '' },
    { t: 'Laudo em revisão', p: 'A engenheira está revisando o documento. Avisaremos por e-mail quando estiver pronto.', a: '' },
    { t: 'Seu laudo está pronto', p: 'Baixe o documento e guarde uma cópia. Ele também fica aqui no portal.', a: `<button class="btn ouro" data-acao="baixar-laudo" data-id="${v?.id}">${ic('download')}Baixar laudo</button>` },
  ][etapa];
  $('proximo').innerHTML = `<div><strong>${prox.t}</strong><p>${prox.p}</p></div><div style="display:flex;gap:.6rem;flex-wrap:wrap">${prox.a}</div>`;

  // documentos: o serviço atual e os laudos já entregues
  const docs = [];
  if (p) {
    docs.push(`<li><span class="nome"><span>Proposta ${p.id}<span class="nota">${etapa >= 1 ? 'Aprovada' : 'Aguardando sua aprovação'}</span></span></span><button class="btn sec pequeno" data-acao="ver-proposta">Baixar</button></li>`);
    const temContrato = p.contrato !== 'nenhum';
    docs.push(`<li><span class="nome ${temContrato ? '' : 'trancado'}"><span>Contrato de prestação de serviço<span class="nota">${!temContrato ? 'Disponível depois da aprovação' : p.contrato === 'enviado' ? 'Aguardando sua assinatura' : 'Assinado'}</span></span></span>${temContrato ? '<button class="btn sec pequeno" data-acao="ver-contrato">Baixar</button>' : ''}</li>`);
  }
  db.vistorias.filter(x => x.clienteId === c.id && (x.status === 'Laudo entregue' || x === v)).reverse().forEach(x => {
    const pronto = x.status === 'Laudo entregue';
    docs.push(`<li><span class="nome ${pronto ? '' : 'trancado'}"><span>Laudo ${x.id}<span class="nota">${pronto ? `Vistoria de ${dataBR(x.data)}` : 'Disponível quando for entregue'}</span></span></span>${pronto ? `<button class="btn sec pequeno" data-acao="baixar-laudo" data-id="${x.id}">Baixar</button>` : ''}</li>`);
  });
  $('docs').innerHTML = docs.join('') || '<li><span class="nome trancado"><span>Nenhum documento ainda<span class="nota">A proposta aparece aqui</span></span></span></li>';

  // pagamentos
  const cobr = db.financeiro.filter(f => f.clienteId === c.id).slice().reverse();
  $('pagamentos').innerHTML = cobr.map(f => `
    <tr><td>${esc(f.desc)}</td><td>${dataBR(f.venc)}</td><td class="num">${dinheiro(f.valor)}</td>
    <td class="num">${f.status === 'Pago' ? '<span class="badge leve">Pago</span>' : `<button class="btn pequeno" data-acao="pagar" data-id="${f.id}">${ic('pix')}Pagar com Pix</button>`}</td></tr>`).join('')
    || '<tr><td colspan="4">Nenhuma cobrança por enquanto.</td></tr>';

  // histórico do cliente
  $('historico').innerHTML = db.atividades.filter(a => a.clienteId === c.id).slice(0, 8)
    .map(a => `<li><span>${esc(a.texto)}<small>${quandoBR(a.quando)}</small></span></li>`).join('');
}

/* ---------- ações ---------- */
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-acao]');
  if (!b) return;
  const { p } = situacao(s.clienteId);
  const a = b.dataset.acao;
  if (a === 'ver-proposta') baixar(`proposta-${p.id}.txt`, `Proposta ${p.id}\n${p.servico}\nValor: ${dinheiro(p.valor)}\n(Documento de exemplo)`);
  if (a === 'ver-contrato') baixar('contrato-exemplo.txt', `Contrato de prestação de serviço\nObjeto: ${p.servico}\n(Documento de exemplo, sem validade)`);
  if (a === 'baixar-laudo') baixar(`laudo-${b.dataset.id}.txt`, `Laudo ${b.dataset.id}\n(Documento de exemplo. No sistema real, aqui vai o PDF emitido pelo painel.)`);
  if (a === 'aprovar') confirmar('Aprovar a proposta?', `Você aprova o serviço "${esc(p.servico)}" por ${dinheiro(p.valor)}. A equipe recebe o aviso e prepara o contrato.`, 'Aprovar proposta',
    () => { aprovarProposta(p.id); desenhar(); toast('Proposta aprovada. A equipe já foi avisada no painel.'); });
  if (a === 'assinar') confirmar('Assinar o contrato?', 'A assinatura digital tem validade jurídica. Confira os dados antes de continuar.', 'Assinar contrato',
    () => { assinarContrato(p.id); desenhar(); toast('Contrato assinado. A equipe vai agendar a vistoria.'); });
  if (a === 'pagar') pix(b.dataset.id);
});

$('sair').addEventListener('click', () => { sair(); location.href = 'index.html'; });

function confirmar(titulo, texto, rotulo, ok) {
  dialogo.innerHTML = `<h2>${titulo}</h2><p>${texto}</p>
    <div class="dialog-acoes"><button class="btn sec" id="d-nao" type="button">Cancelar</button><button class="btn ouro" id="d-sim" type="button">${rotulo}</button></div>`;
  dialogo.showModal();
  $('d-nao').addEventListener('click', () => dialogo.close());
  $('d-sim').addEventListener('click', () => { dialogo.close(); ok(); });
}

function pix(id) {
  const f = db.financeiro.find(x => x.id === id);
  dialogo.innerHTML = `<h2>Pagar com Pix</h2>
    <p>${esc(f.desc)}: <strong>${dinheiro(f.valor)}</strong>. Copie o código e cole no app do seu banco.</p>
    <p class="codigo" id="codigo">00020126580014br.gov.bcb.pix0136exemplo-fidelix-00-0000-000052040000530398654069500.005802BR5905FIDEL6009SAO PAULO62070503***6304ABCD</p>
    <div class="dialog-acoes">
      <button class="btn sec" id="d-copiar" type="button">Copiar código</button>
      <button class="btn ouro" id="d-pago" type="button">Já paguei (simulado)</button>
    </div>`;
  dialogo.showModal();
  $('d-copiar').addEventListener('click', () => {
    const txt = $('codigo').textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Código copiado.')).catch(() => toast('Selecione o código e copie manualmente.'));
  });
  $('d-pago').addEventListener('click', () => { pagar(id); dialogo.close(); desenhar(); toast('Pagamento registrado. Já aparece no financeiro da equipe.'); });
}

function baixar(nome, conteudo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

aoMudar(() => { if (!dialogo.open) desenhar(); });
barraDemo('portal');
desenhar();
