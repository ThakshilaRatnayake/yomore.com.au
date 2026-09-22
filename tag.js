// Google tag for yomore.com.au: GA4 page views plus the two interactions that
// matter for a shop - phone taps and "get directions" taps - on every page.
//
// Google Ads conversions are NOT wired through this file. The Ads account
// (242-752-0168) imports the call_click and get_directions events straight from
// the GA4 property as the conversion actions "Yo More - Phone call from website"
// and "Yo More - Get directions". Sending them again through an AW- tag would
// double count, so the YM_ADS_* fields below stay empty on purpose. They exist
// only if you ever switch to native Ads conversion tags instead of the import.
var YM_GA4_ID  = 'G-54SP0DMEL3';      // GA4 > Admin > Data streams > Measurement ID
var YM_ADS_ID  = 'AW-XXXXXXXXXX';     // unused - see note above
var YM_ADS_LABELS = {                 // unused - see note above
  call: 'XXXXXXXXXXXXXXXXXXX',
  directions: 'XXXXXXXXXXXXXXXXXXX'
};

(function(){
  var live=function(v){return v&&!/XXXX/.test(v)};
  var ga4=live(YM_GA4_ID)?YM_GA4_ID:null, ads=live(YM_ADS_ID)?YM_ADS_ID:null;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  if(ga4||ads){
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+(ga4||ads);
    document.head.appendChild(s);
    gtag('js',new Date());
    if(ga4)gtag('config',ga4);
    if(ads)gtag('config',ads,{allow_enhanced_conversions:true});
  }

  // Which shop a link belongs to, from its href or the nearest heading.
  function shopOf(a){
    var h=(a.getAttribute('href')||'').toLowerCase();
    if(/brunswick|sydney\+rd|0391243885/.test(h))return 'brunswick';
    if(/geelong|ryrie|0391254202/.test(h))return 'geelong';
    var card=a.closest('[data-shop]');return card?card.getAttribute('data-shop'):'';
  }
  function fire(name,shop,label){
    var p={shop:shop,page_path:location.pathname};
    gtag('event',name,p); // GA4: mark call_click and get_directions as key events in GA4 admin
    if(ads&&live(YM_ADS_LABELS[label]))gtag('event','conversion',{send_to:ads+'/'+YM_ADS_LABELS[label],shop:shop});
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    var h=a.getAttribute('href')||'';
    if(/^tel:/i.test(h))fire('call_click',shopOf(a),'call');
    else if(/maps\.google\.|google\.com\/maps|maps\.app\.goo\.gl/i.test(h))fire('get_directions',shopOf(a),'directions');
    else if(/instagram\.com|tiktok\.com|facebook\.com/i.test(h))gtag('event','social_click',{network:h.match(/instagram|tiktok|facebook/i)[0].toLowerCase()});
    else if(/^mailto:/i.test(h))gtag('event','email_click',{page_path:location.pathname});
  },true);
})();
