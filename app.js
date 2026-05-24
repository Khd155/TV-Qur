/* =============================================
   app.js - نظام مواقيت الصلاة
   شركة قريش المحدودة - v4.0
   ============================================= */
(function(){
'use strict';

const STATE={MAIN:'main',PRE_ALERT:'pre_alert',ADHAN:'adhan',IQAMAH_COUNTDOWN:'iqamah_countdown',PRAYER_SILENT:'prayer_silent',DHIKR:'dhikr'};

/* ---- الأذكار ---- */
const DHIKR_LIST=[
  {id:1,text:'أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ',prayers:'all'},
  {id:2,text:'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',prayers:'all'},
  {id:3,text:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',prayers:'all'},
  {id:4,text:'لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ',prayers:'all'},
  {id:5,text:'اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',prayers:'all'},
  {id:6,text:'سُبْحَانَ اللهِ',repeat:33,prayers:'all'},
  {id:7,text:'الْحَمْدُ لِلَّهِ',repeat:33,prayers:'all'},
  {id:8,text:'اللَّهُ أَكْبَرُ',repeat:33,extra:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (تمام المائة)',prayers:'all'},
  {id:9,text:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',repeatLabel:'١٠ مرات',prayers:['fajr','maghrib']},
  {id:10,title:'آيَةُ الْكُرْسِيّ',text:'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',subtitle:'البقرة: ٢٥٥',prayers:'all',isQuran:true},
  {id:11,title:'سُورَةُ الْإِخْلَاصِ',text:'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',repeatFn:p=>['fajr','maghrib'].includes(p)?'٣ مرات':'مرة واحدة',prayers:'all',isQuran:true},
  {id:12,title:'سُورَةُ الْفَلَقِ',text:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',repeatFn:p=>['fajr','maghrib'].includes(p)?'٣ مرات':'مرة واحدة',prayers:'all',isQuran:true},
  {id:13,title:'سُورَةُ النَّاسِ',text:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',repeatFn:p=>['fajr','maghrib'].includes(p)?'٣ مرات':'مرة واحدة',prayers:'all',isQuran:true},
];

/* ---- الإعدادات الافتراضية ---- */
const DEF={
  latitude:21.4170, longitude:39.8770,
  locationPreset:'mina',
  orgNameAr:'شركة قريش المحدودة', orgNameEn:'Quraish Company Limited',
  prayerNames:{fajr:'الفجر',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'},
  prayerOrder:['fajr','dhuhr','asr','maghrib','isha'],
  iqamahMinutes:{fajr:20,dhuhr:15,asr:15,maghrib:10,isha:15},
  blackoutMinutes:{fajr:10,dhuhr:10,asr:10,maghrib:10,isha:10},
  alertMinutes:{fajr:5,dhuhr:5,asr:5,maghrib:5,isha:5},
  iqamahCountdownMinutes:10,
  enablePreAlert:true, enableAdhanScreen:true, enableIqamahCountdown:true,
  enablePrayerSilent:true, enableDhikr:true,
  dhikrDuration:20, dhikrEnabled:{},
  fontFamily:'Cairo', nightMode:false,
  enableAnnouncement:false, announcementText:'',
  showYoutubePanel:false,
  logoScale:0.85,
  cardNameSize:4,
};

let C=JSON.parse(JSON.stringify(DEF));
let pTimes={}, pRaw={};
let curState=STATE.MAIN, stData={};
let lastPing=Date.now();
let mouseMode=false;    // true عند استخدام الماوس — false عند استخدام الريموت
let db=null;            // Supabase client
let cloudLoaded=false;  // true إذا تم تحميل الإعدادات من السحابة بنجاح
let dkTimeout=null, dkIndex=0, dkPrayer=null, dkList=[], dkDonePrayer=null;

/* ---- أذكار الشاشة الرئيسية (تتناوب كل 5 دقائق) ---- */
const MAIN_TICKER=[
  /* ── آيات قرآنية ── */
  {text:'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا', ref:'النساء: ١٠٣', type:'quran'},
  {text:'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ', ref:'البقرة: ٢٣٨', type:'quran'},
  {text:'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ', ref:'البقرة: ٤٣', type:'quran'},
  {text:'وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ', ref:'العنكبوت: ٤٥', type:'quran'},
  {text:'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ', ref:'البقرة: ٤٥', type:'quran'},
  {text:'وَأَقِمِ الصَّلَاةَ لِذِكْرِي', ref:'طه: ١٤', type:'quran'},
  {text:'قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ', ref:'المؤمنون: ١-٢', type:'quran'},
  {text:'وَالَّذِينَ هُمْ عَلَىٰ صَلَوَاتِهِمْ يُحَافِظُونَ', ref:'المؤمنون: ٩', type:'quran'},
  {text:'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ', ref:'إبراهيم: ٤٠', type:'quran'},
  {text:'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', ref:'التوبة: ١٢٩', type:'quran'},
  /* ── أذكار ── */
  {text:'سُبْحَانَ اللهِ وَبِحَمْدِهِ ، سُبْحَانَ اللهِ الْعَظِيمِ', ref:'', type:'dhikr'},
  {text:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ', ref:'', type:'dhikr'},
  {text:'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', ref:'', type:'dhikr'},
  {text:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', ref:'', type:'dhikr'},
  {text:'سُبْحَانَ اللهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ', ref:'', type:'dhikr'},
  {text:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ', ref:'', type:'dhikr'},
  {text:'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', ref:'', type:'dhikr'},
  {text:'سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ', ref:'', type:'dhikr'},
  {text:'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', ref:'', type:'dhikr'},
  {text:'رَضِيتُ بِاللهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا وَرَسُولًا', ref:'', type:'dhikr'},
  {text:'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي', ref:'', type:'dhikr'},
];

/* ---- ذكر واحد خاص بفترة ما بين الأذان والإقامة ---- */
const POST_ADHAN_TICKER=[
  {text:'الدُّعَاءُ لَا يُرَدُّ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ', ref:'رواه أبو داود والترمذي وأحمد', type:'dhikr'},
];

let tickerIdx=0, tickerTimer=null;
/* المصدر النشط للتيكر — يتغير بين الأذكار العادية وأذكار ما بعد الأذان */
let activeTicker=MAIN_TICKER;
let lastTickerMode='main'; // 'main' | 'postAdhan'

function startMainTicker(){
  activeTicker=MAIN_TICKER; lastTickerMode='main';
  tickerShow(0);
}

/* تبديل قائمة التيكر — يُعاد التشغيل من البداية عند التغيير */
function switchTicker(list, mode){
  if(lastTickerMode===mode) return; // لا تُعد إذا لم يتغير الوضع
  lastTickerMode=mode;
  activeTicker=list;
  if(tickerTimer) clearTimeout(tickerTimer);
  tickerIdx=0;
  tickerShow(0);
}

function tickerShow(idx){
  tickerIdx=idx%activeTicker.length;
  const item=activeTicker[tickerIdx];
  const txtEl=g('tickerText'), refEl=g('tickerRef');
  const openEl=g('tickerOpen'), closeEl=g('tickerClose');
  if(txtEl) txtEl.textContent=item.text;
  if(refEl)  refEl.textContent=item.ref||'';
  const isQ=item.type==='quran';
  if(openEl)  openEl.style.display=isQ?'':'none';
  if(closeEl) closeEl.style.display=isQ?'':'none';
  if(tickerTimer) clearTimeout(tickerTimer);
  /* الأذكار العادية: 5 دقائق — أذكار ما بين الأذان والإقامة: 3 دقائق */
  const delay=lastTickerMode==='postAdhan'?3*60*1000:5*60*1000;
  tickerTimer=setTimeout(()=>tickerShow(tickerIdx+1), delay);
}

/* ================================================================
   قاعدة البيانات السحابية — Supabase
   ================================================================ */

/* تهيئة عميل Supabase */
function initSupabase(){
  if(!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || !window.supabase) return;
  try{
    db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    console.log('☁️ Supabase connected');
  }catch(e){ console.warn('[DB] init fail:', e); }
}

/* دمج الإعدادات في C */
function applyConfig(p){
  if(!p) return;
  ['iqamahMinutes','blackoutMinutes','alertMinutes','dhikrEnabled','prayerNames'].forEach(k=>{
    if(p[k]) C[k]={...C[k],...p[k]};
  });
  ['enablePreAlert','enableAdhanScreen','enableIqamahCountdown','enablePrayerSilent','enableDhikr',
   'dhikrDuration','fontFamily','nightMode','orgNameAr','orgNameEn','locationPreset',
   'latitude','longitude','iqamahCountdownMinutes',
   'enableAnnouncement','announcementText','showYoutubePanel','logoScale','cardNameSize'
  ].forEach(k=>{ if(p[k]!==undefined) C[k]=p[k]; });
}

/* إزالة الخلفية السوداء من الشعار بـ Canvas (مرة واحدة عند التحميل — لا GPU overhead) */
function removeBlackBg(src, cb){
  const img=new Image();
  img.crossOrigin='anonymous';
  img.onload=function(){
    try{
      const c=document.createElement('canvas');
      c.width=img.naturalWidth; c.height=img.naturalHeight;
      const ctx=c.getContext('2d');
      ctx.drawImage(img,0,0);
      const d=ctx.getImageData(0,0,c.width,c.height);
      const px=d.data;
      for(let i=0;i<px.length;i+=4){
        // اجعل البيكسلات الداكنة جداً شفافة
        if(px[i]<40 && px[i+1]<40 && px[i+2]<40) px[i+3]=0;
      }
      ctx.putImageData(d,0,0);
      cb(c.toDataURL('image/png'));
    }catch(e){ cb(src); } // إذا فشل Canvas (CORS) رجّع الأصلي
  };
  img.onerror=function(){ cb(src); };
  img.src=src;
}

/* تطبيق الشعار على الصفحة */
function applyLogoData(data){
  if(!data) return;
  // إذا كانت بيانات base64 أو صورة — نزيل الخلفية السوداء أولاً
  removeBlackBg(data, function(clean){
    const li=g('companyLogo'); if(li) li.src=clean;
    const lp=g('logoPreview'); if(lp) lp.src=clean;
  });
}

/* تحميل كل شيء من السحابة مرة واحدة عند التشغيل */
async function loadAllFromCloud(){
  if(!db) return;
  try{
    const {data,error}=await db.from('app_settings').select('*').eq('id',1).single();
    if(error||!data){ console.warn('[DB]', error?.message); return; }

    if(data.config && Object.keys(data.config).length) applyConfig(data.config);
    if(data.media  && Array.isArray(data.media))       { mediaList=data.media; migrateMedia(); }
    if(data.logo)                                        applyLogoData(data.logo);

    cloudLoaded=true;
    /* نسخ احتياطي محلي */
    try{ localStorage.setItem('qp_v34_cfg',   JSON.stringify(C));          }catch(e){}
    try{ localStorage.setItem('qp_v34_media', JSON.stringify(mediaList));   }catch(e){}
    if(data.logo) try{ localStorage.setItem('qp_v34_logo', data.logo);     }catch(e){}
    console.log('☁️ Loaded from cloud ✅');
  }catch(e){ console.warn('[DB] loadAll fail:', e); }
}

/* حفظ الشعار في السحابة */
function saveLogo(data){
  try{ localStorage.setItem('qp_v34_logo', data); }catch(e){}
  if(!db) return;
  db.from('app_settings')
    .update({ logo: data||null, updated_at: new Date().toISOString() })
    .eq('id',1)
    .then(()=>{ console.log('☁️ logo saved'); })
    .catch(e=>console.warn('[DB] logo save:', e));
}

/* تزامن فوري — يُحدِّث كل الشاشات عند تغيير الإعدادات من أي جهاز */
function initRealtime(){
  if(!db) return;
  db.channel('settings_sync')
    .on('postgres_changes',{
      event: 'UPDATE', schema: 'public', table: 'app_settings', filter: 'id=eq.1'
    }, payload=>{
      const d=payload.new;
      if(d.config) applyConfig(d.config);
      if(d.media && Array.isArray(d.media)){ mediaList=d.media; migrateMedia(); }
      if(d.logo)   applyLogoData(d.logo);
      fillUI(); applyDynamic(); buildDhikrUI();
      buildMediaUI(); updatePrayerLocal(); tryAPI();
      console.log('☁️ ⚡ إعدادات محدَّثة من جهاز آخر');
    })
    .subscribe(s=>console.log('☁️ realtime:', s));
}

/* ---- حفظ / تحميل الإعدادات ---- */
function loadCfg(){
  // يُحمَّل دائماً من localStorage كخط دفاع أول — السحابة ستتغلب لاحقاً إذا كان فيها بيانات
  try{
    const s=localStorage.getItem('qp_v34_cfg');
    if(!s) return;
    applyConfig(JSON.parse(s));
  }catch(e){}
}

function saveCfg(){
  /* محلي */
  try{ localStorage.setItem('qp_v34_cfg',JSON.stringify(C)); }catch(e){}
  /* سحابي (في الخلفية) */
  if(!db) return;
  db.from('app_settings')
    .update({ config: C, updated_at: new Date().toISOString() })
    .eq('id',1)
    .then(()=>{ console.log('☁️ config saved'); })
    .catch(e=>console.warn('[DB] config save:', e));
}

/* ---- State Machine ---- */
function go(ns,data={}){
  if(ns===curState){stData={...stData,...data};refreshOverlayText();return;}
  curState=ns; stData=data;
  render();
}

function render(){
  // أخفِ الكل أولاً — امسح الـ class وأعد الـ inline style
  ['mainDashboard','preAlertOverlay','adhanScreen','iqamahCountdownScreen','prayerSilentScreen','dhikrScreen']
    .forEach(id=>{
      const e=document.getElementById(id);
      if(e){ e.classList.remove('show'); e.style.display='none'; }
    });

  // أظهر العنصر المطلوب — امسح الـ inline style واترك الـ CSS يعمل
  const show=id=>{
    const e=document.getElementById(id);
    if(e){ e.classList.add('show'); e.style.display=''; }
  };

  switch(curState){
    case STATE.MAIN:           show('mainDashboard'); break;
    case STATE.PRE_ALERT:      show('mainDashboard'); show('preAlertOverlay'); refreshOverlayText(); break;
    case STATE.ADHAN:          show('adhanScreen'); if(g('adhanPrayerName'))g('adhanPrayerName').textContent=C.prayerNames[stData.prayer]||''; break;
    case STATE.IQAMAH_COUNTDOWN: show('iqamahCountdownScreen'); if(g('iqamahCountdownPrayerName'))g('iqamahCountdownPrayerName').textContent=C.prayerNames[stData.prayer]||''; break;
    case STATE.PRAYER_SILENT:  show('prayerSilentScreen'); break;
    case STATE.DHIKR:          show('dhikrScreen'); startDhikr(); break;
  }
}

function refreshOverlayText(){
  if(curState!==STATE.PRE_ALERT) return;
  const p=C.prayerNames[stData.prayer]||'', m=stData.minsLeft||0, s=stData.secsLeft||0;
  const e=g('preAlertText');
  if(e) e.textContent=m>0?`تبقى ${m} دقيقة على أذان ${p}`:`تبقى ${s} ثانية على أذان ${p}`;
}

/* ---- مساعد ---- */
function g(id){return document.getElementById(id);}

/* يُظهر/يُخفي مؤشر الماوس على html+body معاً (لضمان عمل الأحداث في Android WebView) */
function ensureCursor(visible){
  const v = visible ? 'auto' : 'none';
  document.body.style.cursor = v;
  document.documentElement.style.cursor = v;
}

/* ---- الأذكار ---- */
function startDhikr(){
  clearDkTimer();
  if(!dkPrayer){go(STATE.MAIN);return;}
  dkList=DHIKR_LIST.filter(d=>{
    if(C.dhikrEnabled[d.id]===false) return false;
    if(d.prayers==='all') return true;
    if(Array.isArray(d.prayers)) return d.prayers.includes(dkPrayer);
    return true;
  });
  if(!dkList.length){go(STATE.MAIN);return;}
  dkIndex=0; showDk(0);
}

function showDk(i){
  if(i>=dkList.length){dkDonePrayer=dkPrayer;dkPrayer=null;go(STATE.MAIN);return;}
  const d=dkList[i], dur=(C.dhikrDuration||20)*1000;
  const set=(id,v)=>{const e=g(id);if(e)e.textContent=v;};
  set('dhikrTitle', d.title||'');
  set('dhikrText',  d.text||'');
  set('dhikrSubtitle', d.subtitle||'');
  let rep='';
  if(d.repeat) rep=d.repeat+' مرة'+(d.extra?' ثم: '+d.extra:'');
  else if(d.repeatFn) rep=d.repeatFn(dkPrayer);
  else if(d.repeatLabel) rep=d.repeatLabel;
  else rep='مرة واحدة';
  set('dhikrRepeat', rep);
  set('dhikrCounter', i+1);
  set('dhikrTotal', dkList.length);
  const prog=g('dhikrProgress');
  if(prog){prog.style.transition='none';prog.style.width='100%';setTimeout(()=>{prog.style.transition=`width ${dur}ms linear`;prog.style.width='0%';},50);}
  dkTimeout=setTimeout(()=>{dkIndex++;showDk(dkIndex);}, dur);
}
function clearDkTimer(){if(dkTimeout){clearTimeout(dkTimeout);dkTimeout=null;}}

/* ---- زر تخطي الذكر ---- */
function initDhikrSkip(){
  const btn=g('btnDhikrSkip');
  if(!btn) return;
  btn.addEventListener('click',()=>{
    clearDkTimer();
    dkIndex++;
    showDk(dkIndex);
  });
}

/* ---- الساعة ---- */
function to12(t){
  if(!t||t==='--:--') return '--:--';
  const p=t.split(':');let h=parseInt(p[0]);const m=p[1];
  const per=h>=12?'م':'ص';let h12=h%12;if(!h12)h12=12;
  return h12+':'+m+' '+per;
}
function fmt12(d){
  const h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0'),s=String(d.getSeconds()).padStart(2,'0');
  const per=h>=12?'مساءً':'صباحاً';let h12=h%12;if(!h12)h12=12;
  return {time:String(h12).padStart(2,'0')+':'+m+':'+s, period:per};
}

/* ---- الوقت الحالي من الجهاز مباشرة ---- */
function nowSA(){
  return new Date();
}

function updateClock(){
  const now=nowSA(), c=fmt12(now);   // توقيت مكة دائماً بغض النظر عن ضبط الجهاز
  const set=(id,v)=>{const e=g(id);if(e)e.textContent=v;};
  set('currentTime',c.time); set('currentPeriod',c.period);
  set('silentTime',c.time+' '+c.period);
  set('iqamahCountdownClock',c.time);
  updateCountdown(now); updateCards(now); checkTransitions(now);
  lastPing=Date.now();
}

/* ---- التاريخ ---- */
function updateDate(){
  const now=nowSA();   // التاريخ بتوقيت مكة
  // اسم اليوم مرة واحدة فقط
  try{
    const dayFmt=new Intl.DateTimeFormat('ar',{weekday:'long'});
    const dn=dayFmt.format(now);
    const ed=g('dayName');if(ed)ed.textContent=dn;
    // الهجري بدون اسم اليوم
    const hf=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'});
    const hd=hf.format(now);
    ['hijriDate','tickerHijri'].forEach(id=>{const e=g(id);if(e)e.textContent=hd;});
  }catch(e){}
  // الميلادي بدون اسم اليوم
  const gf=new Intl.DateTimeFormat('ar',{day:'numeric',month:'long',year:'numeric'});
  const gd=gf.format(now);
  ['gregorianDate','tickerGregorian'].forEach(id=>{const e=g(id);if(e)e.textContent=gd;});
  const yr=now.getFullYear();
  const ey=g('currentYear');if(ey)ey.textContent=yr;
}

/* ---- مواقيت الصلاة (محلي - UTC+3) ---- */
function updatePrayerLocal(){
  const now=nowSA();   // التاريخ بتوقيت مكة — يحل مشكلة الجهاز بتوقيت مختلف
  const times=PrayTimes.getTimes(now,C.latitude,C.longitude,3);
  pTimes={fajr:times.fajr,dhuhr:times.dhuhr,asr:times.asr,maghrib:times.maghrib,isha:times.isha};
  pRaw=times._raw;
  if(times.sunrise&&times.sunrise!=='--:--'){
    const sp=times.sunrise.split(':');
    pRaw.sunrise=parseInt(sp[0])+parseInt(sp[1])/60;
  }
  cacheP(); displayP();
}

function displayP(){
  C.prayerOrder.forEach(p=>{
    const e=g('time-'+p);if(e&&pTimes[p])e.textContent=to12(pTimes[p]);
  });
  if(pRaw.sunrise!==undefined){
    const srH=Math.floor(pRaw.sunrise), srM=Math.round((pRaw.sunrise-srH)*60);
    const srStr=String(srH).padStart(2,'0')+':'+String(srM).padStart(2,'0');
    const esr=g('time-sunrise');if(esr)esr.textContent=to12(srStr);
    let ish=pRaw.sunrise+15/60;
    const ishH=Math.floor(ish)%24, ishM=Math.round((ish-Math.floor(ish))*60);
    const ishStr=String(ishH).padStart(2,'0')+':'+String(ishM).padStart(2,'0');
    const ei=g('time-ishraq');if(ei)ei.textContent=to12(ishStr);
  }
  updateIqamahDisplay();
}

function updateIqamahDisplay(){
  C.prayerOrder.forEach(p=>{
    const e=g('iqamah-val-'+p);if(!e)return;
    const mins=C.iqamahMinutes[p]||15;
    if(pTimes[p]&&pTimes[p]!=='--:--'){
      const pts=pTimes[p].split(':');
      let h=parseInt(pts[0]),m=parseInt(pts[1])+mins;
      if(m>=60){h+=Math.floor(m/60);m=m%60;}h=h%24;
      e.textContent=to12(String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'));
    } else {e.textContent=mins+' د';}
  });
}

/* ---- API (method=4 + Asia/Riyadh) ---- */
async function tryAPI(){
  try{
    const nowSA=new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Riyadh'});
    const [dd,mm,yyyy]=nowSA.split('/');
    const url=`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${C.latitude}&longitude=${C.longitude}&method=4`;
    const r=await fetch(url,{signal:AbortSignal.timeout(6000)});
    const d=await r.json();
    if(d.code===200&&d.data?.timings){
      const t=d.data.timings;
      pTimes={fajr:t.Fajr,dhuhr:t.Dhuhr,asr:t.Asr,maghrib:t.Maghrib,isha:t.Isha};
      pRaw={};
      C.prayerOrder.forEach(p=>{
        if(pTimes[p]){const pts=pTimes[p].split(':');pRaw[p]=parseInt(pts[0])+parseInt(pts[1])/60;}
      });
      if(t.Sunrise){const sp=t.Sunrise.split(':');pRaw.sunrise=parseInt(sp[0])+parseInt(sp[1])/60;}
      cacheP(); displayP(); return true;
    }
  }catch(e){console.log('API offline');}
  return false;
}

function cacheP(){try{localStorage.setItem('qp_v34_pcache',JSON.stringify({times:pTimes,raw:pRaw,date:new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Riyadh'})}));}catch(e){}}
function loadCache(){
  try{
    const s=localStorage.getItem('qp_v34_pcache');if(!s)return false;
    const d=JSON.parse(s);
    const today=new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Riyadh'});
    if(d.date===today){pTimes=d.times;pRaw=d.raw;displayP();return true;}
  }catch(e){}
  return false;
}

/* ---- الصلاة الحالية والقادمة ---- */
function getInfo(now){
  const ch=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
  let cur=null,nxt=null;
  for(let i=0;i<C.prayerOrder.length;i++){
    const pt=pRaw[C.prayerOrder[i]];
    if(pt===undefined||isNaN(pt)) continue;
    if(ch>=pt){cur=C.prayerOrder[i];nxt=i+1<C.prayerOrder.length?C.prayerOrder[i+1]:C.prayerOrder[0];}
  }
  if(!cur){cur='isha';nxt='fajr';}
  return {cur,nxt};
}

/* ---- تحقق الانتقالات ---- */
function checkTransitions(now){
  if(curState===STATE.DHIKR) return;
  const ch=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
  const info=getInfo(now);

  for(const prayer of C.prayerOrder){
    const pt=pRaw[prayer];if(pt===undefined||isNaN(pt)) continue;
    const iqT=pt+C.iqamahMinutes[prayer]/60;
    const minsToIq=(iqT-ch)*60;
    const diffFromIq=(ch-iqT)*60;

    if(C.enableIqamahCountdown&&minsToIq>=0&&minsToIq<=C.iqamahCountdownMinutes){
      const ts=Math.floor(minsToIq*60),tm=Math.floor(ts/60),ts2=ts%60;
      const te=g('iqamahCountdownTimer');if(te)te.textContent=String(tm).padStart(2,'0')+':'+String(ts2).padStart(2,'0');
      if(dkDonePrayer===prayer) dkDonePrayer=null; // reset for next dhikr cycle
      go(STATE.IQAMAH_COUNTDOWN,{prayer});return;
    }
    if(C.enablePrayerSilent&&diffFromIq>=0&&diffFromIq<C.blackoutMinutes[prayer]){
      go(STATE.PRAYER_SILENT,{prayer});return;
    }
    if(C.enableDhikr&&diffFromIq>=C.blackoutMinutes[prayer]&&diffFromIq<C.blackoutMinutes[prayer]+1){
      if(curState!==STATE.DHIKR&&dkDonePrayer!==prayer){dkPrayer=prayer;go(STATE.DHIKR,{prayer});}
      return;
    }
  }

  if(C.enableAdhanScreen){
    for(const prayer of C.prayerOrder){
      const pt=pRaw[prayer];if(pt===undefined||isNaN(pt)) continue;
      const dm=(ch-pt)*60;
      if(dm>=0&&dm<2){go(STATE.ADHAN,{prayer});return;}
    }
  }

  if(C.enablePreAlert){
    const nt=pRaw[info.nxt];
    if(nt!==undefined&&!isNaN(nt)){
      let diff=nt-ch;if(diff<0)diff+=24;
      const dm=diff*60,am=C.alertMinutes[info.nxt]||5;
      if(dm<=am&&dm>0.3){
        const ml=Math.floor(dm),sl=Math.floor((dm-ml)*60);
        go(STATE.PRE_ALERT,{prayer:info.nxt,minsLeft:ml,secsLeft:sl});return;
      }
    }
  }

  if(curState!==STATE.MAIN) go(STATE.MAIN);
}

/* ---- عداد الصلاة القادمة / الإقامة ---- */
function updateCountdown(now){
  const info=getInfo(now);
  const ch=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
  const set=(id,v)=>{const e=g(id);if(e)e.textContent=v;};
  const lbl=g('nextBarLabel');

  /* هل نحن بعد أذان صلاة ما وقبل إقامتها؟ */
  let postAdhanPrayer=null;
  for(const prayer of C.prayerOrder){
    const pt=pRaw[prayer];if(pt===undefined||isNaN(pt)) continue;
    const iqT=pt+C.iqamahMinutes[prayer]/60;
    /* بعد الأذان (ch >= pt) وقبل الإقامة (ch < iqT) */
    if(ch>=pt && ch<iqT){ postAdhanPrayer=prayer; break; }
  }

  if(postAdhanPrayer){
    /* ── وضع "إقامة [الصلاة] بعد X دقيقة" ── */
    const pt=pRaw[postAdhanPrayer];
    const iqT=pt+C.iqamahMinutes[postAdhanPrayer]/60;
    const secsLeft=Math.max(0,Math.floor((iqT-ch)*3600));
    const m=Math.floor(secsLeft/60), s=secsLeft%60;
    const txt=m>0?`بعد ${m} دقيقة`:`بعد ${s} ثانية`;

    if(lbl){ lbl.textContent='إقامة صلاة'; lbl.style.color='var(--gold)'; }
    set('nextPrayerName', C.prayerNames[postAdhanPrayer]||'—');
    set('nextPrayerCountdown', txt);
    const ea=g('tickerAlert');
    if(ea) ea.textContent='إقامة صلاة '+(C.prayerNames[postAdhanPrayer]||'')+' بعد '+(m>0?m+' دقيقة':s+' ثانية');
    /* التيكر العلوي → أذكار خاصة بين الأذان والإقامة */
    switchTicker(POST_ADHAN_TICKER,'postAdhan');
    return;
  }

  /* ── الوضع الطبيعي: الصلاة القادمة ── */
  /* التيكر العلوي → العودة للأذكار العادية */
  switchTicker(MAIN_TICKER,'main');
  if(lbl){ lbl.textContent='الصلاة القادمة'; lbl.style.color=''; }
  set('nextPrayerName',C.prayerNames[info.nxt]||'—');
  const nt=pRaw[info.nxt];
  if(nt===undefined||isNaN(nt)){set('nextPrayerCountdown','—');return;}
  let diff=nt-ch;if(diff<0)diff+=24;
  const ts=Math.floor(diff*3600),h=Math.floor(ts/3600),m=Math.floor((ts%3600)/60),s=ts%60;
  /* نعرض الساعات والدقائق فقط — الثواني فقط في آخر دقيقة */
  const txt=h>0?`باقي ${h} ساعة و ${m} دقيقة`:m>0?`باقي ${m} دقيقة`:`باقي ${s} ثانية`;
  set('nextPrayerCountdown',txt);
  const alert=m<=5&&!h?'اقترب وقت صلاة '+C.prayerNames[info.nxt]:'الصلاة القادمة: '+C.prayerNames[info.nxt];
  const ea=g('tickerAlert');if(ea)ea.textContent=alert;
}

/* ---- تحديث البطاقات ---- */
function updateCards(now){
  const info=getInfo(now);
  C.prayerOrder.forEach(p=>{
    const c=g('card-'+p);if(!c)return;
    c.classList.remove('active','next-up','pre-alert');
    if(p===info.cur) c.classList.add('active');
    else if(p===info.nxt) c.classList.add('next-up');
  });
  if(curState===STATE.PRE_ALERT&&stData.prayer){
    const c=g('card-'+stData.prayer);if(c)c.classList.add('pre-alert');
  }
}

/* ================================================================
   مدير المحتوى - يوتيوب
   ================================================================ */
let mediaList=[];
let mediaCurrentId=null;
let mediaRotIdx=0;
let mediaStartTime=0;
let mediaStarted=false;
let mediaAdvanceTimer=null; // مؤقت الانتقال التلقائي للفيديو التالي

const MEDIA_DEFAULTS=[
  {id:1,label:'🕋 البث المباشر',   url:'https://www.youtube.com/live/fZvuHkHYaXk?si=hGpNGhGVeNdSpL68', mode:'auto',durationSec:0,  from:'',to:'',enabled:true},
  {id:2,label:'📢 توجيهات قريش', url:'https://youtu.be/M2fFO9tUXak?si=9v1EItUVCae658qU',               mode:'auto',durationSec:300,from:'',to:'',enabled:true},
];

function loadMedia(){
  if(cloudLoaded) return; // تم التحميل من السحابة بالفعل
  try{
    const s=localStorage.getItem('qp_v34_media');
    if(s){ mediaList=JSON.parse(s); migrateMedia(); return; }
    const old=localStorage.getItem('qp_v34_stream');
    mediaList=JSON.parse(JSON.stringify(MEDIA_DEFAULTS));
    if(old){ mediaList.unshift({id:99,label:'محتوى مخصص',url:old,mode:'auto',durationSec:0,from:'',to:'',enabled:true}); }
  }catch(e){ mediaList=JSON.parse(JSON.stringify(MEDIA_DEFAULTS)); }
}

function saveMedia(){
  /* محلي */
  try{ localStorage.setItem('qp_v34_media',JSON.stringify(mediaList)); }catch(e){}
  /* سحابي (في الخلفية) */
  if(!db) return;
  db.from('app_settings')
    .update({ media: mediaList, updated_at: new Date().toISOString() })
    .eq('id',1)
    .then(()=>{ console.log('☁️ media saved'); })
    .catch(e=>console.warn('[DB] media save:', e));
}

/* هجرة البيانات القديمة إلى نموذج mode/durationSec */
function migrateMedia(){
  let changed=false;
  mediaList=mediaList.map(m=>{
    if(m.mode!==undefined) return m; // جديد بالفعل
    changed=true;
    const hasTRange=m.from&&m.to;
    const hasDuration=m.durationMin&&m.durationMin>0;
    return {
      ...m,
      mode: hasTRange?'timeRange':hasDuration?'countdown':'auto',
      durationSec: hasDuration?m.durationMin*60:0,
    };
  });
  if(changed) saveMedia();
}

function nextMediaId(){
  return mediaList.length ? Math.max(...mediaList.map(m=>m.id))+1 : 1;
}

function getYouTubeEmbed(url){
  if(!url) return '';
  url=url.trim();
  let vid=null, list=null, m;
  m=url.match(/[?&]list=([a-zA-Z0-9_-]+)/); if(m) list=m[1];
  m=url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if(!m) m=url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if(!m) m=url.match(/youtube(?:-nocookie)?\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if(m) vid=m[1];
  /* youtube-nocookie.com أكثر توافقاً مع Android WebView:
     - لا يحجب التضمين بسبب origin = file://
     - يدعم autoplay بدون قيود المتصفح
     - playsinline=1 ضروري للتشغيل داخل العنصر بدون ملء الشاشة */
  const BASE = 'https://www.youtube-nocookie.com/embed';
  // iv_load_policy=3 يخفي التعليقات التوضيحية | cc_load_policy=0 يخفي الترجمة | modestbranding=1 يخفي شعار YouTube
  const p = 'autoplay=1&mute=1&rel=0&playsinline=1&controls=0&iv_load_policy=3&cc_load_policy=0&modestbranding=1&disablekb=1';
  if(vid && list) return `${BASE}/${vid}?list=${list}&${p}`;
  if(list)        return `${BASE}/videoseries?list=${list}&${p}`;
  if(vid)         return `${BASE}/${vid}?${p}`;
  if(url.includes('youtube.com/embed') || url.includes('youtube-nocookie.com/embed'))
    return url + (url.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&playsinline=1';
  return url;
}

function nowMin(){
  const d=new Date(); return d.getHours()*60+d.getMinutes();
}
function toMin(t){
  if(!t) return null;
  const p=t.split(':'); return parseInt(p[0])*60+parseInt(p[1]);
}
function inRange(from,to){
  const f=toMin(from),t=toMin(to),n=nowMin();
  if(f===null||t===null) return false;
  return f<=t ? (n>=f&&n<t) : (n>=f||n<t);
}

function playMedia(item){
  const aspect=g('mediaAspect'), frame=g('mediaFrame'), empty=g('mediaEmpty');

  // ألغِ أي مؤقت انتقال سابق
  if(mediaAdvanceTimer){ clearTimeout(mediaAdvanceTimer); mediaAdvanceTimer=null; }

  if(!item||!item.url){
    if(aspect) aspect.style.display='none';
    if(frame){ frame.src='about:blank'; }  // تحرير ذاكرة YouTube تماماً
    if(empty) empty.style.display='flex';
    mediaCurrentId=null; return;
  }

  // لا تعيد تحميل نفس الفيديو
  if(mediaCurrentId===item.id){
    const _d=(item.durationSec||0)*1000;
    if(_d>0 && !mediaAdvanceTimer)
      mediaAdvanceTimer=setTimeout(()=>{ mediaAdvanceNext(); }, _d);
    return;
  }

  if(frame) frame.src=getYouTubeEmbed(item.url);
  if(aspect) aspect.style.display='flex';
  if(empty) empty.style.display='none';
  mediaCurrentId=item.id;
  mediaStartTime=Date.now();

  // جدوِل الانتقال التلقائي بـ setTimeout دقيق (لا polling)
  const dur=(item.durationSec||0)*1000;
  if(dur>0){
    mediaAdvanceTimer=setTimeout(()=>{ mediaAdvanceNext(); }, dur);
  }
}

/* ينتقل للفيديو التالي في القائمة ويكرر */
function mediaAdvanceNext(){
  mediaAdvanceTimer=null;
  const enabled=mediaList.filter(m=>m.enabled&&m.url);
  const rot=enabled.filter(m=>m.mode!=='timeRange');
  if(!rot.length){ playMedia(null); return; }
  mediaCurrentId=null; // اسمح لـ playMedia بإعادة التحميل
  mediaRotIdx=(mediaRotIdx+1)%rot.length;
  playMedia(rot[mediaRotIdx]);
}

function mediaSchedulerTick(){
  // يبدأ تلقائياً إذا في محتوى مفعّل
  const hasEnabled=mediaList.some(m=>m.enabled&&m.url);
  if(!mediaStarted&&!hasEnabled) return;
  if(hasEnabled) mediaStarted=true;

  const enabled=mediaList.filter(m=>m.enabled&&m.url);
  if(!enabled.length){ playMedia(null); return; }

  // عناصر timeRange لها أولوية
  const scheduled=enabled.find(m=>m.mode==='timeRange'&&m.from&&m.to&&inRange(m.from,m.to));
  if(scheduled){
    if(mediaCurrentId!==scheduled.id){ mediaCurrentId=null; playMedia(scheduled); }
    return;
  }

  // إذا في شيء يشتغل وعنده مؤقت → لا تتدخل
  if(mediaCurrentId!==null && mediaAdvanceTimer) return;

  // ابدأ التشغيل إذا لا شيء يعزف
  const rot=enabled.filter(m=>m.mode!=='timeRange');
  if(!rot.length){ playMedia(null); return; }
  if(mediaRotIdx>=rot.length) mediaRotIdx=0;
  if(mediaCurrentId===null) playMedia(rot[mediaRotIdx]);
}

function buildMediaUI(){
  const list=g('mediaItemsList');
  const badge=g('mediaCountBadge');
  if(!list) return;
  if(badge) badge.textContent=mediaList.length?`(${mediaList.length})`:'';
  list.innerHTML='';
  if(!mediaList.length){
    list.innerHTML='<div class="mi-empty">لا يوجد محتوى — أضف رابط يوتيوب من الأعلى</div>';
    return;
  }
  const editingId=window._editingMediaId?window._editingMediaId():null;

  mediaList.forEach((item,idx)=>{
    const div=document.createElement('div');
    let cls='mi-card';
    if(!item.enabled) cls+=' mi-disabled';
    if(item.id===editingId) cls+=' mi-editing';
    div.className=cls;

    // بادجات المعلومات
    let badges='';
    if(item.mode==='timeRange'&&item.from&&item.to){
      badges+=`<span class="mi-badge mi-badge-time">🕐 ${item.from}–${item.to}</span>`;
    } else {
      badges+=`<span class="mi-badge mi-badge-auto">🔄 تلقائي</span>`;
    }
    if(item.durationSec>0){
      const dm=Math.floor(item.durationSec/60),ds=item.durationSec%60;
      badges+=`<span class="mi-badge mi-badge-dur">⏱ ${dm>0?dm+'د ':''} ${ds>0?ds+'ث':''}`.trim()+'</span>';
    } else if(item.mode!=='timeRange'){
      badges+=`<span class="mi-badge mi-badge-dur">⏱ بلا حد</span>`;
    }

    div.innerHTML=`
      <span class="mi-num">${idx+1}</span>
      <label class="mi-toggle" title="${item.enabled?'إيقاف':'تشغيل'}">
        <input type="checkbox" data-mid="${item.id}" ${item.enabled?'checked':''}>
        <span class="mi-toggle-track"></span>
      </label>
      <div class="mi-info">
        <span class="mi-label">${escHtml(item.label||'بدون اسم')}</span>
        <span class="mi-meta">${badges}</span>
      </div>
      <button class="mi-play tbtn"          data-mid="${item.id}" title="تشغيل الآن">▶</button>
      <button class="mi-edit tbtn"          data-mid="${item.id}" title="تعديل">✏️</button>
      <button class="mi-del  tbtn danger"   data-mid="${item.id}" title="حذف">✕</button>
    `;
    list.appendChild(div);
  });

  // toggle تفعيل/إيقاف
  list.querySelectorAll('input[data-mid]').forEach(cb=>{
    cb.addEventListener('change',()=>{
      const id=parseInt(cb.dataset.mid);
      const item=mediaList.find(m=>m.id===id);
      if(item){ item.enabled=cb.checked; saveMedia(); buildMediaUI(); mediaCurrentId=null; mediaSchedulerTick(); }
    });
  });

  // تشغيل الآن
  list.querySelectorAll('.mi-play').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.mid);
      const item=mediaList.find(m=>m.id===id);
      if(item){
        mediaStarted=true;
        mediaCurrentId=null;
        playMedia(item);
        g('settingsPanel').style.display='none';
        ensureCursor(false);
      }
    });
  });

  // تعديل
  list.querySelectorAll('.mi-edit').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.mid);
      if(window._startEditMedia) window._startEditMedia(id);
    });
  });

  // حذف
  list.querySelectorAll('.mi-del').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.mid);
      mediaList=mediaList.filter(m=>m.id!==id);
      if(mediaCurrentId===id) mediaCurrentId=null;
      saveMedia(); buildMediaUI(); mediaSchedulerTick();
    });
  });
}

function escHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* sizeVideo — لم تعد مطلوبة، الـ CSS يتكفل بالنسبة 16:9 */
function sizeVideo(){ /* no-op */ }

function initMedia(){
  loadMedia();

  // ===== نوع التشغيل: تلقائي / توقيت محدد =====
  let mediaFormMode='auto'; // الوضع الافتراضي
  let editingMediaId=null;  // null = إضافة جديدة، رقم = تعديل

  function setFormMode(mode){
    mediaFormMode=mode;
    g('mModeAuto').classList.toggle('active', mode==='auto');
    g('mModeTime').classList.toggle('active', mode==='timeRange');
    const dr=g('mDurRow'),tr=g('mTimeRow');
    if(dr) dr.style.display = mode==='auto'?'':'none';
    if(tr) tr.style.display = mode==='timeRange'?'':'none';
  }

  [g('mModeAuto'),g('mModeTime')].forEach(btn=>{
    if(!btn) return;
    btn.addEventListener('click',()=> setFormMode(btn.dataset.mode));
  });
  setFormMode('auto'); // تطبيق الوضع الافتراضي

  // دالة مسح الفورم
  function clearMediaForm(){
    editingMediaId=null;
    if(g('mLabel'))  g('mLabel').value='';
    if(g('mUrl'))    g('mUrl').value='';
    if(g('mDurMin')) g('mDurMin').value='5';
    if(g('mDurSec')) g('mDurSec').value='0';
    if(g('mFrom'))   g('mFrom').value='';
    if(g('mTo'))     g('mTo').value='';
    setFormMode('auto');
    const addBtn=g('btnAddMedia'), cancelBtn=g('btnCancelEdit'), title=g('mediaFormTitle');
    if(addBtn)    addBtn.textContent='➕ إضافة';
    if(cancelBtn) cancelBtn.style.display='none';
    if(title)     title.textContent='➕ إضافة مقطع';
    buildMediaUI(); // إزالة تمييز التعديل
  }

  // دالة تعبئة الفورم للتعديل
  function startEditMedia(id){
    const item=mediaList.find(m=>m.id===id);
    if(!item) return;
    editingMediaId=id;
    if(g('mLabel'))  g('mLabel').value=item.label||'';
    if(g('mUrl'))    g('mUrl').value=item.url||'';
    const dm=Math.floor((item.durationSec||0)/60), ds=(item.durationSec||0)%60;
    if(g('mDurMin')) g('mDurMin').value=dm;
    if(g('mDurSec')) g('mDurSec').value=ds;
    if(g('mFrom'))   g('mFrom').value=item.from||'';
    if(g('mTo'))     g('mTo').value=item.to||'';
    setFormMode(item.mode==='timeRange'?'timeRange':'auto');
    const addBtn=g('btnAddMedia'), cancelBtn=g('btnCancelEdit'), title=g('mediaFormTitle');
    if(addBtn)    addBtn.textContent='💾 حفظ التعديل';
    if(cancelBtn) cancelBtn.style.display='';
    if(title)     title.textContent='✏️ تعديل المقطع';
    // مرر للفورم
    g('mediaFormSec')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    buildMediaUI(); // تلوين الصف المحرَّر
  }

  // زر إلغاء التعديل
  const cancelBtn=g('btnCancelEdit');
  if(cancelBtn) cancelBtn.addEventListener('click', clearMediaForm);

  // اختصارات سريعة
  document.querySelectorAll('[data-mlabel]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      clearMediaForm();
      if(g('mLabel')) g('mLabel').value=btn.dataset.mlabel;
      if(g('mUrl'))   g('mUrl').value=btn.dataset.murl;
    });
  });

  // إضافة / حفظ تعديل
  const addBtn=g('btnAddMedia');
  if(addBtn) addBtn.addEventListener('click',()=>{
    const url=(g('mUrl')?.value||'').trim();
    if(!url){ g('mUrl').style.borderColor='rgba(255,80,80,.6)'; setTimeout(()=>{g('mUrl').style.borderColor='';},1500); return; }
    const label=(g('mLabel')?.value||'').trim()||url.substring(0,40);
    const mins=parseInt(g('mDurMin')?.value)||0;
    const secs=parseInt(g('mDurSec')?.value)||0;
    const durationSec=mins*60+secs;
    const from=g('mFrom')?.value||'';
    const to=g('mTo')?.value||'';
    const mode=mediaFormMode==='timeRange'&&from&&to?'timeRange':'auto';

    if(editingMediaId!==null){
      // تعديل عنصر موجود
      const idx=mediaList.findIndex(m=>m.id===editingMediaId);
      if(idx>=0){
        mediaList[idx]={...mediaList[idx],label,url,mode,durationSec,from,to};
        if(mediaCurrentId===editingMediaId) mediaCurrentId=null; // أعد التشغيل بالإعدادات الجديدة
      }
    } else {
      // إضافة جديدة
      mediaList.push({id:nextMediaId(),label,url,mode,durationSec,from,to,enabled:true});
    }
    saveMedia();
    clearMediaForm();
    mediaSchedulerTick();
  });

  // مسح الكل
  const clearBtn=g('btnClearMedia');
  if(clearBtn) clearBtn.addEventListener('click',()=>{
    if(!mediaList.length) return;
    if(confirm('مسح كل القائمة؟')){ mediaList=[]; saveMedia(); buildMediaUI(); playMedia(null); }
  });

  buildMediaUI();
  mediaSchedulerTick();
  // ✅ setTimeout فقط — لا setInterval لأن playMedia يجدول بنفسه

  // تصدير startEditMedia للاستخدام في buildMediaUI
  window._startEditMedia=startEditMedia;
  window._editingMediaId=()=>editingMediaId;
}

/* ================================================================
   إخفاء الأزرار تلقائياً + دعم الماوس
   ================================================================ */
function initAutoHide(){
  let hideTimer=null;
  const panel=g('settingsPanel');

  function onMouseMove(){
    /* تفعيل وضع الماوس عند أول حركة */
    if(!mouseMode){
      mouseMode=true;
      document.body.classList.add('mouse-mode');
    }
    document.body.classList.remove('ui-hidden');
    ensureCursor(true);
    clearTimeout(hideTimer);
    /* إذا الإعدادات مفتوحة → لا تبدأ عداد الإخفاء */
    if(panel && panel.style.display !== 'none') return;
    hideTimer=setTimeout(()=>{
      document.body.classList.add('ui-hidden');
      ensureCursor(false);
    }, 15000); // 15 ثانية — وقت كافٍ للتلفزيون
  }

  // mousemove + mousedown + pointerdown + click كلها تُظهر الـ UI
  // مهم على Android TV: الكليك قد يأتي بدون mousemove سابق
  document.addEventListener('mousemove',  onMouseMove);
  document.addEventListener('mousedown',  onMouseMove);
  document.addEventListener('pointerdown',onMouseMove);
  document.addEventListener('click',      onMouseMove);

  /* استخدام أسهم الريموت → الخروج من وضع الماوس */
  document.addEventListener('keydown', e=>{
    const isArrow=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)||
                  [19,20,21,22,37,38,39,40].includes(e.keyCode);
    if(mouseMode && isArrow){
      mouseMode=false;
      document.body.classList.remove('mouse-mode');
      if(!panel || panel.style.display==='none') ensureCursor(false);
    }
  });

  document.addEventListener('touchstart', ()=>{
    document.body.classList.remove('ui-hidden');
  }, {passive:true});

  /* عند فتح الإعدادات: أوقف الإخفاء التلقائي وأظهر المؤشر دائماً */
  if(panel){
    new MutationObserver(()=>{
      if(panel.style.display !== 'none'){
        clearTimeout(hideTimer);
        document.body.classList.remove('ui-hidden');
        ensureCursor(true);
      }
    }).observe(panel, {attributes:true, attributeFilter:['style']});
  }

  /* إخفاء مبدئي بعد 5 ثوانٍ من التحميل */
  hideTimer=setTimeout(()=>{
    document.body.classList.add('ui-hidden');
    ensureCursor(false);
  }, 5000);
}

/* ---- درجة الحرارة ---- */
const WX_CODES={0:'صافٍ',1:'صافٍ',2:'غائم جزئياً',3:'غائم',45:'ضبابي',48:'ضبابي',51:'رذاذ خفيف',61:'مطر خفيف',63:'مطر',80:'زخات مطر',95:'عواصف رعدية'};
async function fetchTemp(){
  try{
    const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${C.latitude}&longitude=${C.longitude}&current_weather=true&timezone=Asia%2FRiyadh`,{signal:AbortSignal.timeout(5000)});
    const d=await r.json();
    if(d.current_weather){
      const temp=Math.round(d.current_weather.temperature);
      const desc=WX_CODES[d.current_weather.weathercode||0]||'';
      const txt='مكة المكرمة · '+temp+'°C · '+desc;
      const et=g('tickerTemp');if(et)et.textContent=txt;
      // درجة الحرارة في الهيدر
      const locTempEl=g('locTemp');
      if(locTempEl) locTempEl.textContent=temp+'°C · '+desc;
    }
  }catch(e){}
}

/* ---- لوحة الإعدادات ---- */
function initSettings(){
  const trigger=g('settingsTrigger'), panel=g('settingsPanel'), closeBtn=g('settingsClose');
  const saveBtn=g('btnSaveSettings'), resetBtn=g('btnResetSettings');

  let cc=0,ct=null;
  if(trigger) trigger.addEventListener('click',()=>{
    /* وضع الماوس: ضغطة واحدة تكفي */
    if(mouseMode){
      if(panel) panel.style.display='flex';
      ensureCursor(true);
      return;
    }
    /* ريموت التلفزيون: ضغطتان متتاليتان خلال 500ms */
    cc++;if(cc===1)ct=setTimeout(()=>{cc=0;},500);
    if(cc>=2){clearTimeout(ct);cc=0;if(panel)panel.style.display='flex';ensureCursor(true);}
  });
  if(closeBtn) closeBtn.addEventListener('click',()=>{if(panel)panel.style.display='none';if(!mouseMode)ensureCursor(false);});

  /* إغلاق اللوحة بالنقر على الخلفية الداكنة (وضع الماوس فقط) */
  if(panel) panel.addEventListener('click', e=>{
    if(mouseMode && e.target===panel){
      panel.style.display='none';
    }
  });

  if(saveBtn) saveBtn.addEventListener('click',()=>{
    readUI(); saveCfg(); applyDynamic();
    if(panel)panel.style.display='none'; ensureCursor(false);
    updatePrayerLocal(); tryAPI();
  });

  if(resetBtn) resetBtn.addEventListener('click',()=>{
    C=JSON.parse(JSON.stringify(DEF)); localStorage.removeItem('qp_v34_cfg');
    fillUI(); buildDhikrUI();
  });

  document.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      const tc=g('tab-'+tab.dataset.tab);if(tc)tc.classList.add('active');
    });
  });

  const testDk=g('btnTestDhikr');
  if(testDk) testDk.addEventListener('click',()=>{
    panel.style.display='none'; dkPrayer='fajr'; go(STATE.DHIKR,{prayer:'fajr'});
  });

  const lu=g('logoUpload');
  if(lu) lu.addEventListener('change',function(){
    const file=this.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=e=>{
      const data=e.target.result;
      applyLogoData(data);
      saveLogo(data); // محلي + سحابي
    };
    reader.readAsDataURL(file);
  });
  const rl=g('btnResetLogo');
  if(rl) rl.addEventListener('click',()=>{
    localStorage.removeItem('qp_v34_logo');
    applyLogoData('logo.png');
    saveLogo(null); // مسح من السحابة
  });

  // slider حجم الشعار — تحديث حي فوري
  const lsSlider=g('logoScale');
  if(lsSlider) lsSlider.addEventListener('input',()=>{
    const v=parseFloat(lsSlider.value)||0.85;
    document.documentElement.style.setProperty('--logo-scale', v);
    const sv=g('logoScaleVal');if(sv) sv.textContent=Math.round(v*100)+'%';
  });
  // slider حجم أسماء الصلوات — تحديث حي فوري
  const csSlider=g('cardNameSize');
  if(csSlider) csSlider.addEventListener('input',()=>{
    const v=parseFloat(csSlider.value)||4;
    document.documentElement.style.setProperty('--card-name-size', v+'vmin');
    const sv=g('cardNameSizeVal');if(sv) sv.textContent=v+'vmin';
  });

  buildDhikrUI(); fillUI();
}

function buildDhikrUI(){
  const c=g('dhikrSettingsList');if(!c)return;
  c.innerHTML='';
  DHIKR_LIST.forEach(d=>{
    const en=C.dhikrEnabled[d.id]!==false;
    const preview=(d.title||d.text).substring(0,55)+'...';
    const div=document.createElement('div');div.className='dk-item';
    div.innerHTML=`<label class="dk-lbl"><input type="checkbox" data-did="${d.id}" ${en?'checked':''}><span>${preview}</span>${d.prayers!=='all'?'<span class="dk-badge">فجر ومغرب</span>':''}</label>`;
    c.appendChild(div);
  });
}

function fillUI(){
  const set=(id,v)=>{const e=g(id);if(e)e.value=v;};
  const chk=(id,v)=>{const e=g(id);if(e)e.checked=v;};
  C.prayerOrder.forEach(p=>{
    ['iqamah','blackout','alert'].forEach(t=>{set(t+'-'+p,C[t+'Minutes'][p]);});
  });
  set('orgNameAr',C.orgNameAr); set('orgNameEn',C.orgNameEn);
  set('locationPreset',C.locationPreset);
  set('customLat',C.latitude); set('customLng',C.longitude);
  set('iqamahCountdownMinutes',C.iqamahCountdownMinutes);
  ['enablePreAlert','enableAdhanScreen','enableIqamahCountdown','enablePrayerSilent','enableDhikr'].forEach(s=>chk(s,C[s]));
  set('fontFamily',C.fontFamily); chk('nightMode',C.nightMode);
  set('dhikrDuration',C.dhikrDuration);
  chk('enableAnnouncement',C.enableAnnouncement);
  set('announcementContent',C.announcementText||'');
  chk('showYoutubePanel',C.showYoutubePanel!==false);
  // slider الشعار
  const ls=C.logoScale??0.85;
  const slEl=g('logoScale'); if(slEl) slEl.value=ls;
  const svEl=g('logoScaleVal'); if(svEl) svEl.textContent=Math.round(ls*100)+'%';
  // slider أسماء الصلوات
  const cs=C.cardNameSize??4;
  const csEl=g('cardNameSize'); if(csEl) csEl.value=cs;
  const csVEl=g('cardNameSizeVal'); if(csVEl) csVEl.textContent=cs+'vmin';
}

function readUI(){
  const gv=id=>{const e=g(id);return e?e.value:'';};
  const gc=id=>{const e=g(id);return e?e.checked:false;};
  C.prayerOrder.forEach(p=>{
    ['iqamah','blackout','alert'].forEach(t=>{
      const v=parseInt(gv(t+'-'+p));C[t+'Minutes'][p]=isNaN(v)?15:v;
    });
  });
  C.orgNameAr=gv('orgNameAr'); C.orgNameEn=gv('orgNameEn');
  C.locationPreset=gv('locationPreset');
  /* مكة ومنى وعرفة تستخدمان الإحداثيات الفعلية للموقع لضمان دقة المواقيت */
  const LOCS={makkah:{lat:21.4170,lng:39.8770},mina:{lat:21.4170,lng:39.8770},arafat:{lat:21.4170,lng:39.8770},jeddah:{lat:21.5433,lng:39.1728},riyadh:{lat:24.7136,lng:46.6753}};
  if(LOCS[C.locationPreset]){C.latitude=LOCS[C.locationPreset].lat;C.longitude=LOCS[C.locationPreset].lng;}
  else{C.latitude=parseFloat(gv('customLat'))||C.latitude;C.longitude=parseFloat(gv('customLng'))||C.longitude;}
  C.iqamahCountdownMinutes=parseInt(gv('iqamahCountdownMinutes'))||10;
  ['enablePreAlert','enableAdhanScreen','enableIqamahCountdown','enablePrayerSilent','enableDhikr'].forEach(s=>C[s]=gc(s));
  C.fontFamily=gv('fontFamily')||'Cairo'; C.nightMode=gc('nightMode');
  C.dhikrDuration=parseInt(gv('dhikrDuration'))||20;
  C.enableAnnouncement=gc('enableAnnouncement');
  C.announcementText=gv('announcementContent').trim();
  C.showYoutubePanel=gc('showYoutubePanel');
  C.logoScale=parseFloat(gv('logoScale'))||0.85;
  C.cardNameSize=parseFloat(gv('cardNameSize'))||4;
  document.querySelectorAll('[data-did]').forEach(cb=>{C.dhikrEnabled[parseInt(cb.dataset.did)]=cb.checked;});
}

function applyDynamic(){
  const setTxt=(id,v)=>{const e=g(id);if(e)e.textContent=v;};
  setTxt('companyNameAr',C.orgNameAr);
  // حجم الشعار
  document.documentElement.style.setProperty('--logo-scale', C.logoScale??0.85);
  // حجم أسماء الصلوات
  document.documentElement.style.setProperty('--card-name-size', (C.cardNameSize??4)+'vmin');
  // إخفاء / إظهار لوحة يوتيوب
  const twoCol=document.querySelector('.two-col');
  if(twoCol) twoCol.classList.toggle('no-media',!C.showYoutubePanel);
  const lNames={makkah:'مكة المكرمة',mina:'مكة المكرمة - منى',arafat:'مكة المكرمة - عرفة',jeddah:'جدة',riyadh:'الرياض',custom:'موقع مخصص'};
  const ln=g('locName');if(ln&&lNames[C.locationPreset])ln.textContent=lNames[C.locationPreset];
  document.body.style.fontFamily=C.fontFamily==='Amiri'?"'Amiri',serif":"'Cairo',sans-serif";
  document.body.classList.toggle('night-mode',C.nightMode);
  const ab=g('announcementBar'), at=g('announcementText');
  if(ab&&at){
    if(C.enableAnnouncement&&C.announcementText){ at.textContent=C.announcementText; ab.style.display='flex'; }
    else { ab.style.display='none'; }
  }
}

/* ---- Watchdog ---- */
function startWatchdog(){
  // يعيد التحميل فقط إذا توقفت الساعة 10 دقائق كاملة — منع الـ reload العشوائي
  setInterval(()=>{if(Date.now()-lastPing>600000){location.reload();}},60000);
}
// لا تعيد تحميل الصفحة على كل خطأ — فقط سجّل في الكنسول
window.onerror=(msg,src,line,col,err)=>{console.warn('[onerror]',msg,src,line);return true;};

/* ---- منتصف الليل (بتوقيت مكة) ---- */
function scheduleMidnight(){
  const now=nowSA();
  // ثواني حتى منتصف ليل مكة
  const secsPast=now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
  const msLeft=(86400-secsPast)*1000+5000;   // +5 ثوان هامش
  setTimeout(async()=>{updateDate();const ok=await tryAPI();if(!ok)updatePrayerLocal();fetchTemp();scheduleMidnight();},msLeft);
}

/* ---- فول سكرين ---- */
function requestFS(){
  const el=document.documentElement;
  try{
    if(el.requestFullscreen) el.requestFullscreen();
    else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if(el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if(el.msRequestFullscreen) el.msRequestFullscreen();
  }catch(e){}
}

/* ---- تهيئة ---- */
/* ---- شريط الفوتر: دوران لا نهائي بلا فراغ ---- */
function startFooterMarquee(){
  const ticker = g('footerTicker');
  const inner  = g('tkInner');
  if(!ticker || !inner || ticker.dataset.mqInit) return;
  ticker.dataset.mqInit = '1';

  /* حاوية واحدة تضم كل النسخ */
  const track = document.createElement('div');
  track.style.cssText = 'display:inline-flex;white-space:nowrap;direction:ltr;will-change:transform;transform:translateZ(0);';
  ticker.appendChild(track);
  track.appendChild(inner);

  function startAnim(attempt){
    const W  = inner.offsetWidth;
    const SW = ticker.offsetWidth || window.innerWidth;
    if(!W){ if(attempt < 8) setTimeout(()=>startAnim(attempt+1), 300); return; }

    /* عدد النسخ الكافي لملء الشاشة + نسختان إضافيتان بلا فراغ */
    const count = Math.ceil(SW / W) + 2;
    const clones = [];
    for(let i = 0; i < count; i++){
      const c = inner.cloneNode(true);
      c.setAttribute('aria-hidden','true');
      c.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      track.appendChild(c);
      clones.push(c);
    }

    /* مزامنة النسخ مع الأصل */
    const origSpans = inner.querySelectorAll('span');
    new MutationObserver(()=>{
      clones.forEach(cl=>{
        const cs = cl.querySelectorAll('span');
        origSpans.forEach((sp,i)=>{ if(cs[i]&&cs[i].textContent!==sp.textContent) cs[i].textContent=sp.textContent; });
      });
    }).observe(inner,{subtree:true,characterData:true,childList:true});

    /* ===== requestAnimationFrame بدلاً من @keyframes =====
       CSS animation تتوقف عند display:none للعنصر الأب (شاشات الأذكار/الأذان/...)
       rAF يعمل بشكل مستقل ويستمر بعد العودة للشاشة الرئيسية بلا تجميد */
    let pos = 0;
    const speed = 80; // بيكسل/ثانية
    let lastTs = null;

    (function frame(ts){
      if(lastTs !== null){
        /* نحدّ الفجوة الزمنية بـ 100ms — منع القفزات بعد العودة من شاشة أخرى */
        const delta = Math.min(ts - lastTs, 100);
        pos += speed * delta / 1000;
        if(pos >= W) pos -= W; // حلقة سلسة
        track.style.transform = 'translateX(-' + pos.toFixed(1) + 'px)';
      }
      lastTs = ts;
      requestAnimationFrame(frame);
    })(performance.now());
  }
  setTimeout(()=>startAnim(0), 250);
}

/* ================================================================
   دعم ريموت التلفزيون — نظام تنقل مكاني كامل
   ================================================================ */
function initTVRemote(){
  const TABS = ['iqamah','alerts','flow','dhikr','identity','location','display','announce','media'];
  let okCount = 0, okTimer = null;

  /* تطبيع مفاتيح Android WebView إلى أسماء قياسية */
  function normKey(e){
    if(e.key && e.key.length > 1) return e.key; // ArrowUp, Enter, Escape…
    const km = {
      19:'ArrowUp', 38:'ArrowUp',
      20:'ArrowDown', 40:'ArrowDown',
      21:'ArrowLeft', 37:'ArrowLeft',
      22:'ArrowRight', 39:'ArrowRight',
      13:'Enter', 23:'Enter', 66:'Enter',
      27:'Escape', 4:'Escape', 8:'Escape'
    };
    return km[e.keyCode] || e.key || '';
  }

  document.addEventListener('keydown', function(e){
    const panel = g('settingsPanel');
    const panelOpen = panel && panel.style.display !== 'none';
    const key = normKey(e);

    /* ===== خارج الإعدادات: ضغطتا OK تفتحان اللوحة ===== */
    if(!panelOpen){
      if(key === 'Enter'){
        okCount++;
        clearTimeout(okTimer);
        if(okCount >= 2){
          okCount = 0;
          panel.style.display = 'flex';
          ensureCursor(true);
          try{requestFS();}catch(ex){}
          setTimeout(()=>{ focusFirst(); }, 80);
        } else {
          okTimer = setTimeout(()=>{ okCount = 0; }, 600);
        }
        e.preventDefault();
      }
      return;
    }

    /* ===== داخل الإعدادات ===== */
    const cur = document.activeElement;
    const isRange  = cur && cur.type === 'range';
    const isNumber = cur && (cur.type === 'number' || cur.type === 'text' || cur.tagName === 'TEXTAREA');
    const isSelect = cur && cur.tagName === 'SELECT';

    switch(key){
      case 'ArrowUp':
        e.preventDefault();
        // ↑ يشمل التبويبات → يمكن الصعود من المحتوى إلى شريط التبويبات
        navigate('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        // ↓ من زر تبويب → أول عنصر في المحتوى النشط مباشرة (بدون تقييم مكاني)
        if(cur && cur.classList.contains('tab')){
          const activePane = document.querySelector('.tab-pane.active');
          if(activePane){
            const firstEl = [...activePane.querySelectorAll(
              'button, input, select, textarea'
            )].find(el => !el.disabled && el.getBoundingClientRect().width > 0);
            if(firstEl){ focusAndScroll(firstEl); break; }
          }
        }
        navigate('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if(isRange) { stepRange(cur, 1); break; }
        // على زر تبويب → غيّر التبويب
        if(cur && cur.classList.contains('tab')) { switchTab(1); break; }
        // داخل المحتوى → تنقل أفقي بين عناصر المحتوى فقط (بدون تبويبات)
        navigate('left', true);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if(isRange) { stepRange(cur, -1); break; }
        if(cur && cur.classList.contains('tab')) { switchTab(-1); break; }
        navigate('right', true);
        break;
      case 'Enter':
        e.preventDefault();
        activateElement(cur);
        break;
      case 'Escape':
        e.preventDefault();
        panel.style.display = 'none';
        ensureCursor(false);
        okCount = 0;
        break;
    }
  });

  /* ---- قائمة العناصر القابلة للتنقل في اللوحة الحالية ---- */
  /* excludeTabs=true  → يُخرج أزرار التبويبات من القائمة (للتنقل الأفقي داخل المحتوى) */
  /* visibleOnly=true  → يُخرج العناصر المخفية بالتمرير (للأفقي فقط، حتى لا يقفز للصف الخطأ) */
  /* visibleOnly=false → يقبل العناصر خارج الشاشة (للرأسي، فنصل إليها ثم نسكرول إليها)     */
  function getFocusables(excludeTabs, visibleOnly){
    const panel = g('settingsPanel');
    return [...panel.querySelectorAll(
      'button, input, select, textarea, .tab[data-tab]'
    )].filter(el => {
      if(el.disabled) return false;
      const r = el.getBoundingClientRect();
      // عنصر حجمه صفر = مخفي فعلاً (display:none أو visibility:hidden)
      if(r.width <= 0 || r.height <= 0) return false;
      // للتنقل الأفقي فقط: نشترط أن يكون العنصر ضمن نافذة العرض رأسياً
      // للتنقل الرأسي: نقبل العناصر المخفية بالتمرير ونمرر إليها
      if(visibleOnly && (r.bottom <= 0 || r.top >= window.innerHeight)) return false;
      if(excludeTabs && el.classList.contains('tab')) return false;
      return true;
    });
  }
  function isVisible(el){
    const r = el.getBoundingClientRect();
    if(r.width <= 0 || r.height <= 0) return false;
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  /* ---- تركيز أول عنصر عند فتح اللوحة ---- */
  function focusFirst(){
    const activeTab = document.querySelector('.tab.active');
    if(activeTab){ focusAndScroll(activeTab); return; }
    const first = getFocusables()[0];
    if(first) focusAndScroll(first);
  }

  /* ---- التنقل المكاني: أقرب عنصر في الاتجاه المطلوب ---- */
  function navigate(dir, excludeTabs){
    // الأفقي: يسار/يمين → نقبل فقط العناصر المرئية في الشاشة (visibleOnly=true)
    // الرأسي: أعلى/أسفل  → نقبل كل العناصر ثم نمرر إليها (visibleOnly=false)
    const visibleOnly = (dir === 'left' || dir === 'right');
    const list = getFocusables(excludeTabs, visibleOnly);
    if(!list.length) return;
    const cur = document.activeElement;
    if(!cur || !list.includes(cur)){ focusAndScroll(list[0]); return; }
    const r = cur.getBoundingClientRect();
    const curMidY = r.top + r.height / 2;
    const curMidX = r.left + r.width / 2;
    let best = null, bestScore = Infinity;
    for(const el of list){
      if(el === cur) continue;
      const er = el.getBoundingClientRect();
      const eMidY = er.top + er.height / 2;
      const eMidX = er.left + er.width / 2;
      const dy = eMidY - curMidY;
      const dx = eMidX - curMidX;
      // تصفية العناصر في الاتجاه الخاطئ
      if(dir === 'down'  && dy <=  2) continue;
      if(dir === 'up'    && dy >= -2) continue;
      if(dir === 'left'  && dx >=  2) continue; // أقل x = يسار الشاشة
      if(dir === 'right' && dx <= -2) continue; // أكبر x = يمين الشاشة
      // الاتجاه الرئيسي أهم — للتنقل الأفقي نزيد وزن الانحراف الرأسي بشدة
      // حتى لا يقفز من صف "حفظ/استعادة" إلى حقول في الأعلى
      const main = (dir==='up'||dir==='down') ? Math.abs(dy) : Math.abs(dx);
      const side = (dir==='up'||dir==='down') ? Math.abs(dx) : Math.abs(dy);
      const sideFactor = (dir==='left'||dir==='right') ? 3.0 : 0.35;
      const score = main + side * sideFactor;
      if(score < bestScore){ bestScore = score; best = el; }
    }
    if(best) focusAndScroll(best);
  }

  function focusAndScroll(el){
    if(!el) return;
    el.focus({preventScroll: true});
    el.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  }

  /* ---- تفعيل العنصر حسب نوعه ---- */
  function activateElement(el){
    if(!el) return;
    if(el.type === 'checkbox' || el.type === 'radio'){
      el.checked = !el.checked;
      el.dispatchEvent(new Event('change', {bubbles: true}));
    } else if(el.tagName === 'SELECT'){
      cycleSelect(el, 1);
    } else if(el.tagName === 'BUTTON' || el.classList.contains('tab')){
      el.click();
    } else if(el.type === 'range'){
      /* الأسهم يسار/يمين تعمل عليه مباشرة */
    } else {
      el.focus();
    }
  }

  /* ---- دورة خيارات SELECT ---- */
  function cycleSelect(sel, dir){
    if(!sel || !sel.options.length) return;
    sel.selectedIndex = (sel.selectedIndex + dir + sel.options.length) % sel.options.length;
    sel.dispatchEvent(new Event('change', {bubbles: true}));
  }

  /* ---- تحريك RANGE بالأسهم ---- */
  function stepRange(input, dir){
    const step = parseFloat(input.step) || 1;
    const min  = parseFloat(input.min)  || 0;
    const max  = parseFloat(input.max)  || 100;
    const val  = Math.min(max, Math.max(min, (parseFloat(input.value)||0) + dir * step));
    input.value = val;
    input.dispatchEvent(new Event('input',  {bubbles: true}));
    input.dispatchEvent(new Event('change', {bubbles: true}));
  }

  /* ---- تبديل التبويبات ---- */
  function switchTab(dir){
    const active = document.querySelector('.tab.active');
    if(!active) return;
    const idx = TABS.indexOf(active.dataset.tab);
    if(idx === -1) return;
    const next = (idx + dir + TABS.length) % TABS.length;
    const nextTab = document.querySelector(`.tab[data-tab="${TABS[next]}"]`);
    if(nextTab){ nextTab.click(); setTimeout(()=>focusFirst(), 60); }
  }
}

async function init(){
  /* ① localStorage أولاً — خط دفاع دائم بغض النظر عن السحابة */
  try{ loadCfg(); }catch(e){ console.warn('loadCfg err',e); }
  try{
    const sl=localStorage.getItem('qp_v34_logo');
    if(sl) applyLogoData(sl);
  }catch(e){}

  /* ② تهيئة Supabase — تتغلب على المحلي إذا كان فيها بيانات */
  initSupabase();
  await loadAllFromCloud();

  try{ initSettings(); }catch(e){ console.warn('initSettings err',e); }
  try{ initDhikrSkip(); }catch(e){ console.warn('initDhikrSkip err',e); }
  try{ applyDynamic(); }catch(e){ console.warn('applyDynamic err',e); }
  try{ updateDate(); }catch(e){ console.warn('updateDate err',e); }

  // عرض الصفحة فوراً من الـ cache أو الحساب المحلي — لا انتظار
  try{
    const hasCached = loadCache();
    if(!hasCached) updatePrayerLocal();
  }catch(e){ console.warn('cache/prayer err',e); }

  // ← يظهر فوراً — نضمن ظهور الصفحة حتى لو curState=MAIN مسبقاً
  curState = null;   // نكسر الـ early-return في go()
  go(STATE.MAIN);

  try{ updateClock(); }catch(e){ console.warn('updateClock err',e); }
  setInterval(()=>{ try{updateClock();}catch(e){} },1000);
  setInterval(()=>{ try{updateDate();}catch(e){} },60000);
  try{ scheduleMidnight(); }catch(e){}
  startWatchdog();

  try{ initMedia(); }catch(e){ console.warn('initMedia err',e); }
  window.addEventListener('resize', sizeVideo);
  try{ initAutoHide(); }catch(e){}
  try{ startMainTicker(); }catch(e){}
  try{ startFooterMarquee(); }catch(e){}

  // API في الخلفية — يحدّث الأوقات بهدوء بعد التحميل
  fetchTemp();
  setTimeout(async()=>{
    try{ const ok=await tryAPI(); if(!ok) updatePrayerLocal(); }catch(e){}
  }, 500);
  setInterval(async()=>{ try{const ok=await tryAPI();if(!ok)updatePrayerLocal();}catch(e){}},43200000);
  setInterval(()=>{ fetchTemp(); },1800000);

  try{requestFS();}catch(e){}
  document.addEventListener('click',function fsClick(){try{requestFS();}catch(e){}document.removeEventListener('click',fsClick);},{once:true});

  // ===== دعم ريموت التلفزيون =====
  initTVRemote();

  // ===== تزامن فوري مع السحابة =====
  try{ initRealtime(); }catch(e){}

  console.log('✅ نظام مواقيت الصلاة - شركة قريش المحدودة v4.0');
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();

})();
