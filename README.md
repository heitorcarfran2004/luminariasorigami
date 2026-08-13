# 50 Moldes de Luminárias de Origami — página de vendas

Página estática, mobile-first, sem dependência de build. Basta servir a raiz.
Estrutura e layout clonados da página de cerâmica fria, com a paleta trocada para
laranja: acentos em `#E86A22` e seções escuras em rust (`#6B2D0E`) no lugar do marrom.

## Rodar local

```bash
node dev/server.cjs   # http://localhost:3200  e  http://localhost:3200/promo
```

## Estrutura

```
index.html          página de vendas (HTML + CSS + JS inline)
promo.html          página de back-redirect, servida em /promo
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
| Completo (back-redirect) | R$ 8,90 | **falta cadastrar** | página `/promo` |

Os cadastrados estão em `checkout.safepaymnt.shop`.

O botão do plano Básico não vai direto para o checkout: ele abre o popup de downsell,
e o link de R$ 10,00 fica na recusa (`Continuar só com o Básico`). É de propósito —
é o que empurra para o de R$ 17,90.

### ⚠️ A `/promo` está com o botão morto

Os dois CTAs de `promo.html` apontam para `COLE_AQUI_CHECKOUT_PROMO_890`, porque o
produto de R$ 8,90 ainda não existe na SafePaymnt. O back-redirect da index **já está
ligado** e mandando para essa página, então quem tentar sair cai num botão que não
leva a lugar nenhum. Não subir tráfego antes de cadastrar o produto e trocar os dois
links — ou, se for demorar, esvaziar o `const link` da index para desligar o
back-redirect no meio-tempo.

Não dá para reaproveitar o link de R$ 17,90 aqui: a página inteira promete R$ 8,90,
e o checkout cobraria outro valor.

## Pendências antes de subir tráfego

- [ ] **Cadastrar o produto de R$ 8,90 e trocar os 2 `COLE_AQUI_CHECKOUT_PROMO_890` do `promo.html`**
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
