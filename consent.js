/* Consentimento de cookies + Google Consent Mode v2
   Deve ser carregado de forma SINCRONA no <head>, ANTES do snippet do GTM. */
(function () {
  'use strict';

  var CHAVE = 'ds_consent_v1';
  var DIAS_VALIDADE = 180;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function lerEstado() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) return null;
      var dado = JSON.parse(bruto);
      var idade = (Date.now() - dado.ts) / 86400000;
      if (idade > DIAS_VALIDADE) return null;
      return dado;
    } catch (e) { return null; }
  }

  function salvarEstado(analytics, marketing) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({
        analytics: !!analytics, marketing: !!marketing, ts: Date.now(), v: 1
      }));
    } catch (e) {}
  }

  function aplicar(analytics, marketing, tipo) {
    gtag('consent', tipo, {
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
      personalization_storage: marketing ? 'granted' : 'denied',
      analytics_storage: analytics ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
  }

  /* 1. Default: tudo negado antes de qualquer tag disparar */
  var salvo = lerEstado();
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    personalization_storage: 'denied', analytics_storage: 'denied',
    functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });

  /* 2. Se ja houver escolha registrada, atualiza imediatamente */
  if (salvo) {
    aplicar(salvo.analytics, salvo.marketing, 'update');
    window.dataLayer.push({ event: 'consent_restaurado' });
  }

  /* 3. Interface */
  var CSS = ''
    + '#ds-cookie,#ds-cookie *{box-sizing:border-box;}'
    + '#ds-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:520px;margin:0 auto;'
    + 'background:#0d1226;border:1px solid rgba(94,169,255,0.28);border-radius:16px;padding:20px 22px;'
    + 'box-shadow:0 18px 50px rgba(0,0,0,0.55);color:#f4f7ff;'
    + "font-family:'Inter',system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.55;}"
    + '#ds-cookie h3{margin:0 0 8px;font-size:15px;font-weight:700;color:#f4f7ff;}'
    + '#ds-cookie p{margin:0 0 14px;color:#9aa6c9;font-size:13.5px;}'
    + '#ds-cookie a{color:#4fc9ff;}'
    + '#ds-cookie .ds-btns{display:flex;flex-wrap:wrap;gap:8px;}'
    + '#ds-cookie button{font:inherit;font-weight:600;cursor:pointer;border-radius:10px;padding:10px 16px;border:1px solid transparent;}'
    + '#ds-cookie .ds-ok{background:#2f6bff;color:#fff;flex:1 1 150px;}'
    + '#ds-cookie .ds-ok:hover{background:#4079ff;}'
    + '#ds-cookie .ds-no{background:transparent;color:#9aa6c9;border-color:rgba(94,169,255,0.28);flex:1 1 110px;}'
    + '#ds-cookie .ds-no:hover{color:#f4f7ff;}'
    + '#ds-cookie .ds-conf{background:transparent;color:#6a749a;border:none;padding:10px 4px;flex:0 0 auto;text-decoration:underline;font-weight:500;}'
    + '#ds-cookie .ds-op{display:none;margin:0 0 14px;border-top:1px solid rgba(94,169,255,0.16);padding-top:12px;}'
    + '#ds-cookie .ds-op.on{display:block;}'
    + '#ds-cookie label{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;color:#9aa6c9;font-size:13px;cursor:pointer;}'
    + '#ds-cookie label input{margin-top:3px;accent-color:#2f6bff;}'
    + '#ds-cookie label b{color:#f4f7ff;font-weight:600;display:block;}'
    + '@media(max-width:480px){#ds-cookie{left:10px;right:10px;bottom:10px;padding:18px;}}';

  var HTML = ''
    + '<h3>Este site usa cookies</h3>'
    + '<p>Uso cookies para medir a audiencia e mensurar as campanhas de anuncio. '
    + 'Voce escolhe o que autorizar. Detalhes na <a href="/politica-de-privacidade">Politica de Privacidade</a>.</p>'
    + '<div class="ds-op" id="ds-op">'
    + '<label><input type="checkbox" id="ds-an" checked><span><b>Analise de audiencia</b>Google Analytics 4: paginas visitadas, origem do acesso e conversoes.</span></label>'
    + '<label><input type="checkbox" id="ds-mk" checked><span><b>Publicidade</b>Google Ads, Meta Pixel e YouTube: mensuracao de anuncios e remarketing.</span></label>'
    + '</div>'
    + '<div class="ds-btns">'
    + '<button class="ds-ok" id="ds-aceitar">Aceitar</button>'
    + '<button class="ds-no" id="ds-recusar">Recusar</button>'
    + '<button class="ds-conf" id="ds-config">Personalizar</button>'
    + '</div>';

  var caixa = null;

  function montar() {
    if (caixa) { caixa.style.display = 'block'; return; }
    var estilo = document.createElement('style');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    caixa = document.createElement('div');
    caixa.id = 'ds-cookie';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-label', 'Aviso de cookies');
    caixa.innerHTML = HTML;
    document.body.appendChild(caixa);

    var atual = lerEstado();
    if (atual) {
      caixa.querySelector('#ds-an').checked = atual.analytics;
      caixa.querySelector('#ds-mk').checked = atual.marketing;
    }

    caixa.querySelector('#ds-config').addEventListener('click', function () {
      caixa.querySelector('#ds-op').classList.toggle('on');
    });
    caixa.querySelector('#ds-aceitar').addEventListener('click', function () {
      var aberto = caixa.querySelector('#ds-op').classList.contains('on');
      var an = aberto ? caixa.querySelector('#ds-an').checked : true;
      var mk = aberto ? caixa.querySelector('#ds-mk').checked : true;
      decidir(an, mk);
    });
    caixa.querySelector('#ds-recusar').addEventListener('click', function () {
      decidir(false, false);
    });
  }

  function decidir(analytics, marketing) {
    salvarEstado(analytics, marketing);
    aplicar(analytics, marketing, 'update');
    window.dataLayer.push({ event: 'consent_atualizado', consent_analytics: !!analytics, consent_marketing: !!marketing });
    if (caixa) caixa.style.display = 'none';
  }

  window.abrirPreferenciasCookies = function () {
    if (document.body) { montar(); caixa.querySelector('#ds-op').classList.add('on'); }
  };

  if (!salvo) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', montar);
    } else {
      montar();
    }
  }
})();
