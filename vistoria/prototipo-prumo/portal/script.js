const etapas = ['Proposta aprovada', 'Contrato assinado', 'Vistoria realizada', 'Laudo em revisão', 'Laudo entregue'];
const datas = ['', '', 'Combinada para 12/11, 10h', '', ''];

const estadoInicial = () => ({ etapa: 0, pago: [false, false] });
let estado = estadoInicial();

const $ = id => document.getElementById(id);
const dialogo = $('dialogo');
const dinheiro = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ---------- entrada ---------- */
$('form-entrada').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('email').value.trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || !$('senha').value) {
    $('erro-entrada').textContent = 'Informe um e-mail válido e a senha.';
    return;
  }
  $('entrada').hidden = true;
  $('portal').hidden = false;
  desenhar();
  $('miolo').focus();
});
$('sair').addEventListener('click', () => { $('portal').hidden = true; $('entrada').hidden = false; });

/* ---------- desenho da tela ---------- */
function desenhar() {
  // linha do tempo
  $('linha-tempo').innerHTML = etapas.map((nome, i) => {
    const cls = i < estado.etapa ? 'feito' : i === estado.etapa ? 'atual' : '';
    const extra = i === 2 && estado.etapa <= 2 ? `<small>${datas[2]}</small>` : '';
    return `<li class="${cls}" ${cls === 'atual' ? 'aria-current="step"' : ''}>${nome}${extra}</li>`;
  }).join('');

  // próximo passo
  const proximos = [
    { t: 'Aprove a proposta para começar', p: 'Proposta P-046: vistoria cautelar do apartamento, no valor de R$ 1.900,00.', a: '<button class="btn sec" data-acao="ver-proposta">Ver proposta</button><button class="btn ouro" data-acao="aprovar">Aprovar proposta</button>' },
    { t: 'Assine o contrato', p: 'Enviamos o contrato de prestação de serviço. Leia e assine digitalmente.', a: '<button class="btn sec" data-acao="ver-contrato">Ler contrato</button><button class="btn ouro" data-acao="assinar">Assinar contrato</button>' },
    { t: 'Aguardando a vistoria', p: 'A profissional vai até o imóvel na data combinada. Se precisar remarcar, fale com a equipe.', a: '' },
    { t: 'Vistoria concluída', p: 'A equipe está preparando o laudo com as fotos e medições.', a: '' },
    { t: 'Laudo em revisão', p: 'A engenheira está revisando o documento. Avisaremos por e-mail quando estiver pronto.', a: '' },
    { t: 'Seu laudo está pronto', p: 'Baixe o documento e guarde uma cópia. Ele também fica aqui no portal.', a: `<button class="btn ouro" data-acao="baixar-laudo">${ic('download')}Baixar laudo</button>` },
  ][estado.etapa];
  $('proximo').innerHTML = `<div><strong>${proximos.t}</strong><p>${proximos.p}</p></div><div style="display:flex;gap:.6rem;flex-wrap:wrap">${proximos.a}</div>`;

  // documentos
  const e = estado.etapa;
  $('docs').innerHTML = `
    <li><span class="nome"><span>Proposta P-046<span class="nota">${e >= 1 ? 'Aprovada' : 'Aguardando sua aprovação'}</span></span></span><button class="btn sec pequeno" data-acao="ver-proposta">Baixar</button></li>
    <li><span class="nome ${e < 1 ? 'trancado' : ''}"><span>Contrato de prestação de serviço<span class="nota">${e < 1 ? 'Disponível depois da aprovação' : e === 1 ? 'Aguardando sua assinatura' : 'Assinado'}</span></span></span>${e >= 1 ? '<button class="btn sec pequeno" data-acao="ver-contrato">Baixar</button>' : ''}</li>
    <li><span class="nome ${e < 5 ? 'trancado' : ''}"><span>Laudo de vistoria cautelar<span class="nota">${e < 5 ? 'Disponível quando for entregue' : 'Pronto para baixar'}</span></span></span>${e >= 5 ? '<button class="btn sec pequeno" data-acao="baixar-laudo">Baixar</button>' : ''}</li>`;

  // pagamentos
  const parcelas = [
    { nome: 'Entrada, 50%', venc: '05/11/2026', valor: 950, liberada: e >= 1 },
    { nome: 'Saldo, 50%', venc: '10 dias após o laudo', valor: 950, liberada: e >= 5 },
  ];
  $('pagamentos').innerHTML = parcelas.map((p, i) => `
    <tr><td>${p.nome}</td><td>${p.venc}</td><td class="num">${dinheiro(p.valor)}</td>
    <td class="num">${estado.pago[i] ? '<span class="badge leve">Pago</span>' : p.liberada ? `<button class="btn pequeno" data-acao="pagar" data-i="${i}">${ic('pix')}Pagar com Pix</button>` : '<span class="badge neutro">Aguardando</span>'}</td></tr>`).join('');
}

/* ---------- ações ---------- */
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-acao]');
  if (!b) return;
  const a = b.dataset.acao;
  if (a === 'ver-proposta') baixar('proposta-P-046.txt', 'Proposta P-046\nVistoria cautelar do apartamento\nValor: R$ 1.900,00\n(Documento de exemplo)');
  if (a === 'ver-contrato') baixar('contrato-exemplo.txt', 'Contrato de prestação de serviço\nObjeto: vistoria cautelar do apartamento\n(Documento de exemplo, sem validade)');
  if (a === 'baixar-laudo') baixar('laudo-vistoria-cautelar.txt', 'Laudo de vistoria cautelar\n(Documento de exemplo. No sistema real, aqui vai o PDF emitido pelo painel.)');
  if (a === 'aprovar') confirmar('Aprovar a proposta?', 'Você aprova o serviço de vistoria cautelar por R$ 1.900,00. Em seguida enviamos o contrato para assinatura.', 'Aprovar proposta', () => avancar(1, 'Proposta aprovada. Contrato disponível para assinatura.'));
  if (a === 'assinar') confirmar('Assinar o contrato?', 'A assinatura digital tem validade jurídica. Confira os dados antes de continuar.', 'Assinar contrato', () => avancar(2, 'Contrato assinado. Vamos confirmar a data da vistoria.'));
  if (a === 'pagar') pix(Number(b.dataset.i));
});

function avancar(para, msg) { estado.etapa = para; desenhar(); if (msg) toast(msg); }

$('avancar').addEventListener('click', () => {
  if (estado.etapa < 2) { toast('Antes, aprove a proposta e assine o contrato.'); return; }
  if (estado.etapa >= 5) { toast('Todas as etapas já foram concluídas.'); return; }
  avancar(estado.etapa + 1, `Etapa: ${etapas[estado.etapa]}.`);
});
$('reiniciar').addEventListener('click', () => { estado = estadoInicial(); desenhar(); toast('Demonstração reiniciada.'); });

function confirmar(titulo, texto, rotulo, ok) {
  dialogo.innerHTML = `<h2>${titulo}</h2><p>${texto}</p>
    <div class="dialog-acoes"><button class="btn sec" id="d-nao" type="button">Cancelar</button><button class="btn ouro" id="d-sim" type="button">${rotulo}</button></div>`;
  dialogo.showModal();
  $('d-nao').addEventListener('click', () => dialogo.close());
  $('d-sim').addEventListener('click', () => { dialogo.close(); ok(); });
}

function pix(i) {
  const valor = 950;
  dialogo.innerHTML = `<h2>Pagar com Pix</h2>
    <p>Valor: <strong>${dinheiro(valor)}</strong>. Copie o código e cole no app do seu banco.</p>
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
  $('d-pago').addEventListener('click', () => { estado.pago[i] = true; dialogo.close(); desenhar(); toast('Pagamento registrado.'); });
}

function baixar(nome, conteudo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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

desenhar();
