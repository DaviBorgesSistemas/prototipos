// Fissurômetro: régua com traços de espessura padrão; o traço mais próximo da abertura fica em destaque.
const barra = document.getElementById('largura');
const leitura = document.getElementById('medidor-leitura');
const regua = document.getElementById('regua');
const chipMm = document.getElementById('chip-mm');
const chipClasse = document.getElementById('chip-classe');

const SVG = 'http://www.w3.org/2000/svg';
const marcas = [0.1, 0.2, 0.3, 0.5, 0.8, 1, 1.5, 2, 3, 5, 7, 10];
const tracos = marcas.map((mm, i) => {
  const x = 16 + i * 33.5;
  const linha = document.createElementNS(SVG, 'line');
  Object.entries({ x1: x, x2: x, y1: 4, y2: 44, 'stroke-width': Math.max(0.6, mm * 1.5) }).forEach(([k, v]) => linha.setAttribute(k, v));
  linha.classList.add('marca-fissura');
  const rotulo = document.createElementNS(SVG, 'text');
  Object.entries({ x, y: 62, 'text-anchor': 'middle' }).forEach(([k, v]) => rotulo.setAttribute(k, v));
  rotulo.textContent = String(mm).replace('.', ',');
  regua.append(linha, rotulo);
  return { mm, linha, rotulo };
});

// Faixas usuais de classificação (ilustrativas).
const faixas = [
  { ate: 0.5, nome: 'Fissura', texto: 'Em geral superficial. Vale acompanhar a evolução e tratar a causa.' },
  { ate: 1.5, nome: 'Trinca', texto: 'Já pode atravessar o elemento. Uma vistoria identifica a origem.' },
  { ate: 5, nome: 'Rachadura', texto: 'Abertura significativa, com possível risco. Procure uma avaliação técnica.' },
  { ate: Infinity, nome: 'Fenda ou brecha', texto: 'Abertura muito grande. Isole a área e chame uma engenheira.' },
];

const formatar = mm => mm.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function atualizar() {
  const mm = Number(barra.value) / 10;            // 0,1 a 10,0 mm
  const ativo = tracos.filter(t => t.mm <= mm + 1e-9).at(-1);
  tracos.forEach(t => { t.linha.classList.toggle('ativa', t === ativo); t.rotulo.classList.toggle('ativa', t === ativo); });
  const faixa = faixas.find(f => mm <= f.ate);
  leitura.textContent = faixa.texto;
  chipMm.textContent = formatar(mm) + ' mm';
  chipClasse.textContent = faixa.nome;
  barra.setAttribute('aria-valuetext', `${faixa.nome}, ${formatar(mm)} milímetros`);
}
barra.addEventListener('input', atualizar);
atualizar();

// Formulário de contato: validação simples e mensagem de sucesso.
const form = document.getElementById('form-contato');
const sucesso = document.getElementById('sucesso');

function erro(campo, msg) {
  const el = form.querySelector(`[data-erro="${campo}"]`);
  const input = form.elements[campo];
  if (el) el.textContent = msg;
  if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  sucesso.hidden = true;
  let ok = true;
  const d = Object.fromEntries(new FormData(form));

  if (!d.nome.trim()) { erro('nome', 'Informe seu nome.'); ok = false; } else erro('nome', '');
  const c = d.contato.trim();
  const valido = /^\S+@\S+\.\S+$/.test(c) || c.replace(/\D/g, '').length >= 10;
  if (!valido) { erro('contato', 'Informe um e-mail válido ou telefone com DDD.'); ok = false; } else erro('contato', '');
  if (!d.tipo) { erro('tipo', 'Escolha o tipo de imóvel.'); ok = false; } else erro('tipo', '');
  if (d.mensagem.trim().length < 10) { erro('mensagem', 'Descreva o problema em pelo menos 10 caracteres.'); ok = false; } else erro('mensagem', '');

  if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }

  // No sistema real, este envio cria o cliente e a solicitação de proposta no painel admin.
  sucesso.textContent = `Pedido enviado, ${d.nome.split(' ')[0]}. Vamos responder com uma proposta em até 2 dias úteis.`;
  sucesso.hidden = false;
  form.reset();
});
