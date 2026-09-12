document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = btn.closest('.faq-item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(el){ el.classList.remove('open'); });
    if(!wasOpen){ item.classList.add('open'); }
  });
});

var lightbox = document.getElementById('lightbox');
if(lightbox){
  var lightboxImg = document.getElementById('lightboxImg');
  function openLightbox(src, alt){
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
  }
  document.querySelectorAll('[data-full]').forEach(function(btn){
    btn.addEventListener('click', function(){
      openLightbox(btn.getAttribute('data-full'), btn.getAttribute('data-alt'));
    });
  });
  var lightboxCloseBtn = document.getElementById('lightboxClose');
  if(lightboxCloseBtn){ lightboxCloseBtn.addEventListener('click', closeLightbox); }
  lightbox.addEventListener('click', function(e){
    if(e.target === lightbox){ closeLightbox(); }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeLightbox(); }
  });
}
