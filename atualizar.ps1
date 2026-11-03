<#
 Sincroniza um protótipo (pasta ou arquivo .html) para dentro de prototipos e atualiza a lista do index.html.
 Uso:
   ./atualizar.ps1 C:\caminho\do\prototipo            # pasta -> prototipos/<nome-da-pasta>/ (espelha: copia novos/alterados, remove o que sumiu)
   ./atualizar.ps1 C:\caminho\arquivo.html            # arquivo -> prototipos/<nome-do-arquivo>/arquivo.html
   ./atualizar.ps1 <origem> -Nome meu-proto           # escolhe o nome da pasta de destino
#>
param(
  [Parameter(Mandatory, Position = 0)][string]$Origem,
  [string]$Nome
)
$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot
if (-not (Test-Path -LiteralPath $Origem)) { Write-Host "Origem não encontrada: $Origem"; exit 1 }
$item = Get-Item -LiteralPath $Origem
$base = if ($item.PSIsContainer) { $item.Name } else { $item.BaseName }
if (-not $Nome) { $Nome = $base }
$Nome = ($Nome.ToLower() -replace '[\s]+', '-' -replace '[^a-z0-9_-]', '')
if (-not $Nome) { Write-Host 'Nome de destino inválido; use -Nome.'; exit 1 }
$destino = Join-Path $raiz $Nome
$existia = Test-Path $destino
if ($item.PSIsContainer -and ($item.FullName.TrimEnd('\') -ieq $destino.TrimEnd('\'))) { Write-Host 'Origem e destino são a mesma pasta.'; exit 1 }

if ($item.PSIsContainer) {
  $saida = robocopy $item.FullName $destino /MIR /XD .git node_modules /XF Thumbs.db .DS_Store /NJH /NJS /NP /NDL
  if ($LASTEXITCODE -ge 8) { Write-Host "Falha no robocopy (código $LASTEXITCODE)"; exit 1 }
  $mudou = @($saida | Where-Object { $_.Trim() }).Count
} else {
  New-Item -ItemType Directory -Force -Path $destino | Out-Null
  $alvo = Join-Path $destino $item.Name
  $mudou = 1
  if ((Test-Path $alvo) -and ((Get-FileHash $alvo).Hash -eq (Get-FileHash $item.FullName).Hash)) { $mudou = 0 }
  if ($mudou) { Copy-Item -LiteralPath $item.FullName -Destination $alvo -Force }
}
$LASTEXITCODE = 0
if (-not $existia) { Write-Host "Protótipo '$Nome' CRIADO." }
elseif ($mudou) { Write-Host "Protótipo '$Nome' ATUALIZADO ($mudou arquivo(s))." }
else { Write-Host "Protótipo '$Nome' sem mudanças." }

& (Join-Path $raiz 'novo.ps1') -Atualizar
Write-Host "Para subir: ./publicar.ps1 'mensagem'"
