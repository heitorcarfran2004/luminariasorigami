# 50 Moldes de Luminárias de Origami — página de vendas

Página estática, mobile-first, sem dependência de build. Basta servir a raiz.

**Estrutura e design clonados da página de miçangas** (`funis/brincos-micanga`,
publicada em micangasdajuh.vercel.app): mesmo sistema de tipografia (Inter +
Fraunces em itálico nos destaques), mesmos componentes (pill, checks, stats,
cards de dor, carrosséis, planos, popup, FAQ) e mesma ordem de seções.

O que mudou em relação à página-modelo:

| | miçangas | aqui |
|---|---|---|
| acento (`--coral`) | coral `#E5446E` | terracota `#D2542A` |
| seções escuras (`--turq-esc`) | turquesa `#0B5158` | rust `#5A2409` |
| seção "Cada projeto é uma página completa" | existe | **removida** — não há arte equivalente |
| seção dos 14 estilos | não existe | herdada da versão antiga desta página |
| cards de dor | 3 | 6 (o grid de 3 colunas fecha em 2 linhas) |

A paleta inteira vive nas variáveis do `:root`. Os nomes `--coral` e `--turq`
foram mantidos de propósito: é o mesmo sistema da página de miçangas, e voltar
para o coral/turquesa original é mexer só nessas linhas.

## Rodar local

```bash
node dev/server.cjs   # http://localhost:3200  e  http://localhost:3200/promo
```

## Estrutura da página

barra de urgência · hero · dores · carrossel de peças · desejo (decorar/presentear/
vender/relaxar) · os 14 estilos · **quanto vale a peça pronta** · bônus ·
depoimentos · oferta/planos · popup de upsell · garantia · FAQ · fechamento · rodapé

## Prova de mercado (seção "Quanto vale a peça pronta")

Os 7 prints em `assets/provas/venda-01..07.webp` são anúncios reais da Shopee e do
Mercado Livre, capturados em **4 e 5 de setembro de 2026**. Faixa: R$ 59,99 a
R$ 918,40; o campeão de vendas tem 156 unidades.

Recorte: cada print foi cortado para uma janela de `1080x1500` posicionada de modo
que preço, quantidade vendida e título do anúncio caibam na imagem — o offset
vertical **muda de print para print**, porque cada anúncio põe o preço numa altura
diferente. O `venda-05` era mais curto que 1500 px e levou um `pad` branco embaixo
(o fundo do anúncio já é branco, então a emenda não aparece).

**Número de mercado envelhece.** Ao atualizar os preços, trocar também a data na
nota ao pé da seção — preço sem data vira promessa vaga.

O enquadramento é proposital: a seção diz **o que o mercado cobra**, não o que
alguém vai ganhar. Promessa de renda derruba conta de anúncio no Meta. A nota ao pé
deixa explícito que o preço depende de acabamento, fotos e divulgação.

## Os três carrosséis

`#modelos` (as 21 luminárias montadas) e `#provas` (os 7 anúncios) usam a MESMA
função `deslizar()`: andam sozinhos para a esquerda a ~27 px/s e continuam
arrastáveis. Param só enquanto o dedo está pressionado; passar o mouse por cima não
para. Os dois têm as imagens **duplicadas no HTML** — a segunda leva é a emenda que
faz o loop voltar ao começo sem salto. **Trocar imagem exige trocar nas duas levas.**

O deslize usa `requestAnimationFrame` empurrando `scrollLeft`, e não animação CSS —
`transform` brigaria com o scroll nativo e mataria o arraste. O `scroll-snap` foi
desligado nos dois: ele trava o carrossel em cada item.

O terceiro (`#deps`, depoimentos) é diferente: leque com o do centro grande e nítido
e os vizinhos menores e apagados. Anda de um em um e **para 4,2 s em cada** — a
pessoa precisa de tempo para ler a conversa. É infinito por índice circular
(`(i - atual + total) % total`), não por duplicação.

**Ao testar por CDP, chame `Page.bringToFront` antes de medir:** o navegador congela
o `requestAnimationFrame` em aba oculta e os carrosséis parecem parados.

## Assets

Tudo é **webp com `srcset`** — os fallbacks `.jpg`/`.png` foram removidos, como na
página de miçangas. Cada imagem tem uma versão menor e o `sizes` descreve o espaço
real que ela ocupa no layout. **Ao mudar uma largura no CSS, mudar o `sizes` junto**,
senão o navegador escolhe o arquivo errado.

```
assets/
  hero2.webp / hero2-700 / hero2-420  foto das 10 luminárias montadas (16:9, 1400px)
  pecas-web/ + pecas-md/ + pecas-sm/  21 peças do carrossel (800, 560 e 400)
  provas/ + provas-sm/              7 anúncios de marketplace (520 e 340)
  depoimentos/ + depoimentos-sm/    5 prints de WhatsApp (720 e 360)
  bonus/ + bonus-sm/                5 capas de bônus (16:9)
```

Só a hero é `eager` e tem `preload` com `imagesrcset` — ela é o elemento de LCP.
Todo o resto é `loading="lazy"`.

A hero é **deitada (16:9)**, ao contrário da arte quadrada da página de miçangas.
Por isso a coluna da imagem no `.hero-grid` é um pouco mais larga que a do texto
(`.94fr 1.06fr`) e a imagem ocupa `width:100%`, não 85%. Ela **não tem sombra nem
borda** — só o `border-radius`: a foto entra direto no creme do hero. A página de
miçangas tem `box-shadow` ali porque a arte dela é recortada em fundo branco; aqui
a sombra virava moldura em volta de uma foto que já tem fundo próprio.

O nome é `hero2` e não `hero` **de propósito**. A troca da arte antiga (a colagem do
kit) pela foto aconteceu depois da página já estar no ar, e o `hero.webp` estava
carimbado com 30 dias de cache no navegador de quem já tinha visitado e no CDN da
Vercel — o nome novo é o que faz a foto certa aparecer na hora. Mesma regra vale
para qualquer troca futura de imagem.

`bonus-4.webp` tem só **760 px de largura** — foi gerado a partir de uma cópia
reduzida, porque o original saiu de `Downloads` antes da conversão. Se aparecer
serrilhado em tela retina, regerar a partir do arquivo cheio.

Os arquivos de imagem **não têm hash no nome**. Por isso o cache é de 30 dias e não
de 1 ano com `immutable`: se você trocar uma imagem mantendo o mesmo nome, quem já
visitou continuaria vendo a antiga. Se precisar trocar antes disso, renomeie.

## Ofertas e checkouts

| Plano | Preço | Link | Onde |
|---|---|---|---|
| Básico | R$ 10,00 | `VCCL1O8SD7R8` | recusa do popup |
| Completo | R$ 25,90 | `VCCL1O8SD7U6` | seção de planos e CTA final |
| Completo (popup) | R$ 17,90 | `VCCL1O8SD7U5` | popup ao clicar no básico |
| Completo (back-redirect) | R$ 8,90 | `VCCL1O8SD7V8` | página `/promo` |

Todos em `checkout.safepaymnt.shop`. Nenhum placeholder pendente.

O botão do plano Básico não vai direto para o checkout: ele abre o popup de
downsell, e o link de R$ 10,00 fica na recusa (`Continuar só com o Básico`). É de
propósito — é o que empurra para o de R$ 17,90.

O botão do Básico está **fora** do seletor `a[href*="safepaymnt"]` que marca
`__indoParaCheckout`. Sem essa exceção, quem visse o popup e desistisse sairia da
página com o back redirect desarmado.

## Bônus

São **5**, somando R$ 135 anunciados:

1. Guia de Como Dobrar Direito — R$ 27 (`bonus-3.webp`)
2. Manual da Luz em 5 Minutos — R$ 27 (`bonus-2.webp`)
3. Tabela de Quanto Cobrar — R$ 27 (`bonus-1.webp`)
4. Guia do Papel Que Funciona — R$ 27 (`bonus-4.webp`)
5. Lista de Compras da Iniciante — R$ 27 (`bonus-5.webp`)

**A capa do Bônus 5 é a mesma cena da capa do Bônus 1** — o caderno na foto diz
"Guia de Como Dobrar Direito". Foi uma escolha do Heitor, com a ressalva feita. Se
um dia sair uma arte própria da lista de compras, é só trocar `bonus-5.webp` (e a
versão em `bonus-sm/`) mantendo um nome NOVO, por causa do cache de 30 dias.

Com 5 bônus a grade de 2 colunas fecha em 3 linhas cheias e o card "os 5 vão juntos"
é o sexto. Se voltar para 4, ele precisa de `grid-column:1/-1` para não sobrar
sozinho numa linha.

O número aparece em **seis lugares** no `index.html` (headline da seção, card
"os 5 vão juntos", lista do plano Completo, item riscado do Básico, texto do popup
e resposta do FAQ) e em **quatro** no `promo.html` (meta description, sub do hero,
lista e soma). Ao mudar o número, conferir todos.

## Performance

Medido com Lighthouse mobile, 5 rodadas intercaladas de cada versão servidas lado a
lado na mesma máquina (medianas). Comparação entre `e72b6b5` e `e491b4f`:

| | antes | depois |
|---|---|---|
| Score | 87 | **98** |
| First Contentful Paint | 3001 ms | 1922 ms |
| Largest Contentful Paint | 3228 ms | 2094 ms |
| Primeira pintura (trace real) | 1256 ms | 304 ms |
| Forced reflow | 190 ms | 0 ms |
| Peso baixado | 371 KB | 278 KB |
| Requisições | 15 | 14 |

No site publicado a mediana fica em **88**, não 98: a diferença é rede real mais o
script da UTMify, que é de terceiro e não dá para mexer.

**Rodada única não serve para comparar.** Com o navegador e o servidor de preview
abertos, cinco medições da mesma versão deram 84, 85, 86, 88 e 98. Feche tudo e use
mediana de 5, senão a leitura vira ruído.

O que está ligado, e por quê:

| Medida | Onde | Efeito |
|---|---|---|
| `fetchpriority="low"` abaixo da dobra | 66 `<img>` | o hero e as fontes passam na frente |
| `loading="lazy"` + `decoding="async"` | idem | decodificação sai do main thread |
| Imagens responsivas com `srcset`/`sizes` | todas as `<img>` | o celular baixa a versão pequena |
| Carrossel só anima perto da tela | `deslizar()` | nada de layout durante o carregamento |
| Medida do trilho coalescida em 1 quadro | `agendarRemedida()` | zerou 190 ms de reflow forçado |
| `preload` + `fetchpriority=high` no hero | `<head>` | o hero é o elemento de LCP |
| Fonte sem bloquear render | `media="print"` + `onload` | com `<noscript>` de fallback |
| `preconnect` para o CDN da UTMify | `<head>` | tira DNS+TLS do caminho crítico |
| `<link rel="icon" href="data:,">` | `<head>` | mata o 404 de `/favicon.ico` |
| Minificação de CSS/JS/HTML | `build.cjs`, no build da Vercel | roda só na Vercel |
| Cache dos assets | `vercel.json` → 30 dias + `stale-while-revalidate` | |
| HTML no edge | `vercel.json` → `s-maxage=86400` | melhora o TTFB |

### O que NÃO adianta mexer

**Minificar CSS mais agressivamente piora.** Colapsar espaço em volta de `{ } : ; ,`
e tirar o `;` final deixa o HTML **29 bytes maior depois do brotli** — o dicionário
do compressor aproveita os padrões repetidos (`; `, `: `) melhor do que a remoção
deles. Medido, não estimado. `build.cjs` já está no ponto certo.

**O `sizes` tem que bater com o CSS.** As peças do carrossel aparecem com 240 px;
em DPR 1,75 isso pede 420 px e o `srcset` só tinha 400 e 800 — o navegador pegava
o de 800 para desenhar 240. O degrau de 560 w (`pecas-md/`) existe por isso. **Ao
mudar uma largura no CSS, refazer essa conta.**

**Nunca leia `scrollWidth`/`offsetWidth` dentro do `requestAnimationFrame`.** Foi
o que segurou a primeira pintura em 1256 ms: ler depois de escrever `scrollLeft`
obriga o navegador a resolver o layout na hora, 60 vezes por segundo, em dois
trilhos com 56 imagens.

**`build.cjs` roda in place e só na Vercel** (guard em `process.env.VERCEL`). O que
está no git continua legível; só o que vai pro CDN sai minificado. Ele é
deliberadamente conservador: não remove ponto-e-vírgula, não junta linhas de JS e
não toca em nenhum script externo além da indentação — o bloco da Utmify sai byte a
byte idêntico.

## Pendências antes de subir tráfego

- [ ] Colar o Meta Pixel no lugar do comentário `<!-- META PIXEL: cole seu pixel aqui -->`
      (está em `index.html` **e** em `promo.html`)
- [ ] Trocar `[seu e-mail de suporte]` no rodapé do `index.html`
- [ ] Produzir os 5 bônus como arquivo (hoje só existem as capas)

O script da Utmify já está ativo — é o mesmo ID de conta dos outros funis.

O back-redirect do `index.html` aponta para
`https://luminariasorigami.vercel.app/promo` (URL absoluta). Isso significa que **no
preview local o back-redirect pula para o site publicado**, não para o
`localhost:3200/promo` — para testar a promo local, abrir a URL direto.

## Conteúdo

Os 14 estilos e a contagem de modelos de cada um saem direto de
`entregaveis/50-moldes-luminaria-origami/moldes/` — 50 moldes no total, conferidos
pasta a pasta. Se o entregável mudar, os cards da seção dos 14 estilos precisam ser
reconferidos.

Os 5 depoimentos são prints reais de conversa. Dois deles citam o preço de R$ 10, o
que casa com o plano Básico — se o preço mudar, esses prints ficam inconsistentes.
