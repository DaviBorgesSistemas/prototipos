# Protótipos

Protótipos estáticos (HTML/CSS/JS) publicados via GitHub Pages.
Cada protótipo fica em uma subpasta: `https://SEU_USER.github.io/prototipos/NOME_DA_PASTA/`

## Adicionar um novo protótipo

Windows (PowerShell):

```powershell
./novo.ps1 meu-prototipo
```

Linux/macOS/Git Bash:

```bash
./novo.sh meu-prototipo
```

O script cria `meu-prototipo/` com `index.html`, `style.css` e `script.js` e atualiza a lista do `index.html` da raiz.

Depois, publique:

```bash
git add . && git commit -m "Novo protótipo: meu-prototipo" && git push
```

## Regras

- Use sempre caminhos **relativos** (`./style.css`), nunca `/style.css` — o site roda dentro de `/prototipos/`.
- Nomes de pasta: letras minúsculas, números, `-` e `_`.
- Para importar um protótipo existente, copie a pasta para a raiz e rode o script de lista (`./novo.ps1 -Atualizar` ou `./novo.sh --atualizar`).
