# pgmcnprojects.com

Este repositório é o site público da **PGMCN Projects**, estúdio indie de jogos mobile. Ele roda como GitHub Pages em `pgmcnprojects.com` e serve como hub de landing pages para cada jogo lançado.

## Propósito

Cada jogo publicado no Google Play ganha uma subpasta aqui com:
- Página de apresentação (`index.html`) — hero animado, features, screenshots, botão de download
- Política de privacidade (`privacy.html`) — exigida pelo Play Store
- Assets de loja (`assets/`) — ícone, feature graphic, screenshots
- Sprites pixel art (`sprites/`) — usados na animação ao vivo da landing page

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
│   └── sprites/                   # Pixel art para o preview animado
│
└── mypetelegans/                  # Jogo 2 — em desenvolvimento
    ├── assets/
    └── sprites/
```

## Padrão visual

Todas as páginas seguem o mesmo estilo retro/pixel:
- Fundo escuro (`#1a1a1a`)
- Fonte **Press Start 2P** (Google Fonts)
- Paleta: dourado `#ffd900`, vermelho `#e03030`, verde `#26c44b`, roxo `#9966cc`
- Imagens com `image-rendering: pixelated`
- Animações em canvas (background de dungeon, preview interativo do jogo)

## Jogos publicados

| Jogo | Pasta | App ID | Status |
|------|-------|--------|--------|
| Yet Another Tiny Roguelike | `yetanothertinyroguelike/` | `com.pgcn.yetanotherminirl` | Publicado |
| My Pet Elegans | `mypetelegans/` | — | Em construção |

## Contato / Autor

- Estúdio: **PGMCN Projects**
- E-mail: leparlon@gmail.com

## Notas

- Nenhum dado de usuário é coletado pelos jogos (além do Google Play Games Services, opcional)
- Todo game data fica local no device
- Sem ads, analytics ou tracking SDKs
- O Play Store exige que a `privacy.html` exista e seja pública antes de publicar
