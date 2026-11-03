<#
 Sobe as mudanças para o git (add + commit + push).
 Uso: ./publicar.ps1 ["mensagem do commit"]
#>
param([Parameter(Position = 0)][string]$Mensagem)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
git add -A
if (-not (git status --porcelain)) { Write-Host 'Nada para publicar.'; exit 0 }
git status --short
if (-not $Mensagem) { $Mensagem = "Atualiza protótipos ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))" }
git commit -m $Mensagem
git push
