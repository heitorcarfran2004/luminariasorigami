# 50 Moldes de Luminárias de Origami — página de vendas

Página estática, mobile-first, sem dependência de build. Basta servir a raiz.
Estrutura e layout clonados da página de cerâmica fria, com a paleta trocada para
laranja: acentos em `#E86A22` e seções escuras em rust (`#6B2D0E`) no lugar do marrom.

## Rodar local

```bash
node dev/server.cjs   # http://localhost:3200  e  http://localhost:3200/promo
```

## Performance

O que está ligado, e por quê:

| Medida | Onde | Efeito |
|---|---|---|
| Minificação de CSS/JS/HTML | `build.cjs`, no build da Vercel | −12,7% de HTML antes da compressão |
| Cache dos assets | `vercel.json` → 30 dias + `stale-while-revalidate` | era `max-age=0, must-revalidate`: toda revisita rebaixava tudo |
| Recompressão das imagens | `effort 6` no webp, trellis no jpeg | −41% no peso dos assets, dimensões idênticas |
| `hero.png` paletizado | fallback de navegador sem webp | 2122 KB → 428 KB |
| Fonte sem bloquear render | `media="print"` + `onload` no `<head>` | já existia |
| `preload` + `fetchpriority` no hero | `<head>` | já existia — o hero é o elemento de LCP |
| `loading="lazy"` nas imagens abaixo da dobra | carrossel, depoimentos, bônus | já existia |

**`build.cjs` roda in place e só na Vercel** (guard em `process.env.VERCEL`). O que está no
git continua legível; só o que vai pro CDN sai minificado. Ele é deliberadamente
conservador: não remove ponto-e-vírgula, não junta linhas de JS e não toca em nenhum
script externo além da indentação — o bloco da Utmify sai byte a byte idêntico.

Os arquivos de imagem **não têm hash no nome**. Por isso o cache é de 30 dias e não de
1 ano com `immutable`: se você trocar uma imagem mantendo o mesmo nome, quem já visitou
continuaria vendo a antiga. Se precisar trocar antes disso, renomeie o arquivo.

Recompressão usada: as imagens foram regeradas a partir dos originais em Downloads, não
recomprimidas em cima do webp que já existia — recomprimir lossy sobre lossy acumularia
perda de geração. Mesmas dimensões, mesma qualidade, só mais esforço de encoder.

## Estrutura

```
index.html          página de vendas (HTML + CSS + JS inline)
promo.html          página de back-redirect, servida em /promo
build.cjs           minificação executada pela Vercel a cada deploy
assets/
  hero.webp/.png    arte do kit, com o fundo branco recortado
  pecas-web/        21 luminárias do carrossel (webp + jpg, 800x800)
  depoimentos/      5 prints de WhatsApp (720x1366)
  bonus/            3 capas de bônus (16/9)
dev/server.cjs      servidor estático para preview local (ignorado no deploy)
vercel.json         força deploy estático, sem build, com cleanUrls
```

## Ofertas e checkouts

| Plano | Preço | Link | Onde |
|---|---|---|---|
| Básico | R$ 10,00 | `VCCL1O8SD7R8` | recusa do popup |
| Completo | R$ 25,90 | `VCCL1O8SD7U6` | seção de planos e CTA final |
| Completo (popup) | R$ 17,90 | `VCCL1O8SD7U5` | popup ao clicar no básico |
| Completo (back-redirect) | R$ 8,90 | `VCCL1O8SD7V8` | página `/promo` |

Todos em `checkout.safepaymnt.shop`. Nenhum placeholder pendente.

O botão do plano Básico não vai direto para o checkout: ele abre o popup de downsell,
e o link de R$ 10,00 fica na recusa (`Continuar só com o Básico`). É de propósito —
é o que empurra para o de R$ 17,90.

A escada de preço é: R$ 25,90 na página → R$ 17,90 se a pessoa clica no Básico →
R$ 8,90 se ela tenta sair. Cada degrau tem produto próprio na SafePaymnt, então o
valor cobrado bate com o que a página anuncia em cada etapa.

## Pendências antes de subir tráfego

- [ ] Colar o Meta Pixel no lugar do comentário `<!-- META PIXEL: cole seu pixel aqui -->`
      (está em `index.html` **e** em `promo.html`)
- [ ] Trocar `[seu e-mail de suporte]` no rodapé do `index.html`
- [ ] Mandar as capas dos bônus 4 e 5 se quiser subir de 3 para 5 bônus
      (hoje o total anunciado é R$ 81)

O script da Utmify veio da página de cerâmica e já está ativo — é o mesmo ID de conta.
O back-redirect do `index.html` aponta para `https://luminariasorigami.vercel.app/promo`
(URL absoluta, igual à da página de cerâmica). Isso significa que **no preview local o
back-redirect pula para o site publicado**, não para o `localhost:3200/promo` — para
testar a promo local, abrir a URL direto.

## Conteúdo

Os 14 estilos e a contagem de modelos de cada um saem direto de
`entregaveis/50-moldes-luminaria-origami/moldes/` — 50 moldes no total, conferidos
pasta a pasta. Se o entregável mudar, os cards da seção "Tudo que você vai receber"
precisam ser reconferidos.

Os 5 depoimentos são prints reais de conversa. Dois deles citam o preço de R$ 10,
o que casa com o plano Básico — se o preço mudar, esses prints ficam inconsistentes.
