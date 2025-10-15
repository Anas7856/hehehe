 (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});
    var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{
    await (a=m.createElement("script"));e.set("libraries",[...r]+"");
    for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);
    e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;
    d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";
    m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
    ({ key: "AIzaSyAVvVdJsh59KBJ__2gCHJCnHXWsn65hxbg", v: "weekly" });
</script>

<script>
  const PLACE_ID     = "ChIJdahLPC8bN4gRmSV5bzghano"; 
  const MIN_RATING   = 4;
  const MAX_REVIEWS  = 30;

  // slider state
  let REVIEWS=[], baseCount=0, pv=1, index=0, autoTimer=null, isDragging=false, startX=0, startTx=0;
  let placeMeta={ name:'', rating:null, userRatingCount:null };

  document.addEventListener('DOMContentLoaded', () => init().catch(e=>fail(e?.message||String(e))));

  async function init(){
    const statusEl = document.getElementById('status');
    const { Place } = await google.maps.importLibrary('places');

    const place = new Place({ id: PLACE_ID });
    await place.fetchFields({ fields: ['displayName','rating','userRatingCount','reviews'] });

    placeMeta.name = place.displayName || document.title;
    placeMeta.rating = typeof place.rating === 'number' ? place.rating : null;
    placeMeta.userRatingCount = typeof place.userRatingCount === 'number' ? place.userRatingCount : null;

    REVIEWS = (place.reviews || [])
      .filter(r => (r.rating||0) >= MIN_RATING)
      .sort((a,b)=> (getTime(b.publishTime) - getTime(a.publishTime)))
      .slice(0, MAX_REVIEWS);

    baseCount = REVIEWS.length;

    if (!baseCount){
      statusEl.textContent = 'No Google reviews to display.';
      return;
    }
    statusEl.textContent = '';

    buildTrack();     // build cards + clones and position to first real item
    buildDots();      // dots for each real review
    wireControls();   // arrows, dots, hover/visibility pause, swipe/drag
    injectSchema(REVIEWS, placeMeta);
    startAutoplay();
  }

  /* ---------- Build / Rebuild ---------- */
  function perView(){
    const w = innerWidth;
    if (w >= 992) return 3;
    if (w >= 768) return 2;
    return 1;
  }

  function buildTrack(){
    const track = document.getElementById('sliderTrack');
    track.style.transition = 'none';         // avoid flicker during rebuild
    track.innerHTML = '';

    pv = perView();

    // If fewer items than per-view, no clones, no loop
    const looping = baseCount > pv;

    // Build base cards
    const baseNodes = REVIEWS.map(r => cardNode(r));

    if (!looping){
      baseNodes.forEach(n => { const wrap = document.createElement('div'); wrap.className='slide-card'; wrap.appendChild(n); track.appendChild(wrap); });
      index = 0;
      updateDots(0);
      return;
    }

    // Clone last pv to front, first pv to end
    const clonesHead = baseNodes.slice(-pv).map(n => n.cloneNode(true));
    const clonesTail = baseNodes.slice(0, pv).map(n => n.cloneNode(true));

    // Append in order: head clones + base + tail clones
    [...clonesHead, ...baseNodes, ...clonesTail].forEach(n => {
      const wrap = document.createElement('div'); wrap.className='slide-card'; wrap.appendChild(n); track.appendChild(wrap);
    });

    // Start position: first real item (after head clones)
    index = pv;
    requestAnimationFrame(() => {
      snapToIndex(index);         // position without animation
      track.style.transition = ''; // re-enable transitions
    });

    // After DOM paints, wire read-more/less buttons
    wireToggles();
    // Handle resize -> full rebuild when breakpoint changes
    handleResize();
  }

  function cardNode(r){
    const author = r.authorAttribution?.displayName || 'Google user';
    const authorUrl = r.authorAttribution?.uri || '';
    const photo = r.authorAttribution?.photoURI || '';
    const rating = Number(r.rating || 0);
    const when   = r.relativePublishTimeDescription || fmtDate(r.publishTime);
    const text   = esc(r.text || '');

    const card = document.createElement('article');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="d-flex align-items-center mb-2">
        ${photo ? `<img src="${photo}" alt="" class="rounded-circle me-2" width="40" height="40" loading="lazy">` : ''}
        <div>
          <div class="review-author">
            ${authorUrl ? `<a href="${esc(authorUrl)}" target="_blank" rel="noopener">${esc(author)}</a>` : esc(author)}
          </div>
          <div class="review-meta">${stars(rating)} ${rating.toFixed(1)} · ${esc(when)}</div>
        </div>
      </div>
      <div class="review-text">${text}</div>
      <div class="mt-2"><button class="toggle-btn" type="button" aria-expanded="false">Read more</button></div>
    `;
    return card;
  }

  function buildDots(){
    const dots = document.getElementById('sliderIndicators');
    dots.innerHTML = '';
    for (let i=0;i<baseCount;i++){
      const b = document.createElement('button');
      b.className = 'slider-dot';
      b.type = 'button';
      b.setAttribute('aria-label', `Go to review ${i+1}`);
      b.addEventListener('click', () => goLogical(i));
      dots.appendChild(b);
    }
    updateDots(0);
  }

  function updateDots(logicalIndex){
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === logicalIndex));
  }

  /* ---------- Movement (1-by-1) ---------- */
  function stepWidth(){
    const track = document.getElementById('sliderTrack');
    const items = track.querySelectorAll('.slide-card');
    if (items.length < 2) return items[0]?.getBoundingClientRect().width || 0;
    const a = items[0].getBoundingClientRect();
    const b = items[1].getBoundingClientRect();
    return b.left - a.left; // includes gap
  }

  function snapToIndex(i){ // no animation
    const track = document.getElementById('sliderTrack');
    const w = stepWidth();
    track.style.transition = 'none';
    track.style.transform = `translateX(${-i * w}px)`;
    track.offsetHeight; // force reflow
    track.style.transition = '';
    updateDots(logicalIndex());
  }

  function animateToIndex(i){
    const track = document.getElementById('sliderTrack');
    const w = stepWidth();
    track.style.transform = `translateX(${-i * w}px)`;
  }

  function logicalIndex(){
    // Map current index (including clones) to 0..baseCount-1
    if (baseCount <= pv) return 0;
    return (index - pv + baseCount) % baseCount;
  }

  function next(){
    if (baseCount <= pv) return;
    index += 1;
    animateToIndex(index);
  }
  function prev(){
    if (baseCount <= pv) return;
    index -= 1;
    animateToIndex(index);
  }

  // loop correction after transition
  document.getElementById('sliderTrack').addEventListener('transitionend', () => {
    if (baseCount <= pv) return;
    const total = baseCount + 2*pv;
    if (index >= baseCount + pv){ index = pv; snapToIndex(index); }
    else if (index < pv){ index = baseCount + pv - 1; snapToIndex(index); }
    updateDots(logicalIndex());
  });

  /* ---------- Controls, hover, visibility, swipe ---------- */
  function wireControls(){
    const slider = document.getElementById('reviewsSlider');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const viewport = document.getElementById('sliderViewport');
    const track = document.getElementById('sliderTrack');

    prevBtn.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay(true); });
    nextBtn.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay(true); });

    // pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', () => startAutoplay(true));

    // pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay(true);
    });

    // swipe / drag
    viewport.addEventListener('pointerdown', onDragStart, { passive: true });
    window.addEventListener('pointerup', onDragEnd);
    window.addEventListener('pointercancel', onDragEnd);
    window.addEventListener('pointermove', onDragMove, { passive: true });

    function onDragStart(e){
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      const w = stepWidth();
      const tx = -index * w;
      startTx = tx;
      track.style.transition = 'none';
      stopAutoplay();
    }
    function onDragMove(e){
      if (!isDragging) return;
      const dx = e.clientX - startX;
      document.getElementById('sliderTrack').style.transform = `translateX(${startTx + dx}px)`;
    }
    function onDragEnd(e){
      if (!isDragging) return;
      isDragging = false;
      const dx = (e.clientX || startX) - startX;
      const thresh = stepWidth() * 0.25;
      track.style.transition = '';
      if (dx < -thresh) { next(); }
      else if (dx > thresh) { prev(); }
      else { animateToIndex(index); } // snap back
      startAutoplay(true);
    }
  }

  function startAutoplay(reset=false){
    const slider = document.getElementById('reviewsSlider');
    const delay = Number(slider.getAttribute('data-autoplay') || 0);
    if (!delay) return;
    if (reset) stopAutoplay();
    if (autoTimer) return;
    autoTimer = setInterval(next, delay);
  }
  function stopAutoplay(){
    if (autoTimer){ clearInterval(autoTimer); autoTimer = null; }
  }

  // Click a dot (logical index 0..N-1)
  function goLogical(li){
    if (baseCount <= pv) return;
    stopAutoplay();
    const current = logicalIndex();
    const delta = li - current;
    index += delta;
    animateToIndex(index);
    startAutoplay(true);
  }

  // Rebuild on breakpoint change
  function handleResize(){
    let last = pv;
    window.onresize = () => {
      const now = perView();
      if (now !== last){
        last = now;
        buildTrack();
        buildDots();
      }
    };
  }

  /* ---------- Read more/less ---------- */
  function wireToggles(){
    document.querySelectorAll('.review-card').forEach(card => {
      const textEl = card.querySelector('.review-text');
      const btn = card.querySelector('.toggle-btn');
      // hide if not overflowing
      requestAnimationFrame(() => {
        if (textEl.scrollHeight <= textEl.clientHeight + 1) btn.style.display = 'none';
      });
      btn.addEventListener('click', () => {
        const exp = textEl.classList.toggle('expanded');
        btn.setAttribute('aria-expanded', exp ? 'true' : 'false');
        btn.textContent = exp ? 'Read less' : 'Read more';
      });
    });
  }

  /* ---------- Helpers & Schema ---------- */
  function stars(r=0){ let h=''; for(let i=1;i<=5;i++){ h += `<span class="star${i<=r?'':' inactive'}">★</span>`; } return h; }
  function fmtDate(d){ try { const x=d instanceof Date?d:new Date(d); return isNaN(+x)?'':x.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});} catch { return ''; } }
  function getTime(d){ try { return (d instanceof Date?d:new Date(d)).getTime()||0; } catch { return 0; } }
  function esc(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function fail(msg){ const s=document.getElementById('status'); s.classList.add('error'); s.textContent = msg; }

  function injectSchema(reviews, meta){
    try{
      const base = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": meta.name || document.title,
        "url": location.origin + location.pathname
      };
      if (meta.rating != null && meta.userRatingCount != null) {
        base.aggregateRating = { "@type":"AggregateRating", "ratingValue": Number(meta.rating).toFixed(2), "ratingCount": meta.userRatingCount };
      } else if (reviews.length) {
        const avg = (reviews.reduce((s,r)=>s+(Number(r.rating)||0),0)/reviews.length).toFixed(2);
        base.aggregateRating = { "@type":"AggregateRating", "ratingValue": avg, "ratingCount": reviews.length };
      }
      base.review = reviews.slice(0, Math.min(10, reviews.length)).map(r => ({
        "@type": "Review",
        "author": { "@type":"Person", "name": r.authorAttribution?.displayName || "Google user" },
        "datePublished": r.publishTime instanceof Date ? r.publishTime.toISOString().split('T')[0] : '',
        "reviewBody": r.text || '',
        "reviewRating": { "@type":"Rating", "ratingValue": Number(r.rating||0) }
      }));
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(base);
      document.head.appendChild(script);
    }catch(e){ console.warn('Schema injection failed:', e); }
  }