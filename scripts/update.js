//(c)2017, MIT Style License <browser-update.org/LICENSE.txt>
//it is recommended to directly link to this file because we update the detection code
"use strict";

var $bu_= new function() {
    var s=this;
    this.vsakt = {c:78,f:70,s:"12.1.2",e:18,i:12,ios:"13.2",samsung:10.1,o:64,o_a:54.1,y:"19.10",v:2.8,uc:"12.13"};
    //severly insecure below(!) this version, insecure means remote code execution that is actively being exploited
    this.vsinsecure_below = {c:74,f:62,s:"11.1.1",e:16,i:11,ios:"12.4.3",samsung:"8.0",o:55,o_a:50,y:"19.6",v:"2.5",uc:"12.10"};
    this.vsdefault = {c:-3,f:-3,s:-1,e:-3,i:11,ios:10,samsung:7.9,o:-3,o_a:-3,y:19.5,v:2.3,uc:12.8,a:535};
    this.names={c:"Chrome",f:'Firefox',s:'Safari',e:"Edge",i:'Internet Explorer',ios:"iOS",samsung:"Samsung Internet",o:'Opera',o_a:'Opera', y:"Yandex Browser",v:"Vivaldi",uc:"UC Browser",a:"Android Browser",x:"Other",silk:"Silk"};

    this.get_browser = function(ua) {
    var n,ua=(ua||navigator.userAgent).replace("_","."),r={n:"x",v:0,t:"other browser",age_years:undefined,no_device_update:false,available:s.vsakt};
    function ignore(reason,pattern){if (new RegExp(pattern,"i").test(ua)) return reason;return false}
    r.other=ignore("bot","Chrome-Lighthouse|bot|spider|archiver|transcoder|crawl|checker|monitoring|prerender|screenshot|python-|php|uptime|validator|fetcher|facebook|slurp|google|yahoo|node|mail.ru|github|cloudflare|addthis|thumb|proxy|feed|fetch|favicon|link|http|scrape|seo|page|search console|AOLBuild|Teoma|Expeditor")||
//        ignore("discontinued browser","camino|flot|fennec|galeon|coolnovo") ||
        ignore("TV","SMART-TV|SmartTV") ||
        ignore("niche browser","Falkon|Brave|Classic Browser|Dorado|LBBROWSER|Focus|waterfox|Firefox/56.2|Firefox/56.3|Whale|MIDP|k-meleon|sparrow|wii|Chromium|Puffin|Opera Mini|maxthon|maxton|dolfin|dolphin|seamonkey|opera mini|netfront|moblin|maemo|arora|kazehakase|epiphany|konqueror|rekonq|symbian|webos|PaleMoon|QupZilla|Otter|Midori|qutebrowser") ||
        ignore("mobile without upgrade path or landing page","cros|kindle|tizen|silk|blackberry|bb10|RIM|PlayBook|meego|nokia|ucweb|ZuneWP7|537.85.10");
//        ignore("android(chrome) web view","; wv");
    r.mobile=(/iphone|ipod|ipad|android|mobile|phone|ios|iemobile/i.test(ua));

    var pats=[
        ["CriOS.VV","c",'ios'],
        ["FxiOS.VV","f",'ios'],
        ["Trident.*rv:VV","i",'i'],
        ["Trident.VV","io",'i'],
        ["UCBrowser.VV","uc",'c'],
        ["MSIE.VV","i",'i'],
        ["Edge.VV","e",'e'],
        ["Vivaldi.VV","v",'c'],
        ["Android.*OPR.VV","o_a",'c'],
        ["OPR.VV","o",'c'],
        ["YaBrowser.VV","y",'c'],
        ["SamsungBrowser.VV","samsung",'c'],
        ["Silk.VV","silk",'c'],
        ["Chrome.VV","c",'c'],
        ["Firefox.VV","f",'f'],
        [" OS.VV.*Safari","ios",'ios'],
        ["Version.VV.*Safari","s",'s'],
        ["Safari.VV","so",'s'],
        ["Opera.*Version.VV","o"],
        ["Opera.VV","o"]
    ];
    var VV="(\\d+\\.?\\d+\\.?\\d*\\.?\\d*)";
    for (var i=0; i < pats.length; i++) {
        if (ua.match(new RegExp(pats[i][0].replace("VV",VV),"i"))) {
            r.n=pats[i][1];
            r.engine=pats[i][2];
            break;
        }        
    }
    r.fullv=RegExp.$1;
    r.v=parseFloat(r.fullv);

    // Special treatment of some systems
    //do not notify old systems since there is no up-to-date browser available
    if (/windows.nt.5.0|windows.nt.4.0|windows.95|windows.98|os x 10.2|os x 10.3|os x 10.4|os x 10.5/i.test(ua)) {
        r.no_device_update=true;
        r.available={}
    }
    //iOS
    if (/iphone|ipod|ipad|ios/i.test(ua)) {
        ua.match(new RegExp("OS."+VV,"i"));//
        r.n="ios";
        r.fullv=RegExp.$1;
        r.v=parseFloat(r.fullv);
        r.engine='ios';
        var av=s.available_ios(ua,v);
        /*
        var newmap={10:"10.3.4",11:"12.4.3",12:"12.4.3",13:s.vsakt["ios"]};

        if (av in newmap)
            av=newmap[av];
        */
        r.available = {"ios": av};
        if (parseFloat(r.available.ios)<11)
            r.no_device_update=true;
    }
    //winxp/vista/2003
    if (/windows.nt.5.1|windows.nt.5.2|windows.nt.6.0/i.test(ua)) {
        r.available={"c":49.9,"f":52.9}
    }
    //old mac
    if (/os x 10.6/i.test(ua)) {
        r.available = {"s": "5.1.10", "c": 49.9, "f": 48}
        r.no_device_update=true;
    }

    if (/os x 10.7|os x 10.8/i.test(ua)) {
        r.available = {"s": "6.2.8", "c": 49.9, "f": 48}
        r.no_device_update=true;
    }
    if (/os x 10.9/i.test(ua))
        r.available.s="9.1.3"

    if (/os x 10.10/i.test(ua))
        r.available.s="10.1.2"

    //check for android stock browser
    if (ua.indexOf('Android')>-1 && r.n==="s") {
        var v=parseInt((/WebKit\/([0-9]+)/i.exec(ua) || 0)[1],10) || 2000;
        if (v <= 534) {
            r.n="a";
            r.fullv=r.v=v;
            r.is_insecure=true;
        }
    }

    // Special treatment of some browsers
    if (r.n==="so") {
        r.v=r.fullv=4.0;
        r.n="s";
    }
    if (r.n==="io") {
        r.n="i";
        if (r.v>6) r.v=11;
        else if (r.v>5) r.v=10;
        else if (r.v>4) r.v=9;
        else if (r.v>3.1) r.v=8;
        else if (r.v>3) r.v=7;
        else r.v=9;
        r.fullv=r.v;
    }
    r.t=s.names[r.n]+" "+r.v;
    r.is_supported=r.is_latest= !s.vsakt[r.n] ? undefined : s.less(r.fullv,s.vsakt[r.n])<=0;
    
    r.vmaj=Math.round(r.v);

    r.is_insecure= r.is_insecure|| !s.vsinsecure_below[r.n] ? undefined :  s.less(r.fullv,s.vsinsecure_below[r.n])===1;
    
    if ((r.n==="f" && (r.vmaj===68 || r.vmaj===60)) || (r.n==="i" && r.vmaj===11)) {
        r.is_supported=true;
        r.is_insecure=false;
        if (r.n==="f")
            r.esr=true;
    }
    if ((r.n==="c"||r.n==="f"||r.n==="o") && s.less(r.fullv,parseFloat(s.vsakt[r.n])-1)<=0)
        r.is_supported=true; //mark also the version before the current version as supported to make the transitions smoother
    if (r.n==="ios" && r.v>10.3)
        r.is_supported=true;
    if (r.n==="a" || r.n==="x")
        r.t=s.names[r.n];
    if (r.n==="e") {
        r.t = s.names[r.n] + " " + r.vmaj;
        r.is_supported = s.less(r.fullv, "15.15063") != 1
    }
    var releases_per_year={'f':7,'c':8,'o':8,'i':1,'e':1,'s':1}//,'v':1}
    if (releases_per_year[r.n]) {
        r.age_years=Math.round(((s.vsakt[r.n]-r.v)/releases_per_year[r.n])*10)/10 || 0
    }
    var engines={e:"Edge.VV",c:"Chrome.VV",f:"Firefox.VV",s:"Version.VV",i:"MSIE.VV","ios":" OS.VV"}
    if (r.engine) {
        ua.match(new RegExp(engines[r.engine].replace("VV",VV),"i"))
        r.engine_version=parseFloat(RegExp.$1)
    }    
    return r;
}
this.semver = function(vstr) {
    if (vstr instanceof Array)
        return vstr
    var x = (vstr+(".0.0.0")).split('.')
    return [parseInt(x[0]) || 0, parseInt(x[1]) || 0, parseInt(x[2]) || 0, parseInt(x[3]) || 0]
}
this.less= function(v1,v2) {
    //semantic version comparison: returns 1 if v1<v2 , 0 if equal, -1 if v1>v2
    v1=s.semver(v1)
    v2=s.semver(v2)
    for (var i=0; ;i++) {
        if (i>=v1.length) return i>=v2.length ? 0 : 1;
        if (i>=v2.length) return -1;
        var diff = v2[i]-v1[i]
        if (diff) return diff>0 ? 1 : -1;
    }
}
this.available_ios=function(ua,v) {
    var h = Math.max(window.screen.height, window.screen.width),pr = window.devicePixelRatio
    if (/ipad/i.test(ua)) {
        if (h == 1024 && pr == 2) // iPad 3 (iOS 9), 4, 5, Mini 2, Mini 3, Mini 4, Air, Air 2, Pro 9.7
            return 10//? only ipad 4 has ios 10, all other can have ios 11
        if (h == 1112)// iPad Pro 10.5
            return 15;
        if (h == 1366)//iPad Pro 12.9, Pro 12.9 (2nd Gen)
            return 15
        if (h == 1024 && v < 6)
            return 5 // iPad
        return 9 // iPad 2, iPad Mini
    }
    if (pr == 1)// 1/3G/3GS
        return 6//for 3GS
    if (h == 812)// && pr == 3)// X
        return 11 + 4
    if ((h == 736 || h == 667))// && pr == 3)// 6+/6s+/7+ and 8+ or // 6+/6s+/7+ and 8+ in zoom mode + // 6/6s/7 and 8
        return 8 + 5
    if (h == 568) // 5/5C/5s/SE or 6/6s/7 and 8 in zoom mode
        return 10
    if (h == 480) // i4/4s
        return 7
    return 6
}
/*
this.sub= function(v,minus) {
    //semantic version subtraction
    v=s.semver(v)
    minus=s.semver(minus)
    for (var i=0; ;i++) {
        if (i>=v.length||i>minus.length) break;
        v[i]-=v[minus];
    }
    return v.join('.')
}
*/
}

window.$bu_getBrowser=$bu_.get_browser;

var $buo = function(op,test) {
var n = window.navigator,b;
op=window._buorgres=op||{};
var ll = op.l||(n.languages ? n.languages[0] : null) || n.language || n.browserLanguage || n.userLanguage||document.documentElement.getAttribute("lang")||"en";
op.llfull=ll.replace("_","-").toLowerCase().substr(0,5);
op.ll=op.llfull.substr(0,2);
op.domain=op.domain!==undefined?op.domain:(/file:/.test(location.href)?"https:":"")+"//browser-update.org";
op.apiver=op.api||op.c||-1;
op.jsv="3.3.3";

var required_min=(op.apiver<2018&&{i:10,f:11,o:21,s:8,c:30})||{};

var vs=op.notify||op.vs||{};//old style config: maximum version to notify
vs.e=vs.e||vs.i;
vs.i=vs.i||vs.e;
var required=op.required||{};//minimum browser versions needed
required.e=required.e||required.i;
if (!required.i) {
    required.i=required.e;
    $bu_.vsakt.i=$bu_.vsakt.e;
}

for (b in $bu_.vsdefault) {
    if (vs[b]) {//old style: browsers to notify
        if ($bu_.less(vs[b],0)>=0) // required <= 0
            required[b]= parseFloat($bu_.vsakt[b])+parseFloat(vs[b])+0.01
        else
            required[b] = parseFloat(vs[b]) + 0.01
    }
    if (!(b in required) || required[b]==null)
        required[b]=$bu_.vsdefault[b]
    if ($bu_.less(required[b],0)>=0) // required <= 0 --> relative to current version
        required[b]=parseFloat($bu_.vsakt[b])+parseFloat(required[b]) // TODO: make it work for string version
    if (required_min[b] && $bu_.less(required[b],required_min[b])===1) // required < required_min
        required[b]=required_min[b]
}
required.ios=required.ios||required.s;

op.required=required;
op.reminder=op.reminder<0.1 ? 0 : op.reminder||(24*7);
op.reminderClosed=op.reminderClosed<1 ? 0 : op.reminderClosed||(24*7);
op.onshow = op.onshow||function(o){};
op.onclick = op.onclick||function(o){};
op.onclose = op.onclose||function(o){};
op.pageurl = op.pageurl || location.hostname || "x";
op.newwindow=(op.newwindow!==false);

op.test=test||op.test||(location.hash==="#test-bu")||false;

if (Math.random()*1200<1 && !op.test) {
    var i = new Image();    i.src="//browser-update.org/cnt?what=brow&jsv="+op.jsv;
}

op.test=test||op.test||location.hash==="#test-bu";

op.reasons=[];
op.hide_reasons=[];
function check_show(op) {
    var bb=$bu_.get_browser(op.override_ua);
    op.is_below_required = required[bb.n] && $bu_.less(bb.fullv,required[bb.n])===1; //bb.fullv<required
    if (bb.other!==false)
        op.hide_reasons.push("is other browser:" + bb.other)
    if ( bb.esr && !op.notify_esr)// || (bb.is_supported && !op.notify_also_supported))
        op.hide_reasons.push("Extended support (ESR)")
    if (bb.mobile&&op.mobile===false)
        op.hide_reasons.push("do not notify mobile")
    if (bb.no_device_update)
        op.hide_reasons.push("no device update")
    if (op.is_below_required)
        op.reasons.push("below required")
    if ((op.insecure||op.unsecure) && bb.is_insecure)
        op.reasons.push("insecure")
    if (op.unsupported && !bb.is_supported)
        op.reasons.push("no vendor support")
    if (op.hide_reasons.length>0)
        return false
    if (op.reasons.length>0)
        return true
    return false
 }

op.notified=check_show(op);
op.already_shown=document.cookie.indexOf("browserupdateorg=pause")>-1;

if (!op.test && (!op.notified || op.already_shown))
    return;

op.setCookie=function(hours) {
    document.cookie = 'browserupdateorg=pause; expires='+(new Date(new Date().getTime()+3600000*hours)).toGMTString()+'; path=/; SameSite=None; Secure';
};
if (op.reminder>0)
    op.setCookie(op.reminder);

if (op.nomessage) {
    op.onshow(op);
    return;
}

var e=document.createElement("script");
e.src = op.jsshowurl||op.domain+"/update.show.min.js";
document.body.appendChild(e);
};

$buo(window.$buoop);


