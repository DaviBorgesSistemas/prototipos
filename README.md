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

## Atualizar / importar um protótipo existente

Passe o caminho de origem (pasta ou arquivo `.html`):

```powershell
./atualizar.ps1 C:\caminho\do\prototipo          # pasta
./atualizar.ps1 C:\caminho\arquivo.html          # arquivo .html
./atualizar.ps1 <origem> -Nome meu-proto         # escolhe o nome da pasta de destino
```

- **Pasta:** espelha em `prototipos/<nome>/` — copia novos/alterados e **apaga no destino o que foi apagado na origem**. Ignora `.git` e `node_modules`.
- **Arquivo:** vai para `prototipos/<nome-do-arquivo>/arquivo.html`.
- Nome padrão da pasta: o da origem, em minúsculas, espaços viram `-`.
- Informa se o protótipo foi CRIADO, ATUALIZADO ou ficou sem mudanças, e já atualiza a lista do `index.html`.

## Subir no git

```powershell
./publicar.ps1 "mensagem do commit"   # mensagem opcional
```

Faz `git add -A`, commit e push (se não houver mudanças, não faz nada). Confira o `git status` antes: tudo que estiver pendente no repositório entra no commit.

## Regras

- Use sempre caminhos **relativos** (`./style.css`), nunca `/style.css` — o site roda dentro de `/prototipos/`.
- Nomes de pasta: letras minúsculas, números, `-` e `_`.
- Para importar um protótipo existente, copie a pasta para a raiz e rode o script de lista (`./novo.ps1 -Atualizar` ou `./novo.sh --atualizar`).
