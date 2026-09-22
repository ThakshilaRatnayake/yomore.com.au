// Google tag: GA4 + Google Ads, plus the conversions that matter for a shop
// (phone taps and "get directions" taps). Loaded in <head> on every page.
//
// Fill these in once the accounts exist. The tag stays dormant while any ID
// is still a placeholder, so this file is safe to ship as-is.
var YM_GA4_ID  = 'G-54SP0DMEL3';      // GA4 > Admin > Data streams > Measurement ID
var YM_ADS_ID  = 'AW-XXXXXXXXXX';     // Google Ads > Tools > Conversions > Google tag ID
var YM_ADS_LABELS = {                 // Google Ads conversion labels (one per action)
  call: 'XXXXXXXXXXXXXXXXXXX',        // "Phone call from website"
  directions: 'XXXXXXXXXXXXXXXXXXX'   // "Get directions"
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
