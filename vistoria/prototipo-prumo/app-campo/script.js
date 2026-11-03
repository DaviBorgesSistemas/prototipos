const CHAVE = 'prumo_apontamentos_v1';
const HOJE = '2026-10-30';

const vistorias = [
  { id: 'VST-021', cliente: 'Condomínio Aurora', tipo: 'Laudo de fachada', endereco: 'Rua das Acácias, 120, bloco B', data: HOJE, hora: '09:00', duracao: '2h' },
  { id: 'VST-022', cliente: 'Marina Alves', tipo: 'Vistoria cautelar', endereco: 'Av. Beira Mar, 540, ap. 302', data: HOJE, hora: '11:30', duracao: '1h30' },
  { id: 'VST-023', cliente: 'Oficina Rocha', tipo: 'Infiltração em cobertura', endereco: 'Rua Industrial, 88', data: HOJE, hora: '15:00', duracao: '1h' },
];
const semana = [['Seg', '2026-10-26'], ['Ter', '2026-10-27'], ['Qua', '2026-10-28'], ['Qui', '2026-10-29'], ['Sex', '2026-10-30']];
const patologias = ['Fissura', 'Trinca', 'Rachadura', 'Infiltração', 'Umidade ascendente', 'Eflorescência', 'Corrosão de armadura', 'Destacamento de revestimento', 'Mofo', 'Deformação de laje', 'Outra'];
const locais = ['Fachada', 'Sala', 'Quarto', 'Cozinha', 'Banheiro', 'Garagem', 'Laje ou cobertura', 'Pilar ou viga', 'Muro', 'Área externa'];

const tela = document.getElementById('tela');
const estado = document.getElementById('estado');
const envio = document.getElementById('envio');
const btnEnviar = document.getElementById('btn-enviar');
const chaveOffline = document.getElementById('chave-offline');

let dados = carregar();
let offline = false;
let diaSel = HOJE;

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo) return salvo;
  } catch (e) { /* segue com os dados de exemplo */ }
  return [
    { id: 'a1', vistoria: 'VST-021', patologia: 'Infiltração', local: 'Garagem', severidade: 'moderada', medida: '', obs: 'Mancha úmida no teto, perto da junta de dilatação.', foto: '', gps: '', criado: '2026-10-30T09:12', sincronizado: true },
    { id: 'a2', vistoria: 'VST-021', patologia: 'Trinca', local: 'Fachada', severidade: 'grave', medida: '1.2', obs: 'Trinca inclinada a partir do canto da janela do 2º andar.', foto: '', gps: '', criado: '2026-10-30T09:31', sincronizado: true },
  ];
}
function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(dados)); }
  catch (e) { aviso('Sem espaço para guardar as fotos neste navegador.'); }
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
const pendentes = () => dados.filter(d => !d.sincronizado);
const daVistoria = id => dados.filter(d => d.vistoria === id);
const rotuloSev = { leve: 'Leve', moderada: 'Moderada', grave: 'Grave' };

/* ---------- estado da conexão e envio ---------- */
function atualizarEstado() {
  const n = pendentes().length;
  estado.className = 'estado';
  if (offline) { estado.classList.add('offline'); estado.textContent = n ? `Sem internet · ${plural(n, 'guardado', 'guardados')} no aparelho` : 'Sem internet · pode continuar anotando'; }
  else if (n) { estado.classList.add('pendente'); estado.textContent = `Online · ${plural(n, 'apontamento', 'apontamentos')} a enviar`; }
  else estado.textContent = 'Online · tudo enviado';

  const cont = document.getElementById('abas-cont');
  cont.hidden = !n;
  cont.textContent = n;

  // A barra flutuante aparece fora do formulário e da aba de envios, que tem o próprio botão.
  envio.hidden = n === 0 || rota.nome === 'novo' || rota.nome === 'envios';
  document.getElementById('envio-titulo').textContent = `${plural(n, 'apontamento', 'apontamentos')} no aparelho`;
  document.getElementById('envio-sub').textContent = offline ? 'Envio quando a internet voltar' : 'Prontos para ir ao painel';
  btnEnviar.disabled = offline;
  btnEnviar.textContent = 'Enviar';
}

chaveOffline.addEventListener('change', () => {
  offline = chaveOffline.checked;
  atualizarEstado();
  if (rota.nome === 'envios') renderizar();
  if (!offline && pendentes().length) aviso('Internet de volta. Toque em enviar para sincronizar.');
});

function enviarTudo() {
  if (offline) return;
  const botoes = document.querySelectorAll('#btn-enviar, #btn-enviar-tudo');
  botoes.forEach(b => { b.disabled = true; b.textContent = 'Enviando...'; });
  setTimeout(() => {
    const n = pendentes().length;
    dados.forEach(d => { d.sincronizado = true; });
    salvar();
    atualizarEstado();
    renderizar();
    aviso(`${plural(n, 'apontamento enviado', 'apontamentos enviados')}. Já aparece no painel.`);
  }, 900);
}
btnEnviar.addEventListener('click', enviarTudo);

function aviso(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.querySelector('.aparelho').appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ---------- navegação ---------- */
let rota = { nome: 'lista' };
function ir(nome, extra = {}) {
  rota = { nome, ...extra };
  renderizar();
  atualizarEstado();
  tela.scrollTop = 0;
  tela.focus({ preventScroll: true });
}
function renderizar() {
  ({ lista: telaLista, detalhe: telaDetalhe, novo: telaNovo, envios: telaEnvios })[rota.nome](rota.id);
  document.querySelectorAll('[data-aba]').forEach(b => {
    const ativa = b.dataset.aba === rota.nome || (b.dataset.aba === 'lista' && rota.nome === 'detalhe');
    if (ativa) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
}
document.querySelectorAll('[data-aba]').forEach(b => b.addEventListener('click', () => ir(b.dataset.aba)));
// O botão central abre um apontamento na vistoria aberta ou, na tela inicial, na próxima do dia.
document.getElementById('fab').addEventListener('click', () => ir('novo', { id: rota.id || proxima().id }));

const proxima = () => vistorias.find(v => !daVistoria(v.id).length) || vistorias[0];

/* ---------- telas ---------- */
function telaLista() {
  const doDia = vistorias.filter(v => v.data === diaSel);
  const comApont = vistorias.filter(v => daVistoria(v.id).length).length;
  const total = vistorias.length;
  const perimetro = 2 * Math.PI * 38;
  const graves = dados.filter(d => vistorias.some(v => v.id === d.vistoria) && d.severidade === 'grave').length;
  const prox = proxima();

  tela.innerHTML = `
    <section class="saudacao">
      <span class="avatar" aria-hidden="true">NS</span>
      <div><small>Bom dia,</small><b>Nome da sócia</b></div>
    </section>

    <section class="resumo" aria-label="Resumo do dia">
      <div class="anel" aria-hidden="true">
        <svg viewBox="0 0 86 86"><circle class="trilha" cx="43" cy="43" r="38"/><circle class="progresso" cx="43" cy="43" r="38" stroke-dasharray="${perimetro}" stroke-dashoffset="${perimetro * (1 - comApont / total)}"/></svg>
        <b>${comApont}/${total}</b>
      </div>
      <div class="resumo-texto">
        <small>Hoje, sexta 30/10</small>
        <p>${comApont === total ? 'Todas as vistorias do dia têm apontamentos.' : `${plural(comApont, 'vistoria iniciada', 'vistorias iniciadas')} de ${total}. Próxima: ${esc(prox.cliente)}, ${prox.hora}.`}</p>
      </div>
      <div class="resumo-numeros">
        <div><b>${dados.length}</b><span>apontamentos</span></div>
        <div><b>${graves}</b><span>graves</span></div>
        <div><b>${pendentes().length}</b><span>a enviar</span></div>
      </div>
    </section>

    <div class="semana" role="group" aria-label="Dia da agenda">
      ${semana.map(([nome, iso]) => `<button type="button" class="dia ${vistorias.some(v => v.data === iso) ? 'tem' : ''}" data-dia="${iso}" aria-pressed="${iso === diaSel}">${nome}<b>${iso.slice(8)}</b></button>`).join('')}
    </div>

    <div class="secao-titulo"><h2>Agenda</h2><span>${plural(doDia.length, 'vistoria', 'vistorias')}</span></div>
    ${doDia.length ? `<ul class="agenda">
      ${doDia.map(v => {
        const itens = daVistoria(v.id), g = itens.filter(d => d.severidade === 'grave').length;
        return `<li><button class="visita ${v === prox && diaSel === HOJE ? 'proxima' : ''}" data-id="${v.id}">
          <span class="visita-hora">${v.hora}<small>${v.duracao}</small></span>
          <span class="visita-cartao">
            <span class="visita-tipo">${esc(v.tipo)}</span>
            <strong>${esc(v.cliente)}</strong>
            <span class="visita-end">${ic('pino')}${esc(v.endereco)}</span>
            <span class="visita-rodape">
              <span style="display:flex;gap:.35rem;flex-wrap:wrap">
                <span class="pilula">${ic('camera')}${itens.length ? plural(itens.length, 'apontamento', 'apontamentos') : 'Não iniciada'}</span>
                ${g ? `<span class="pilula grave">${plural(g, 'grave', 'graves')}</span>` : ''}
              </span>
              <span class="seta-circulo">${ic('seta')}</span>
            </span>
          </span>
        </button></li>`;
      }).join('')}
    </ul>` : `<div class="vazio">${ic('calendario')}<b>Sem vistorias neste dia</b>Escolha outro dia da semana.</div>`}`;

  tela.querySelectorAll('[data-dia]').forEach(b => b.addEventListener('click', () => { diaSel = b.dataset.dia; telaLista(); }));
  tela.querySelectorAll('.visita').forEach(b => b.addEventListener('click', () => ir('detalhe', { id: b.dataset.id })));
}

function cabecalho(titulo) {
  return `<div class="cab-tela">
    <button class="icone-redondo" type="button" id="voltar" aria-label="Voltar">${ic('voltar')}</button>
    <span>${titulo}</span>
    <span style="width:40px"></span>
  </div>`;
}

function telaDetalhe(id) {
  const v = vistorias.find(x => x.id === id);
  const itens = daVistoria(id).sort((a, b) => b.criado.localeCompare(a.criado));
  tela.innerHTML = `
    ${cabecalho(`${v.id} · ${v.hora}`)}
    <span class="pilula ouro">${esc(v.tipo)}</span>
    <h1 style="margin-top:.5rem">${esc(v.cliente)}</h1>
    <p class="sub">${ic('pino')}${esc(v.endereco)}</p>
    <div class="mini">
      <div><b>${itens.length}</b><span>apontamentos</span></div>
      <div class="${itens.some(d => d.severidade === 'grave') ? 'alerta' : ''}"><b>${itens.filter(d => d.severidade === 'grave').length}</b><span>graves</span></div>
      <div><b>${itens.filter(d => !d.sincronizado).length}</b><span>a enviar</span></div>
    </div>
    <div class="secao-titulo"><h2>Apontamentos</h2><button type="button" id="novo">${ic('mais')}Novo</button></div>
    ${itens.length ? itens.map(cartao).join('') : `<div class="vazio">${ic('camera')}<b>Nenhum apontamento ainda</b>Toque no + para registrar o primeiro.</div>`}`;
  document.getElementById('voltar').addEventListener('click', () => ir('lista'));
  document.getElementById('novo').addEventListener('click', () => ir('novo', { id }));
}

function cartao(d) {
  const medida = d.medida ? `, ${String(d.medida).replace('.', ',')} mm` : '';
  return `<article class="apontamento">
    ${d.foto ? `<img class="miniatura" src="${d.foto}" alt="Foto: ${esc(d.patologia)} em ${esc(d.local)}">` : `<div class="miniatura">${ic('camera')}</div>`}
    <div>
      <h3>${esc(d.patologia)}, ${esc(d.local.toLowerCase())}${medida}</h3>
      ${d.obs ? `<p>${esc(d.obs)}</p>` : ''}
      <div class="linha-meta">
        <span class="pilula ${d.severidade}">${rotuloSev[d.severidade]}</span>
        ${d.sincronizado ? `<span class="pilula">${ic('check')}Enviado</span>` : `<span class="pilula ouro">${ic('semrede')}No aparelho</span>`}
      </div>
    </div>
  </article>`;
}

function telaEnvios() {
  const lista = pendentes();
  tela.innerHTML = `
    <h1>Envios</h1>
    <p class="sub">Apontamentos guardados no aparelho e ainda não enviados ao painel.</p>
    <div style="margin-top:1.2rem">
    ${lista.length ? `
      ${vistorias.filter(v => lista.some(d => d.vistoria === v.id)).map(v => `
        <div class="secao-titulo" style="margin-top:.4rem"><h2 style="font-size:1rem">${esc(v.cliente)}</h2><span>${v.id}</span></div>
        ${lista.filter(d => d.vistoria === v.id).map(cartao).join('')}`).join('')}
      <button class="btn-app ouro" type="button" id="btn-enviar-tudo" ${offline ? 'disabled' : ''}>${ic('nuvem')}${offline ? 'Envio quando a internet voltar' : `Enviar ${plural(lista.length, 'apontamento', 'apontamentos')}`}</button>`
    : `<div class="vazio">${ic('nuvem')}<b>Tudo enviado</b>Os apontamentos já estão no painel da equipe.</div>`}
    </div>`;
  document.getElementById('btn-enviar-tudo')?.addEventListener('click', enviarTudo);
}

function telaNovo(id) {
  tela.innerHTML = `
    ${cabecalho('Novo apontamento')}
    <form class="form" id="form" novalidate>
      <div class="form-bloco">
        <div>
          <label for="vistoria">Vistoria</label>
          <select id="vistoria">${vistorias.map(v => `<option value="${v.id}" ${v.id === id ? 'selected' : ''}>${v.hora} · ${esc(v.cliente)}</option>`).join('')}</select>
        </div>
        <div>
          <label for="patologia">Patologia</label>
          <select id="patologia" required><option value="">Escolha</option>${patologias.map(p => `<option>${p}</option>`).join('')}</select>
        </div>
        <div class="dupla">
          <div>
            <label for="local">Local</label>
            <select id="local" required><option value="">Escolha</option>${locais.map(p => `<option>${p}</option>`).join('')}</select>
          </div>
          <div>
            <label for="medida">Abertura (mm)</label>
            <input id="medida" type="number" step="0.1" min="0" inputmode="decimal" placeholder="Opcional">
          </div>
        </div>
        <fieldset>
          <legend>Gravidade</legend>
          <div class="sev">
            <label class="s-leve"><input type="radio" name="sev" value="leve"><span>Leve</span></label>
            <label class="s-moderada"><input type="radio" name="sev" value="moderada"><span>Moderada</span></label>
            <label class="s-grave"><input type="radio" name="sev" value="grave"><span>Grave</span></label>
          </div>
        </fieldset>
      </div>

      <div class="form-bloco">
        <label class="foto-campo">
          <span class="miniatura" id="previa">${ic('camera')}</span>
          <span><b>Adicionar foto</b><small>Câmera ou galeria</small></span>
          <input id="foto" type="file" accept="image/*" capture="environment">
        </label>
        <button class="gps" type="button" id="btn-gps">${ic('pino')}Usar minha localização</button>
        <p class="gps-info" id="gps-info"></p>
        <div>
          <label for="obs">Observações</label>
          <textarea id="obs" rows="3" placeholder="O que você viu? Onde começa? Há sinais de evolução?"></textarea>
        </div>
      </div>

      <p class="erro" id="erro" role="alert"></p>
      <button class="btn-app" type="submit">${ic('check')}Salvar apontamento</button>
    </form>`;

  let foto = '', gps = '';
  const get = i => document.getElementById(i);
  get('voltar').addEventListener('click', () => ir('detalhe', { id: get('vistoria').value }));

  get('foto').addEventListener('change', e => {
    const arq = e.target.files[0];
    if (!arq) return;
    reduzir(arq, 480).then(url => {
      foto = url;
      get('previa').outerHTML = `<img class="miniatura" id="previa" src="${url}" alt="Prévia da foto">`;
    });
  });

  get('btn-gps').addEventListener('click', () => {
    const info = get('gps-info');
    if (!navigator.geolocation) { info.textContent = 'Este aparelho não informa a localização.'; return; }
    info.textContent = 'Buscando localização...';
    navigator.geolocation.getCurrentPosition(
      p => { gps = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`; info.textContent = `Localização guardada: ${gps}`; },
      () => { info.textContent = 'Não foi possível obter a localização. Permita o acesso e tente de novo.'; }
    );
  });

  get('form').addEventListener('submit', e => {
    e.preventDefault();
    const pat = get('patologia').value, loc = get('local').value, vid = get('vistoria').value;
    const sev = document.querySelector('input[name=sev]:checked');
    if (!pat || !loc || !sev) { get('erro').textContent = 'Escolha a patologia, o local e a gravidade.'; return; }
    dados.push({
      id: 'a' + Date.now(), vistoria: vid, patologia: pat, local: loc, severidade: sev.value,
      medida: get('medida').value, obs: get('obs').value.trim(), foto, gps,
      criado: new Date().toISOString().slice(0, 16), sincronizado: false,
    });
    salvar();
    ir('detalhe', { id: vid });
    aviso(offline ? 'Apontamento guardado no aparelho.' : 'Apontamento salvo. Envie quando quiser.');
  });
}

function reduzir(arquivo, lado) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const esc = Math.min(1, lado / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * esc);
        c.height = Math.round(img.height * esc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.6));
      };
      img.src = r.result;
    };
    r.readAsDataURL(arquivo);
  });
}

document.getElementById('btn-zerar').addEventListener('click', () => {
  try { localStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
  dados = carregar();
  ir('lista');
});

ir('lista');
