# pgmcnprojects.com

Este repositório é o site público da **PGMCN Projects**, estúdio indie de jogos mobile. Ele roda como GitHub Pages em `pgmcnprojects.com` e serve como hub de landing pages para cada jogo lançado.

## Propósito

Cada jogo publicado no Google Play ganha uma subpasta aqui com:
- Página de apresentação (`index.html`) — hero animado, features, seção de about, botão de download
- Política de privacidade (`privacy.html`) — exigida pelo Play Store
- Assets de loja (`assets/`) — ícone, feature graphic, screenshots/gifs
- Sprites ou assets visuais usados nas animações da landing page

O `index.html` raiz é o hub que lista todos os jogos.

## Estrutura

```
pgmcnprojects.com/
├── index.html                     # Hub principal
├── CNAME                          # pgmcnprojects.com
│
├── yetanothertinyroguelike/       # Jogo 1 — roguelike Android
│   ├── index.html                 # Landing page completa
│   ├── privacy.html               # Política de privacidade
│   ├── assets/
│   │   ├── icon_512.png
│   │   ├── feature_graphic_1024x500.png
│   │   └── screenshots/
│   └── sprites/                   # Pixel art para o preview animado no canvas
│
└── mypetelegans/                  # Jogo 2 — C. elegans simulator Android
    ├── index.html                 # Landing page completa
    ├── styles.css
    ├── script.js
    └── assets/
        ├── icon_512.png
        ├── feature_graphic_1024x500.png
        └── screenshots/           # Inclui gif_quick_show.gif e mp4_extended_show.mp4
```

## Padrão visual por jogo

As páginas não seguem um template único — cada jogo tem seu próprio estilo, derivado dos assets e da identidade visual do jogo.

### Yet Another Tiny Roguelike
- Fundo escuro (`#1a1a1a`), paleta retro pixel art
- Fonte **Press Start 2P** (Google Fonts)
- Dourado `#ffd900`, vermelho `#e03030`, verde `#26c44b`, roxo `#9966cc`
- Canvas animado com dungeon procedural + preview do jogo em tempo real
- Sprites pixel art com `image-rendering: pixelated`

### My Pet Elegans
- Fundo azul-cinza escuro e dessaturado (`#1b2230`)
- Fonte do sistema (sans-serif), peso fino, atmosfera científica/minimalista
- Paleta: prata-cinza `#bfcfde`, `#6a7d92`, `#374858`
- Dois canvas: filamentos neurais animados (background fixo) + prato de petri com minhoca
- A minhoca é uma cadeia cinemática de 20 segmentos que reage ao ponteiro
- Estrutura separada em `index.html` / `styles.css` / `script.js`

## Jogos publicados

| Jogo | Pasta | App ID | Status |
|------|-------|--------|--------|
| Yet Another Tiny Roguelike | `yetanothertinyroguelike/` | `com.pgcn.yetanotherminirl` | Publicado |
| My Pet Elegans | `mypetelegans/` | `com.pgcn.petworm` | Publicado |

## Contato / Autor

- Estúdio: **PGMCN Projects**
- E-mail: leparlon@gmail.com

## Notas

- Nenhum dado de usuário é coletado pelos jogos (além do Google Play Games Services, opcional)
- Todo game data fica local no device
- Sem ads, analytics ou tracking SDKs
- O Play Store exige que a `privacy.html` exista e seja pública antes de publicar
