#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

atualizar_lista() {
  local linhas="" n=0 d nome
  for d in */; do
    nome="${d%/}"
    case "$nome" in .*|_*) continue ;; esac
    [ -f "$nome/index.html" ] || continue
    linhas+="      <li><a href=\"./$nome/\">$nome<small>$nome/</small></a></li>"$'\n'
    n=$((n+1))
  done
  [ "$n" -eq 0 ] && linhas='      <li class="vazio">Nenhum protótipo ainda.</li>'$'\n'
  local tmp; tmp="$(mktemp)"
  awk -v bloco="$linhas" '
    /<!-- LISTA:INICIO -->/ { print; printf "%s", bloco; skip=1; next }
    /<!-- LISTA:FIM -->/   { skip=0 }
    !skip { print }
  ' index.html > "$tmp"
  cat "$tmp" > index.html && rm -f "$tmp"
  echo "Lista atualizada ($n protótipo(s))."
}

if [ "${1:-}" = "--atualizar" ]; then
  atualizar_lista; exit 0
fi

nome="${1:-}"
[ -n "$nome" ] || { echo "Uso: ./novo.sh NOME   (ou ./novo.sh --atualizar)"; exit 1; }
[[ "$nome" =~ ^[a-z0-9][a-z0-9_-]*$ ]] || { echo "Nome inválido: use minúsculas, números, - e _."; exit 1; }
[ ! -e "$nome" ] || { echo "A pasta '$nome' já existe."; exit 1; }

mkdir "$nome"
cat > "$nome/index.html" <<EOF
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$nome</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <main>
    <h1>$nome</h1>
    <p>Protótipo novo. Edite <code>index.html</code>, <code>style.css</code> e <code>script.js</code>.</p>
    <button id="btn">Clique</button>
    <p id="saida"></p>
  </main>
  <script src="./script.js"></script>
</body>
</html>
EOF
cat > "$nome/style.css" <<'EOF'
body { margin: 0; font-family: system-ui, sans-serif; background: #f5f6fa; color: #1c1e26; }
main { max-width: 640px; margin: 0 auto; padding: 48px 16px; }
button { padding: 8px 16px; border: 0; border-radius: 8px; background: #4f46e5; color: #fff; cursor: pointer; }
EOF
cat > "$nome/script.js" <<'EOF'
const btn = document.getElementById('btn');
const saida = document.getElementById('saida');
let n = 0;
btn.addEventListener('click', () => { saida.textContent = 'Cliques: ' + (++n); });
EOF
echo "Protótipo '$nome' criado."
atualizar_lista
