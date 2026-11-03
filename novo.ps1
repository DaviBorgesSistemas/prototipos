param(
  [Parameter(Position = 0)][string]$Nome,
  [switch]$Atualizar
)
$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Atualizar-Lista {
  $itens = @()
  $linhas = @()
  foreach ($d in (Get-ChildItem -Path $raiz -Directory | Where-Object { $_.Name -notmatch '^[._]' } | Sort-Object Name)) {
    if (Test-Path (Join-Path $d.FullName 'index.html')) {
      $itens += $d
      $linhas += "      <li><a href=`"./$($d.Name)/index.html`">$($d.Name)<small>$($d.Name)/index.html</small></a></li>"
    } else {
      foreach ($f in (Get-ChildItem -Path $d.FullName -Filter *.html -File | Sort-Object Name)) {
        $itens += $f
        $linhas += "      <li><a href=`"./$($d.Name)/$($f.Name)`">$($f.BaseName)<small>$($d.Name)/$($f.Name)</small></a></li>"
      }
      foreach ($s in (Get-ChildItem -Path $d.FullName -Directory | Where-Object { $_.Name -notmatch '^[._]' } | Sort-Object Name)) {
        if (Test-Path (Join-Path $s.FullName 'index.html')) {
          $itens += $s
          $linhas += "      <li><a href=`"./$($d.Name)/$($s.Name)/index.html`">$($s.Name)<small>$($d.Name)/$($s.Name)/index.html</small></a></li>"
        }
      }
    }
  }
  if ($itens.Count -gt 0) {
  } else {
    $linhas = @('      <li class="vazio">Nenhum protótipo ainda.</li>')
  }
  $arq = Join-Path $raiz 'index.html'
  $html = [System.IO.File]::ReadAllText($arq, $utf8)
  $novo = "<!-- LISTA:INICIO -->`n" + ($linhas -join "`n") + "`n<!-- LISTA:FIM -->"
  $html = [regex]::Replace($html, '(?s)<!-- LISTA:INICIO -->.*?<!-- LISTA:FIM -->', { param($m) $novo })
  [System.IO.File]::WriteAllText($arq, $html, $utf8)
  Write-Host "Lista atualizada ($(@($itens).Count) protótipo(s))."
}

if (-not $Atualizar) {
  if (-not $Nome) { Write-Host 'Uso: ./novo.ps1 NOME   (ou ./novo.ps1 -Atualizar)'; exit 1 }
  if ($Nome -notmatch '^[a-z0-9][a-z0-9_-]*$') { Write-Host 'Nome inválido: use minúsculas, números, - e _.'; exit 1 }
  $pasta = Join-Path $raiz $Nome
  if (Test-Path $pasta) { Write-Host "A pasta '$Nome' já existe."; exit 1 }
  New-Item -ItemType Directory -Path $pasta | Out-Null

  $indexHtml = @"
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$Nome</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <main>
    <h1>$Nome</h1>
    <p>Protótipo novo. Edite <code>index.html</code>, <code>style.css</code> e <code>script.js</code>.</p>
    <button id="btn">Clique</button>
    <p id="saida"></p>
  </main>
  <script src="./script.js"></script>
</body>
</html>
"@
  $css = @"
body { margin: 0; font-family: system-ui, sans-serif; background: #f5f6fa; color: #1c1e26; }
main { max-width: 640px; margin: 0 auto; padding: 48px 16px; }
button { padding: 8px 16px; border: 0; border-radius: 8px; background: #4f46e5; color: #fff; cursor: pointer; }
"@
  $js = @"
const btn = document.getElementById('btn');
const saida = document.getElementById('saida');
let n = 0;
btn.addEventListener('click', () => { saida.textContent = 'Cliques: ' + (++n); });
"@
  [System.IO.File]::WriteAllText((Join-Path $pasta 'index.html'), $indexHtml, $utf8)
  [System.IO.File]::WriteAllText((Join-Path $pasta 'style.css'), $css, $utf8)
  [System.IO.File]::WriteAllText((Join-Path $pasta 'script.js'), $js, $utf8)
  Write-Host "Protótipo '$Nome' criado."
}
Atualizar-Lista
