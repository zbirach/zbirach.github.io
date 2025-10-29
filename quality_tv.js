(function(){'use strict';
if(typeof fetch==='undefined'){window.fetch=function(url,opts){return new Promise(function(res,rej){var xhr=new XMLHttpRequest();xhr.open((opts&&opts.method)||'GET',url);xhr.onload=function(){var status=xhr.status===1223?204:xhr.status; if(status>=200&&status<300){res({ok:true,status:status,text:function(){return Promise.resolve(xhr.responseText);},json:function(){return Promise.resolve(JSON.parse(xhr.responseText));}});}else rej(new Error('HTTP '+status));};xhr.onerror=function(){rej(new Error('Network error'));};try{xhr.send((opts&&opts.body)||null);}catch(e){rej(e);} });};}

// ==== CONFIG ====
var C={CACHE_VERSION:2,CACHE_KEY:'lqe_quality_cache',CACHE_VALID:24*60*60*1000,PROXY_LIST:['http://api.allorigins.win/raw?url=','http://cors.bwa.workers.dev/'],PROXY_TIMEOUT:4000,MAX_PARALLEL:8,SHOW_TV:true,USE_SIMPLE:true,LOG:false,JACRED_PROTOCOL:'http://',JACRED_URL:'jacred.xyz',MANUAL_OVERRIDES:{}};

// ==== util storage (Lampa.Storage preferred) ====
function storageGet(k){try{if(window.Lampa&&Lampa.Storage&&Lampa.Storage.get){return Lampa.Storage.get(k)||{};}return JSON.parse(localStorage.getItem(k)||'{}');}catch(e){try{return JSON.parse(localStorage.getItem(k)||'{}');}catch(e2){return {};}}}
function storageSet(k,v){try{if(window.Lampa&&Lampa.Storage&&Lampa.Storage.set){Lampa.Storage.set(k,v);return;}localStorage.setItem(k,JSON.stringify(v));}catch(e){/* silent */}}

// ==== basic css insert ====
var css="\
.card__quality{position:absolute;left:0;bottom:0.5em;margin-left:-0.78em;background:rgba(61,161,141,0.9);z-index:10;width:fit-content;max-width:calc(100% - 1em);border-radius:.3em;overflow:hidden}\
.card__quality div{text-transform:uppercase;font-family:'Roboto Condensed',Arial; font-weight:700;font-size:1.05em;color:#fff;padding:.18em .35em;white-space:nowrap;text-shadow:.5px .5px 1px rgba(0,0,0,.3)}\
.full-start__status.lqe-quality{border:1px solid #fff;color:#fff;padding:.2em .4em;border-radius:.2em;margin-right:.5em;display:inline-flex;align-items:center}\
.card__quality,.full-start__status.lqe-quality{opacity:0;transition:opacity .22s ease-in-out}\
.card__quality.show,.full-start__status.lqe-quality.show{opacity:1}\
";
try{var s=document.createElement('style');s.id='lqe_tv_css';s.innerHTML=css;document.head.appendChild(s);}catch(e){}

// ==== small helpers ====
function log(){ if(C.LOG) { try{console.log.apply(console,arguments);}catch(e){} } }
function now(){return Date.now();}
function isTv(card){ if(!card) return false; if(card.media_type==='tv'||card.type==='tv') return true; return !!(card.name||card.first_air_date); }
function sanitize(t){ if(!t) return ''; return String(t).toLowerCase().replace(/[\._\-\[\]\(\),]+/g,' ').replace(/\s+/g,' ').trim(); }
function makeKey(id,isTvFlag){ return C.CACHE_VERSION+'_'+(isTvFlag?'tv_':'movie_')+id; }

// ==== fetchWithProxy (tries proxies sequentially) ====
function fetchWithProxy(url,cardId,cb){
  var idx=0; var called=false;
  function next(){ if(idx>=C.PROXY_LIST.length){ if(!called){called=true;cb(new Error('all proxies failed'));} return; }
    var p=C.PROXY_LIST[idx++]+encodeURIComponent(url);
    log('fetch proxy',cardId,p);
    var timed=false;
    var to=setTimeout(function(){ timed=true; next(); }, C.PROXY_TIMEOUT);
    fetch(p).then(function(r){ clearTimeout(to); if(timed) return; if(!r||!r.ok) return next(); return r.text(); }).then(function(txt){ if(called) return; called=true; cb(null,txt); }).catch(function(){ clearTimeout(to); if(timed) return; next(); });
  }
  next();
}

// ==== simple queue ====
var q=[],active=0;
function enqueue(fn){ q.push(fn); processQueue(); }
function processQueue(){ if(active>=C.MAX_PARALLEL) return; var task=q.shift(); if(!task) return; active++; try{ task(function done(){ active--; setTimeout(processQueue,0); }); }catch(e){ active--; setTimeout(processQueue,0); } }

// ==== quality parsing utilities (slim) ====
function extractNumericQuality(title){
  if(!title) return 0; var l=title.toLowerCase();
  if(/2160p|4k|uhd/.test(l)) return 2160;
  if(/1440p|qhd|2k/.test(l)) return 1440;
  if(/1080p/.test(l)) return 1080;
  if(/720p/.test(l)) return 720;
  if(/480p/.test(l)) return 480;
  if(/tc|telecine/.test(l)) return 3;
  if(/ts|telesync/.test(l)) return 2;
  if(/camrip|cam|камрип/.test(l)) return 1;
  return 0;
}
function simplifyLabel(full){
  if(!full) return '';
  var l=full.toLowerCase();
  if(/camrip|cam\b/.test(l)) return 'CamRip';
  if(/telesync|ts\b/.test(l)) return 'TS';
  if(/telecine|tc\b/.test(l)) return 'TC';
  if(/2160p|4k|uhd/.test(l)) return '4K';
  if(/1440p|qhd|2k/.test(l)) return 'QHD';
  if(/1080p|fullhd|fhd/.test(l)) return 'FHD';
  if(/720p| hd\b/.test(l)) return 'HD';
  if(/480p|sd\b/.test(l)) return 'SD';
  return full;
}
function translateQualityLabel(code,title){
  var label='';
  if(title){
    var s=sanitize(title);
    if(/2160p|4k|uhd/.test(s)) label='4K';
    else if(/1080p|1080|fullhd|fhd/.test(s)) label='FHD';
    else if(/720p|hd\b/.test(s)) label='HD';
    else if(/480p|sd\b/.test(s)) label='SD';
  }
  if(!label && code){
    if(code>=2000) label = (code>=2160?'4K':(code>=1440?'QHD':(code>=1080?'FHD':(code>=720?'HD':'SD'))));
  }
  if(C.USE_SIMPLE && label) return label;
  if(!label && title) { return simplifyLabel(title); }
  return label||title||'';
}

// ==== UI update functions ====
function updateListQuality(cardView,qualityCode,fullTitle){
  if(!cardView) return;
  try{
    var existing = cardView.querySelector('.card__quality');
    var display = translateQualityLabel(qualityCode,fullTitle);
    // manual overrides check
    var cid = (cardView.card_data && cardView.card_data.id) || (cardView.closest && cardView.closest('.card') && cardView.closest('.card').card_data && cardView.closest('.card').card_data.id);
    if(cid && C.MANUAL_OVERRIDES && C.MANUAL_OVERRIDES[cid]){ var mo=C.MANUAL_OVERRIDES[cid]; if(mo && mo.simple_label) display = mo.simple_label; }
    if(existing){
      var inner = existing.querySelector('div');
      if(inner && inner.textContent===display) return;
      existing.parentNode && existing.parentNode.removeChild(existing);
    }
    var div = document.createElement('div');
    div.className='card__quality';
    var inner=document.createElement('div'); inner.textContent=display;
    div.appendChild(inner);
    var viewEl = cardView;
    viewEl.appendChild(div);
    setTimeout(function(){ div.classList.add('show'); },20);
  }catch(e){log('updateListQuality err',e);}
}
function updateFullQuality(renderEl,qualityCode,fullTitle,cardId){
  if(!renderEl) return;
  try{
    var rateLine = (function(){ try{ return renderEl.querySelector('.full-start-new__rate-line'); }catch(e){return null;} })();
    if(!rateLine) return;
    var display = translateQualityLabel(qualityCode,fullTitle);
    if(cardId && C.MANUAL_OVERRIDES && C.MANUAL_OVERRIDES[cardId]){ var mo=C.MANUAL_OVERRIDES[cardId]; if(mo && mo.full_label) display = mo.full_label; }
    var el = rateLine.querySelector('.full-start__status.lqe-quality');
    if(el){ el.textContent=display; el.classList.add('show'); } else {
      var d=document.createElement('div'); d.className='full-start__status lqe-quality'; d.textContent=display; rateLine.appendChild(d); setTimeout(function(){ d.classList.add('show'); },20);
    }
  }catch(e){log('updateFullQuality err',e);}
}

// ==== cache helpers ====
function getCache(key){ try{ var store = storageGet(C.CACHE_KEY)||{}; var item = store[key]; if(item && (now()-item.timestamp < C.CACHE_VALID)) return item; return null;}catch(e){return null;} }
function saveCache(key,data){ try{ var store = storageGet(C.CACHE_KEY)||{}; store[key] = { quality_code: data.quality_code, full_label: data.full_label, timestamp: now() }; storageSet(C.CACHE_KEY,store); }catch(e){} }

// ==== JacRed search (light) ====
function extractYearFromTitle(title){
  if(!title) return 0;
  var re = /(?:^|[^\d])(\d{4})(?:[^\d]|$)/g; var m; var last=0; var cy=new Date().getFullYear();
  while((m=re.exec(title))!==null){ var y=parseInt(m[1],10); if(y>=1900 && y<=cy+1) last=y; }
  return last;
}
function getBestFromJacred(normalized,cardId,cb){
  enqueue(function(done){
    try{
      if(!C.JACRED_URL){ cb(null); done(); return; }
      var year = (normalized.release_date && normalized.release_date.length>=4) ? normalized.release_date.substring(0,4) : '';
      if(!year || isNaN(year)){ cb(null); done(); return; }
      var strategies=[];
      if(normalized.original_title) strategies.push({title:normalized.original_title.trim(),year:year,exact:true});
      if(normalized.title) strategies.push({title:normalized.title.trim(),year:year,exact:true});
      if(strategies.length===0){ cb(null); done(); return; }
      var idx=0;
      function tryStrategy(){
        if(idx>=strategies.length){ cb(null); done(); return; }
        var s=strategies[idx++]; var api = C.JACRED_PROTOCOL + C.JACRED_URL + '/api/v1.0/torrents?search='+encodeURIComponent(s.title)+'&year='+s.year+'&exact='+ (s.exact? 'true':''); fetchWithProxy(api,cardId,function(err,txt){ if(err){ tryStrategy(); return; } try{ var arr=JSON.parse(txt); if(!Array.isArray(arr)||arr.length===0){ tryStrategy(); return; } var best=null; var bestQ=-1; for(var i=0;i<arr.length;i++){ var t=arr[i]; if(!t || !t.title) continue; if(normalized.type==='tv'){ if(!/(сезон|season|s\\d{1,2}|серии)/i.test(t.title)) continue; } else { if(/(сезон|season|s\\d{1,2}|серии)/i.test(t.title)) continue; } var q = (typeof t.quality==='number' && t.quality>0)? t.quality : extractNumericQuality(t.title); if(q<=0) continue; // skip unknown
            var yr = 0; if(t.relased && !isNaN(t.relased)) yr=parseInt(t.relased,10); if(yr<1900) yr = extractYearFromTitle(t.title); if(yr && Math.abs(yr - parseInt(s.year,10))>1) continue;
            if(q>bestQ){ bestQ=q; best=t; } else if(q===bestQ && best && t.title && t.title.length>best.title.length) best=t;
          }
          if(best){ cb({quality_code: best.quality||bestQ, full_label: best.title}); done(); return; } else { tryStrategy(); return; }
        }catch(e){ tryStrategy(); }
        });
      }
      tryStrategy();
    }catch(e){ cb(null); done(); }
  });
}

// ==== main processing for list card ====
function processCardList(cardEl){
  try{
    if(!cardEl || cardEl.hasAttribute('data-lqe-processed')) return;
    if(!cardEl.card_data){ requestAnimationFrame(function(){ processCardList(cardEl); }); return; }
    var data = cardEl.card_data; if(!data) return;
    if(!isTv(data) && !data.title && !data.name) return;
    var view = cardEl.querySelector('.card__view'); if(!view) return;
    // placeholder
    var placeholder = view.querySelector('.card__quality'); if(!placeholder){ var tmp = document.createElement('div'); tmp.className='card__quality'; tmp.innerHTML='<div>...</div>'; view.appendChild(tmp); setTimeout(function(){ tmp.classList.add('show'); },20); }
    cardEl.setAttribute('data-lqe-processed','loading');
    var manual = C.MANUAL_OVERRIDES[data.id];
    if(manual){ updateListQuality(view, manual.quality_code, manual.full_label); cardEl.setAttribute('data-lqe-processed','manual'); return; }
    var cacheKey = makeKey(data.id, isTv(data));
    var cached = getCache(cacheKey);
    if(cached){ updateListQuality(view, cached.quality_code, cached.full_label); cardEl.setAttribute('data-lqe-processed','cached'); return; }
    var normalized = { id: data.id, title: data.title||data.name||'', original_title: data.original_title||data.original_name||'', type: (data.media_type||data.type) || (data.name? 'tv':'movie'), release_date: data.release_date||data.first_air_date||'' };
    getBestFromJacred(normalized, data.id, function(res){
      if(res){ saveCache(cacheKey,res); updateListQuality(view, res.quality_code, res.full_label); cardEl.setAttribute('data-lqe-processed','done'); }
      else { cardEl.setAttribute('data-lqe-processed','notfound'); var ex = (data.release_date||data.first_air_date||''); updateListQuality(view,0,'—'); }
    });
  }catch(e){ log('processCardList err',e); }
}

// ==== full card processing ====
function processFullCard(cardData,renderElement){
  try{
    if(!cardData || !renderElement) return;
    var cardId = cardData.id || (cardData.media_id||'');
    var manual = C.MANUAL_OVERRIDES[cardId];
    var rateLine = renderElement.querySelector('.full-start-new__rate-line');
    if(manual){ updateFullQuality(renderElement,manual.quality_code,manual.full_label,cardId); return; }
    var cacheKey = makeKey(cardId, isTv(cardData));
    var cached = getCache(cacheKey);
    if(cached){ updateFullQuality(renderElement, cached.quality_code, cached.full_label, cardId); return; }
    var normalized = { id: cardId, title: cardData.title||cardData.name||'', original_title: cardData.original_title||cardData.original_name||'', type: (cardData.media_type||cardData.type) || (cardData.name? 'tv':'movie'), release_date: cardData.release_date||cardData.first_air_date||'' };
    getBestFromJacred(normalized, cardId, function(res){
      if(res){ saveCache(cacheKey,res); updateFullQuality(renderElement,res.quality_code,res.full_label,cardId); } else { updateFullQuality(renderElement,0,'—',cardId); }
    });
  }catch(e){ log('processFullCard err',e); }
}

// ==== DOM observers & init ====
var observer = new MutationObserver(function(muts){
  muts.forEach(function(mu){
    if(!mu.addedNodes) return;
    for(var i=0;i<mu.addedNodes.length;i++){ var n=mu.addedNodes[i]; if(n.nodeType!==1) continue;
      if(n.classList && n.classList.contains('card')){ processCardList(n); }
      try{ var inner = n.querySelectorAll && n.querySelectorAll('.card'); if(inner && inner.length>0){ for(var j=0;j<inner.length;j++){ processCardList(inner[j]); } } }catch(e){}
    }
  });
});
function init(){
  try{
    var containers = document.querySelectorAll('.cards,.card-list,.content,.main,.cards-list,.preview__list');
    if(containers && containers.length>0){ for(var i=0;i<containers.length;i++){ try{ observer.observe(containers[i],{childList:true,subtree:true}); }catch(e){} } }
    else { observer.observe(document.body,{childList:true,subtree:true}); }
    var existing = document.querySelectorAll('.card:not([data-lqe-processed])');
    for(var k=0;k<existing.length;k++){ (function(el,idx){ setTimeout(function(){ processCardList(el); }, idx*220); })(existing[k],k); }
    // Hook for full card: Lampa usually calls some render - attempt to patch Template render hooks if available
    try{ if(window.Lampa && Lampa.Template && Lampa.Template.add){ /* no-op: styles already added */ } }catch(e){}
  }catch(e){ log('init err',e); }
}
if(window.appready){ init(); } else if(window.Lampa && Lampa.Listener){ Lampa.Listener.follow('app',function(e){ if(e.type==='ready') init(); }); } else { setTimeout(init,1500); }

// expose small API
window.LampaQualityTV = {processCardList:processCardList,processFullCard:processFullCard,config:C};

})();
  
