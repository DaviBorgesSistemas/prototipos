# Anagennisi — Documentação do projeto

> Pacote de prompts para o Google Stitch que redesenha (2018 para 2026) e expande o app de uma comunidade de igreja chamado "Anagennisi". Estado: **ideia / especificação de design** — não há código nem telas geradas na pasta, apenas os prompts. O público do documento são designers e desenvolvedores que vão gerar as telas no Stitch e depois implementar o app.

Observação de nomenclatura: a pasta se chama `Anagennesi`, mas o documento e os prompts usam a grafia `Anagennisi`. Este documento usa a grafia dos prompts.

---

## 1. Visão geral e objetivo

**Problema.** Existe um protótipo antigo (2018) do app, em Material Design clássico: AppBar sólida verde-teal escura, drawer com fundo teal sólido, botões roxo/púrpura, cards de raio pequeno com sombra padrão e tipografia Roboto do sistema. Várias telas ficaram só com o cabeçalho desenhado, sem conteúdo.

**Público.** Membros de uma comunidade de igreja (app "caloroso e cotidiano", segundo o Prompt Mestre). O documento em si é voltado a quem produzirá o design.

**Proposta.** O arquivo `STITCH-PROMPTS.md` cobre três frentes:

1. **Modernização** das telas que já existiam completas em 2018: Login/Cadastro, Home/Drawer, Eventos, Doações, Pedido de Oração, Perfil.
2. **Preenchimento** das telas que existiam vazias em 2018: Group Meetings, Testimonials (lista), Schedule, Registrations, Event Payments e Congregations (multi-campus; no protótipo antigo aparecia como "Settings").
3. **Expansão** com funcionalidades novas: sermões em áudio/vídeo, devocional diário, notificações, check-in por QR code, grupos pequenos com chat e feed comunitário.

Segundo o próprio arquivo, o texto foi gerado pela skill `/gerar-prompt-stitch`, a partir do protótipo antigo (`projects/xyz/*.png`) e do estilo claro/moderno de `.claude/estilo-referencia/`.

## 2. Conteúdo da pasta

| Arquivo | Tipo | Para que serve |
|---|---|---|
| `STITCH-PROMPTS.md` | Markdown (~22 KB, 197 linhas) | Prompt Mestre (sistema visual) + 1 prompt em inglês por tela, com texto explicativo em português. |

A pasta contém apenas esse arquivo (não há imagens, HTML ou código).

## 3. Telas e fluxos especificados

O documento tem 18 prompts: o Prompt Mestre (seção 0) e 17 prompts de tela (seções 1 a 17, mais a 9.1). Os prompts individuais assumem o contexto do Prompt Mestre.

### 3.1 Parte 1 — Modernização das telas existentes

| Seção | Tela | O que o prompt pede |
|---|---|---|
| 1 | Home / Navegação | Substitui o drawer teal por home clara: cabeçalho de perfil com saudação ("Peace be with you, Stella"), cartão "Today" (devocional do dia ou próximo evento/culto), atalhos (Prayer Requests, Sermons, Groups, Give, Gallery, Contact Us), bottom nav de 5 abas (Home, Events, Groups, Give, Profile) e menu "More" com itens secundários (About Church, Testimonials, Contact Us, Settings). |
| 2 | Lista de Eventos | Cards com foto, gradiente inferior, local com ícone de pin, chip de data/hora, ícones de busca e filtro (por campus), indicador "Going"/RSVP, estado vazio. |
| 3 | Doações | Cartão introdutório, valores sugeridos (pills) + valor livre, seletor "One-time" vs "Recurring" (frequência semanal/mensal), seletor de fundo ("General Offering", "Missions", "Building Fund"), botão "Give" e histórico recolhível com ícone de recibo. |
| 4 | Pedido de Oração | Segmentado "My Requests" vs "Prayer Wall"; cards com título, tempo relativo, ícone privado/compartilhado; ação "I'm praying" com contador (só no Prayer Wall); botão largo "+ New Request" no lugar do FAB; formulário com categoria, texto e toggle de compartilhamento. |
| 5 | Perfil | Cartão de cabeçalho (avatar, nome, e-mail) e grupos Notes, Registrations, Personal Information, My Congregation, Settings; "Log Out" separado e de baixa ênfase. |
| 6 | Login / Cadastro | Área superior leve com pomba simplificada, campos com rótulo flutuante, "Sign In" primário, "Forgot password?" como link, "Create Account" secundário; Sign Up com First Name, Last Name, Email, Password. |

### 3.2 Parte 2 — Telas que existiam vazias

| Seção | Tela | O que o prompt pede |
|---|---|---|
| 7 | Group Meetings (Pequenos Grupos) | "My Groups" em carrossel (nome, avatares sobrepostos, próxima reunião); "Discover Groups" com botão "Request to Join"; chips de filtro por tema e dia; detalhe do grupo com capa, líder, agenda, prévia de membros e entrada para o chat. |
| 8 | Testimonials (lista) | Feed de cards (avatar, nome, tempo, texto com "Read more"), reação mínima ("Amen"/"Encouraging") e botão "Share Your Testimony" com compositor. |
| 9 | Schedule | Horários recorrentes de culto/atividades (distinto de Eventos): seletor de dia da semana ou lista agrupada; indicador de campus; detalhe opcional (palestrante, descrição). |
| 9.1 | Bible | Seletor de versão ("NIV"), seletor Livro/Capítulo/Versículo em chips, tipografia de leitura com versículos em superscrito, barra/sheet por versículo (destacar, favoritar, compartilhar, "Add to Notes") e entrada "Reading Plans" com lista de planos e barra de progresso. |
| 10 | Registrations | Segmentado "Upcoming" vs "Past"; cards com status ("Confirmed", "Waitlisted", "Pending Payment"); ações "View Ticket / QR Code" e "Cancel Registration"; estado vazio. |
| 11 | Event Payments e Congregations | Pagamento: resumo do pedido, método (cartão, PIX/transferência, "Pay at church"), campos de cartão, total e "Confirm Payment". Congregations: lista de campi com "Set as My Congregation" (seleção estilo radio) que personaliza Schedule e Events. |

### 3.3 Parte 3 — Expansão para 2026

| Seção | Funcionalidade | O que o prompt pede |
|---|---|---|
| 12 | Sermões / Mensagens | Banner "Live Now" (oculto quando não há transmissão), carrossel "Recent", arquivo filtrável por série/tema, player de vídeo ou áudio (play/pause, barra, saltos de 15 s) e área de notas com salvamento automático. |
| 13 | Devocional Diário | Data, versículo em tipografia de destaque, reflexão, oração; "Mark as Read" com indicador de sequência ("5-day streak"); histórico em lista ou calendário com marcação de dias concluídos. |
| 14 | Notificações | Feed agrupado em "New" e "Earlier" com ícone por tipo (lembrete de evento, novo sermão, oração, reunião, recibo); painel de preferências com toggles por categoria. |
| 15 | Check-in por QR Code | "My Ticket" (QR grande, evento, data, nome) e "Scan to Check In" para voluntários (câmera, alvo de leitura, estado de sucesso com nome e foto e retorno automático à leitura). |
| 16 | Grupos Pequenos com Chat | Chat restrito ao grupo: balões, avatar e nome do remetente, composer com anexo, banner fixado com a próxima reunião (dispensável por sessão). |
| 17 | Feed Comunitário | Feed unificado de Prayer Wall + Testimonials com filtro "All / Prayer Requests / Testimonies", tag de tipo e uma reação mínima ("Praying" ou "Amen"), sem barra pesada de comentários/curtidas/compartilhamento. |

Relações entre telas citadas nos prompts: Registrations leva ao QR de check-in (seção 15, mencionada ali também como "seção 13"); Group Detail leva ao chat (seção 16, mencionada ali como "seção 12"); Congregations personaliza Schedule e Events; Bible liga a "Notes" do Perfil.

## 4. Arquitetura e tecnologias

Não há stack de implementação definida. O documento só informa:

- **Ferramenta de geração:** Google Stitch, que gera apenas a aparência (HTML/Tailwind estático).
- **Fora do escopo do Stitch, a implementar depois** (seção "Nota técnica"): streaming de áudio/vídeo ao vivo (seção 12), scanner de QR e geração de códigos únicos por inscrição (seção 15), chat em tempo real (seção 16), processamento de pagamentos (seção 11) e notificações push (seção 14).
- Plataforma-alvo: app mobile ("church community mobile app"). Framework, backend e modelo de dados não são mencionados.

## 5. Design / identidade visual (Prompt Mestre)

| Elemento | Especificação |
|---|---|
| Estilo geral | Claro, calmo, arejado; fundos off-white/cinza quente (`#FAF9F6`, `#F5F3EF`); nada de AppBar teal escura; sem tom corporativo, clínico ou gamificado. |
| Cards | Cantos de 20–24 px, sombra suave de baixa opacidade ou borda de 1 px cinza quente; padding interno de 18–20 px; sem divisores densos. |
| Tipografia | Sans geométrica/humanista (Inter, Poppins ou similar); títulos medium/semibold, corpo regular. Em Bíblia e Devocional, versículos em tratamento serifado/elegante. |
| Cor de destaque | Verde-sálvia suave (alusão ao teal e à pomba originais). Cor secundária terracota/dourado, usada com parcimônia (badges "new"/"live", sequência do devocional). Roxo/violeta antigo eliminado. |
| Ícones | Contorno fino, terminações arredondadas, espessura consistente. |
| Botões | Pill ou raio grande; primário preenchido na cor de destaque; secundário em contorno ou texto. |
| Navegação | Bottom nav leve com 5 abas (Home, Events, Groups, Give, Profile), aba ativa em pill preenchida; drawer/"More" para itens secundários. |
| Tom | Acolhedor, calmo, confiável, "como app de bem-estar/comunidade". |

Cores de estado citadas na tela de Registrations: destaque (confirmado), âmbar (lista de espera) e vermelho apagado (pendente de pagamento) — em termos, sem códigos hex.

## 6. Como visualizar ou executar

Não há nada executável. Fluxo previsto pelo próprio documento (parcialmente inferido):

1. Colar o Prompt Mestre (seção 0) no Google Stitch para fixar o sistema visual.
2. Enviar um prompt de tela por vez (seções 1 a 17), mantendo o mesmo projeto Stitch. O próprio Prompt Mestre diz: "I'll send you one prompt per screen from now on".
3. O resultado do Stitch é HTML/Tailwind estático; a lógica precisa ser construída à parte (item 4).

## 7. Roadmap, pendências e próximos passos

- Gerar no Stitch as 18 peças (Prompt Mestre + telas) — não há evidência na pasta de que isso tenha sido feito.
- Implementar fora do Stitch: streaming, scanner/geração de QR, chat em tempo real, pagamentos e push (ver item 4).
- Não há priorização, cronograma nem divisão em fases além das três partes do documento.

## 8. Lacunas e inconsistências

- **Grafia:** pasta `Anagennesi` vs texto `Anagennisi`.
- **Arquivos referenciados e ausentes:** o documento cita `projects/xyz/*.png` (protótipo de 2018) e `.claude/estilo-referencia/` (imagens de estilo); nenhum está nesta pasta. O estado original das telas de 2018 não pode ser verificado aqui.
- **Referências cruzadas incorretas:** a seção 10 (Registrations) liga o QR ao check-in "da seção 13", mas o check-in está na seção 15 (a 13 é o Devocional). A seção 7 aponta o chat para a "seção 12", mas o chat é a seção 16 (a 12 é Sermões). A seção 2 remete o filtro por campus à "seção 8", mas Congregations está na seção 11 (a 8 é Testimonials); a seção 9 cita corretamente a 11.
- **Numeração:** existe a seção "9.1 Bible" fora da sequência; a Bíblia não é citada na lista "O que este documento cobre" (item 2 menciona só as telas vazias; item 3 não lista Bíblia).
- **Ícones/emojis:** os prompts pedem ícones outline finos, mas citam emojis em ações (reações, sequência do devocional); não está dito se são emojis literais ou ícones.
- Não definidos: framework do app, backend, modelo de dados, autenticação, provedor de pagamento (apesar de citar cartão e PIX), idiomas do app (os prompts estão em inglês com PIX mencionado, sugerindo público brasileiro — inferido), identidade da igreja e conteúdo real.
- Não há wireframes, fluxos ponta a ponta nem critérios de aceitação.

## 9. Fontes

- `C:\Projetos\mine\guides\projects\fila\Anagennesi\STITCH-PROMPTS.md` (lido integralmente)
