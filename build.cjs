// Minificacao das paginas, executada pela Vercel a cada deploy.
//
// Roda IN PLACE no checkout do build — por isso o guard do VERCEL abaixo: rodar
// isso na maquina local destruiria os arquivos-fonte. O que esta no git continua
// legivel; so o que vai pro CDN sai minificado.
//
// Deliberadamente conservador: nao remove ponto-e-virgula, nao reordena nada e
// nao junta linhas de JS (evita qualquer risco de ASI). Apenas tira comentarios
// e indentacao. Nenhum script externo (UTMify, pixel, back redirect) e tocado
// alem da indentacao.

const fs = require('fs');
const path = require('path');

if (!process.env.VERCEL) {
  console.error('build.cjs so roda no build da Vercel (protege os fontes locais).');
  console.error('Para testar: VERCEL=1 node build.cjs — mas os arquivos SERAO sobrescritos.');
  process.exit(1);
}

const ALVOS = ['index.html', 'promo.html'];

// Comentario /* */ so e removido dentro de <style>. O JS da pagina nao usa esse
// formato, e um replace global poderia esbarrar em conteudo de string.
function minificarEstilo(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*/g, '')
    .trim();
}

function minificar(html) {
  var saida = html;

  saida = saida.replace(/<style>([\s\S]*?)<\/style>/g, function (_, css) {
    return '<style>' + minificarEstilo(css) + '</style>';
  });

  // Comentarios de linha inteira no JS. O ancora ^ com /m garante que so pega
  // linhas que COMECAM com // — nunca o // de uma URL dentro de string.
  saida = saida.replace(/<script>([\s\S]*?)<\/script>/g, function (_, js) {
    return '<script>' + js.replace(/^[ \t]*\/\/.*$/gm, '') + '</script>';
  });

  saida = saida
    .replace(/<!--[\s\S]*?-->/g, '')   // comentarios HTML
    .replace(/\n[ \t]+/g, '\n')        // indentacao (mantem o \n: protege ASI e texto)
    .replace(/\n{2,}/g, '\n');         // linhas em branco acumuladas

  return saida;
}

var totalAntes = 0, totalDepois = 0;

ALVOS.forEach(function (rel) {
  const arq = path.join(__dirname, rel);
  const antes = fs.readFileSync(arq, 'utf8');
  const depois = minificar(antes);
  fs.writeFileSync(arq, depois);

  totalAntes += Buffer.byteLength(antes);
  totalDepois += Buffer.byteLength(depois);
  console.log(rel.padEnd(14), Buffer.byteLength(antes) + ' -> ' + Buffer.byteLength(depois) + ' bytes');
});

console.log('Total: ' + totalAntes + ' -> ' + totalDepois + ' bytes (' +
  (100 - totalDepois / totalAntes * 100).toFixed(1) + '% menor antes da compressao)');
