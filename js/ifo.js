/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
function hex_hmac_md5(k, d)
  { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_md5(k, d)
  { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_md5(k, d, e)
  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of a raw string
 */
function rstr_md5(s)
{
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstr_hmac_md5(key, data)
{
  var bkey = rstr2binl(key);
  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var i, j, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)));
  var remainders = Array(full_length);
  for(j = 0; j < full_length; j++)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  return output;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binl_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            var APp_ID = "D8FFxajzSQr4hQO5NNjO0d";
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
function setCookie(c_name, value) {
    var expiredays = 365;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "": ";expires=" + exdate.toGMTString())
}
table={
'q':32,'y':15,'p':45,'f':94,'k':76,
'w':43,'u':64,'a':85,'g':32,'l':36,
'e':74,'i':83,'s':17,'h':73,'z':94,
'r':37,'o':26,'d':84,'j':79,'x':63,
'c':86,'v':84,'b':26,'n':24,'m':42,
'0':67,'3':24,'4':86,'7':75,'8':73,
'1':16,'2':87,'5':24,'6':23,'9':92,
't':57
}

list=[
    {
        "title":"MIT’s “disqualified” donors aren’t necessarily banned from donating, says Media Lab whistleblower",
        "image":"https://www.technologyreview.com/_/img/stacked-logo-v2--125x62.png",
        "pubDate":"Thu, 12 Sep 2019 13:27:49 GMT",
        "description":"Signe Swenson, who leaked details about the lab’s relationship with Jeffrey Epstein, explains how its funding works.",
        "link":"https://www.technologyreview.com/s/614299/mit-media-lab-jeffrey-epstein-joichi-ito-signe-swenson-disqualified-fundraising/",
        "author":"MIT科技速览"
    },
    {
        "title":"A space elevator is possible with today’s technology, researchers say (we just need to dangle it off the moon)",
        "image":"https://www.technologyreview.com/_/img/stacked-logo-v2--125x62.png",
        "pubDate":"Thu, 12 Sep 2019 09:14:08 GMT",
        "description":"Space elevators would dramatically reduce the cost of reaching space but have never been technologically feasible. Until now.",
        "link":"https://www.technologyreview.com/s/614276/a-space-elevator-is-possible-with-todays-technology-researchers-say-we-just-need-to-dangle/",
        "author":""
    },
    {
        "title":"[CDATA[ 这是一颗来自贵阳的痘痘🤪 ]]>",
        "image":"",
        "pubDate":"Fri, 06 Sep 2019 14:10:46 GMT",
        "description":'[CDATA[这是一颗来自贵阳的痘痘🤪 <br><br><a href="https://wx3.sinaimg.cn/large/6b9a6a03gy1g6q0t4c8u8g20k00qo7wr.gif" target="_blank">></a>]]>',
        "link":"https://weibo.com/1805281795/I5J2djZJa",
        "author":"丁玉琼"
    },
    {
        "title":"[CDATA[ VLOG | 《厨房与爱》034高中的时候和好朋友 ]]>",
        "image":"",
        "pubDate":"Sat, 31 Aug 2019 02:58:41 GMT",
        "description":'[CDATA[VLOG | 《厨房与爱》034<br />高中的时候和好朋友总想以后能一起合租<br />但现实把我们分开，逼着我们长大<br />现在好友能很自然的蹭住就很开心了<br /><br />和来自天南海北的朋友回忆着中学生活～<br />真的很好笑<span class="url-icon"><img alt=[跪了] src="//h5.sinaimg.cn/m/emoticon/icon/default/d_guile-7b3e474f7f.png" style="width:1em; height:1em;" /></span>我们都长大啦[加油]<br /><br /><a href="https://m.weibo.cn/p/index?extparam=%E8%80%81%E5%BC%A0%E4%B8%8E%E5%8F%AE%E5%8F%AE&containerid=1008086c6bd1c23624c768db7f652aeb494ccb&luicode=20000174" data-hide=""><span class="surl-text">老张与叮叮</span></a><a href="https://m.weibo.cn/search?containerid=231522type%3D1%26t%3D10%26q%3D%23VLOG%23&luicode=20000174" data-hide=""><span class="surl-text">#VLOG#</span></a> <a data-url="http://t.cn/AiRPYeVS" href="https://video.weibo.com/show?fid=1034:4411301603021347" data-hide=""><span class="surl-text">丁钰琼的微博视频</span></a> <a data-url="http://t.cn/AiEUl7Nn" href="https://lottery.media.weibo.com/lottery/h5/history/list?mid=4411304112734770" data-hide=""><span class="surl-text">抽奖详情</span></a>]]',
        "link":"https://weibo.com/1805281795/I4K4rbtrc",
        "author":"丁玉琼"
    },
        {
        "title":"[CDATA[ 今天一群小伙伴来给皇受他们过生日（是的…今天公司有 ]]",
        "image":"https://tvax2.sinaimg.cn/crop.0.0.996.996.180/57aac58fly8g5o2r1i3b9j20ro0rodha.jpg?KID=imgbed,tva&Expires=1568367852&ssig=Z6j5tYwDLT",
        "pubDate":"Thu, 12 Sep 2019 14:20:06 GMT",
        "description":'[CDATA[今天一群小伙伴来给皇受他们过生日（是的…今天公司有三个小伙伴同天生日）…来吃烤肉…… <a data-url="http://t.cn/AiEp6dE0" href="https://m.weibo.cn/c/story/player?oid=1042151:4415816557654524&luicode=10000011&lfid=1076031470809487" data-hide=""><span class="surl-text">微博视频</span></a> <br><br><a href="https://wx4.sinaimg.cn/large/57aac58fly1g6x2r8zwzyj25mo4807wn.jpg" target="_blank"><img src="https://wx4.sinaimg.cn/large/57aac58fly1g6x2r8zwzyj25mo4807wn.jpg"></a><br><br><a href="https://wx2.sinaimg.cn/large/57aac58fly1g6x2rehfevj24805mo7wn.jpg" target="_blank"><img src="https://wx2.sinaimg.cn/large/57aac58fly1g6x2rehfevj24805mo7wn.jpg"></a>]]>',
        "link":"https://weibo.com/1470809487/I6DsE3HPa",
        "author":"山新"
    },
        {
        "title":"",
        "image":"https://tvax2.sinaimg.cn/crop.0.0.996.996.180/57aac58fly8g5o2r1i3b9j20ro0rodha.jpg?KID=imgbed,tva&Expires=1568367852&ssig=Z6j5tYwDLT",
        "pubDate":"Thu, 12 Sep 2019 10:20:06 GMT",
        "description":'我又双叒叕给罗小黑配音啦！不过这次是在<a href="/n/比心APP">@比心APP</a> 上作为配音体验官和特邀评委参与<a href="/n/电影罗小黑战记">@电影罗小黑战记</a> 声优配音赛的呦~（其实是为了让你们多听听我的声音~）偷偷告诉你们比心APP为<a href="https://m.weibo.cn/search?containerid=231522type%3D1%26t%3D10%26q%3D%23%E7%94%B5%E5%BD%B1%E7%BD%97%E5%B0%8F%E9%BB%91%E6%88%98%E8%AE%B0%23&extparam=%23%E7%94%B5%E5%BD%B1%E7%BD%97%E5%B0%8F%E9%BB%91%E6%88%98%E8%AE%B0%23&luicode=10000011&lfid=1076031470809487" data-hide=""><span class="surl-text">#电影罗小黑战记#</span></a> 配音赛准备了20000元现金大奖，还不快冲！！！ <br><br><a href="https://wx4.sinaimg.cn/large/57aac58fly1g6wuxep4ihj20h81s6dns.jpg" target="_blank"><img src="https://wx4.sinaimg.cn/large/57aac58fly1g6wuxep4ihj20h81s6dns.jpg"></a>',
        "link":"https://weibo.com/1470809487/I6BInAEoZ",
        "author":"山新"
    },
        {
        "title":"Pixel Launcher 的完美形态，Android 启动器最佳之选：Lawnchair 2.0",
        "image":"",
        "pubDate":"Fri, 13 Sep 2019 14:41:51 +0800",
        "description":'<p>经过漫长的 Alpha 测试，以原生风格和 Pixel 特性见长的 Lawnchair 终于在 Google Play 应用商店上架 2.0 版本并开启公开测试。</p><figure tabindex="0" draggable="false" class="ss-img-wrapper" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/0bda23b49253314f3afe5b5ec0afc663.png" alt=""><figcaption class="ss-image-caption">Lawnchair 1.0 vs Lawnchair 2.0 beta</figcaption></figure><p>和我们此前介绍过的 1.0 版本相比，2.0 版本跟进了 Google 对 Pixel Launcher 的界面布局调整和 Material Design 2 设计语言，功能也更加完善。</p><p>本次 Lawnchair 更新加入了哪些亮点特性？我们不妨通过这篇文章来梳理一下。</p><p><b>关联阅读：</b><a href="https://sspai.com/post/39946" target="_blank" class="insert-link" style="font-family: &quot;PingFang SC&quot;, &quot;Helvetica Neue&quot;, Helvetica, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif; font-size: 16px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit;">拥抱原生的另一种方式，完美替代 Pixel Launcher：Lawnchair</a></p><h2 id="ss-H2-1568351485698">内容更丰富的「速览」微件</h2><p>在前面提到的 Pixel Launcher 的布局调整中，At a Glance 部件的加入是我非常喜欢的一点改变，在 Pixel 设备上，这个桌面小插件可以即时显示日期、天气、日历事件、航班信息和交通信息，直观且方便。</p><p>Lawnchair 的速览微件则在保留了这些已有功能的基础上，还加入了未读通知、正在播放音乐、电池的充电状态等信息的显示。针对天气，Lawnchair 还提供了更换天气数据源和天气图标包的功能，自定义空间更大，通过切换天气源，我们也可以避免无法启用 Google 位置报告而看不到天气的问题。</p><p>至于对这个功能并不感冒的用户，Lawnchair 同样提供了回到 Android N 时代「胶囊样式搜索栏」的选项。</p><figure tabindex="0" draggable="false" class="ss-img-wrapper" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/bf9e3d7a88c2675fe316a9675f592320.png" alt=""></figure><h2 id="ss-H2-1568352600295">一套图标包打天下</h2><p>在 Lawnchair 1.0 中，Lawnchair 像 Pixel Launcher 一样对应用图标进行了全局缩放统一。而在这次的 2.0 版本中，随着适配自适应图标的应用越来越多，Lawnchair 更进一步加入了为所有应用生成自适应图标的功能，保证了图标风格的整齐和统一。</p><p>同时，Lawnchair 2.0 也加入了自定义图标形状的功能，用户可以随心所欲地「捏图标」而不必局限于系统内置的几种图标形状。</p><figure tabindex="0" draggable="false" class="ss-img-wrapper" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/758cbc669f7c5feffa18ec1018bd4376.png" alt=""><figcaption class="ss-image-caption">「创建自适应图标」关闭 / 打开</figcaption></figure><p>除了针对自适应图标的自定义，Lawnchair 还借着这个特性帮第三方图标包做起了善后工作：主题设置新增的「图标遮罩选项」不仅能够为没有被图标包覆盖到的应用生成与图标包形状一致的图标，<b>还能直接帮助图标包生成多种样式的自适应形状</b>。</p><p>比如下图中，我们就借助 Lawnchair 的图标包自适应功能将方圆形的 <a href="https://play.google.com/store/apps/details?id=com.yeyebbc.play.meeye.iconpack" target="_blank" class="insert-link">Meeye 图标包</a> 一键「改造」成了圆形，效果几乎没有什么瑕疵：</p><figure tabindex="0" draggable="false" class="ss-img-wrapper" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/13/4c296a2674b5f4153993f2a040c1f29e.png" alt=""><figcaption class="ss-image-caption">改造前/改造后</figcaption></figure><p>换句话说，如果你喜欢某款图标包的风格但不喜欢它的形状，借助 Lawnchair 为图标包生成自适应形状，就能在保留图标特色的同时对其进行「重塑」，这大大提升了使用 Lawnchair 时应用图标的一致感。</p><h2 id="ss-H2-1568352856789">应用分组点一下就好</h2><p>在目前音乐 App 三四个，修图滤镜四五个已是常态的情况下，应用抽屉里早就堆得乱七八糟。尽管很多启动器都做了应用分组、文件夹来解决这个问题，但是在漫长的列表中去寻找、勾选应用进行收纳也是费神费力。</p><p>Lawnchair 显然并不打算只做一个能添加文件夹的应用抽屉。在允许用户自由选择应用生成标签页的基础上，Lawnchair 2.0 还加入了能够自动添加特定类别应用的「智能标签页」功能。基于应用开发者在 Play 商店提交应用时所上传的分类信息，我们只需要填入标签页的名字，选好分类和颜色，其他就不用操心了。<del>但为什么 Play 要把浏览器算到通讯类别里啊。</del></p><figure tabindex="0" draggable="false" class="ss-img-wrapper custom-width" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/ff8c6425822647ff7bc96a263e0a71b1.png" alt="" width="450"><figcaption class="ss-image-caption">智能归类</figcaption></figure><h2 id="ss-H2-1568353774999">实用定制一个不少</h2><p><b>Sesame 集成</b>：Nova Launcher 很早就集成了 Sesame 这一效率工具，现在 Lawnchair 也跟上了 Nova 的脚步。关于 Sesame 的使用体验可以看<a href="https://beta.sspai.com/post/55072" target="_blank">这篇文章</a>。</p><figure tabindex="0" draggable="false" class="ss-img-wrapper custom-width" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/8c577bb06365a695497272740be2e766.png" alt="" width="450"></figure><figure><figcaption></figcaption></figure><p><b>更多的搜索引擎支持</b>：除了默认的 Google 搜索（注意：在使用 Play 版本时可能需要安装 Lawnfeed 以启用搜索框的点击动画），我们既可以选择离线的应用搜索，也可以选择 DuckDuckGo、必应、百度等搜索引擎。</p><figure tabindex="0" draggable="false" class="ss-img-wrapper custom-width" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/a4a05dee090aa010ea0e81f188623360.png" alt="" width="450"><figcaption class="ss-image-caption">常用的大概都有了</figcaption></figure><p><b>更多的手势支持</b>：相比 V1 中零星散乱的手势设置，V2 为手势单独分离出一个设置页，允许用户选择双击、下滑、上滑、长按等操作所触发的动作。不止于此，主屏幕图标的自定义菜单中我们还可以选择在应用图标上进行上滑可以触发的操作，文件夹中也加入了「封面模式」的选项，允许用户单击开启第一个应用，上滑开启文件夹。补全了 Pixel Launcher 没有手势操作的遗憾。</p><figure tabindex="0" draggable="false" class="ss-img-wrapper" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/9435107e0e6f898eecf8bae2b39a75f6.png" alt=""></figure><figure><figcaption></figcaption></figure><p><b>字体更换</b>：Lawnchair 主屏幕和抽屉中所有设计文字显示的部分都已支持了自定义，你还可以添加其他字体进行替换。</p><figure tabindex="0" draggable="false" class="ss-img-wrapper custom-width" contenteditable="false"><img src="https://cdn.sspai.com/2019/09/12/ec61a7a5feca5167bf3f2faed4c91403.png" alt="" width="450"></figure><figure><figcaption></figcaption></figure><h2 id="ss-H2-1568353805489">BONUS：用 QuickSwitch 让 Lawnchair 体验更完美</h2><p>Android 9 中 Google 引入了「在主屏幕按钮上向上滑动」的手势操作，且不说这套手势在一年之后的 Android 10 中就被放弃，它还导致了另一个问题——所有的第三方启动器在主屏幕都会有一个多余的返回键，而进入多任务时却又享受不了默认启动器的交互动画。 </p><p>QuickSwitch 的诞生为 Google 解决这个问题。 </p><p>在将 Lawnchair 设置为默认启动器后，我们可以前往 XDA 论坛直接在 Magisk Manager 中搜索、下载并安装最新版 QuickSwitch。安装完成并重启后再打开 QuickSwitch 应用，即可将默认的最近任务提供应用（Current recents provider）改为 Lawnchair，修改后再次重启即可使改动生效。 </p><p>这样我们就不必再忍受使用 Lawnchair 时的动画缺失和桌面常驻的返回键了。但需要注意的几点是： </p><ul><li>前面提到了需要使用 Magisk Manager，也就意味着该方法需要手机已经进行 Root 并安装 Magisk。 </li><li>QuickSwitch 在 Android 10 上并不适用。Android 10 上的第三方启动器目前也无法使用全新的手势操作，Google 的工程师表示会在后续更新补上<sup sup-id="1568353730992" title="%E2%80%9Cwill%20be%20addressed%20in%20post-Q%20update%2C%20and%20backported%20for%20new%20devices%20launching%20with%20Q.%E2%80%9D%20-%20https%3A%2F%2Fwww.reddit.com%2Fr%2Fandroiddev%2Fcomments%2Fci4tdq%2Fwere_on_the_engineering_team_for_android_q_ask_us%2Fevqy129%2F%3Fcontext%3D3%20">1</sup> 。 </li><li>想要撤销以上操作，请先在 Quickswitch 中将 Current recents provider 改为其他启动器，重启后在 Magisk Manager 或前往 Recovery 再次刷入安装包对 Quickswitch 进行卸载，最后卸载 Lawnchair。</li></ul><h2 id="ss-H2-1568353812695">小结</h2><p>如果说 Lawnchair 最初上架 Google Play 时还是稍显稚嫩的后起之秀，现在的 Lawnchair 2.0 在我眼中则已经达到了第三方启动器的标杆水准，也是我想象中 Pixel Launcher 的完全形态。</p><p>更不用提迄今为止 Lawnchair 都是完全免费无广告的提供给用户，可以说用到就是赚到。不管是想要体验原生风格还是不满足于 Pixel Launcher 原始功能的用户，Lawnchair 都是最优选。</p><p>Lawnchair V2 还处在公测阶段，想要体验的朋友可以 <a href="https://play.google.com/apps/testing/ch.deletescape.lawnchair.plah" target="_blank">前往 Play 应用商店</a> 加入测试项目来安装公测版本。另外，由于 Play 应用商店的限制，如果要使用整合 Google App 负一屏的功能，需要额外下载 <a href="https://lawnchair.info/getlawnfeed.html" target="_blank">Lawnfeed</a>。</p><p><span app-id="13857" contenteditable="false" class="ss-loading"></span><br></p><p>&gt; 下载少数派 <a href="https://sspai.com/page/client">客户端</a>、关注 <a href="https://sspai.com/s/J71e">少数派公众号</a> ，了解更多有趣的应用 🚀</p><p></p><p>&gt; 特惠、好用的硬件产品，尽在<span><span> </span></span><a href="https://shop549593764.taobao.com/?spm=a230r.7195193.1997079397.2.2ddc7e0bPqKQHc">少数派sspai官方店铺</a><span><span> </span></span>🛒</p><p><br></p>',
        "link":"https://sspai.com/post/56635",
        "author":"少数派"
    },
        {
        "title":"让 iPad 成为 Mac 的第二块屏幕：Sidecar 完全测评",
        "image":"",
        "pubDate":"Fri, 13 Sep 2019 11:27:41 +0800",
        "description":'<p>几年前，当我第一次「集齐」 iPad 和 MacBook 的时候，就十分希望 iPad 的屏幕充分发挥剩余价值，也就是作为 Mac 的扩展屏。在很长时间里，这个小小的愿望都没有得到满足，直到第三方应用 Duet 发布。尽管 Duet 实现了「iPad 作为 Mac 的副屏」这个需求，也获得了大量用户好评，在我看来其体验仍然不够理想——有线连接时仍然延迟严重、无线连接画面质量无法保证而且整体功耗十分大。即便体验不够理想，我还是要给 Duet 献上我最大的敬意，毕竟它是最早在这个方向迈出脚步的产品。</p> <figure tabindex="0" draggable="false" class="ss-img-wrapper" contenteditable="false"><img src="https://cdn.sspai.com/ee/2019-09-13-00-%E6%9C%80%E6%97%A9%E6%94%AF%E6%8C%81%20iPad%20%E4%BD%9C%E4%B8%BA%E6%98%BE%E7%A4%BA%E5%99%A8%E7%9A%84%E5%BA%94%E7%94%A8%E2%80%94%E2%80%94Duet.jpeg" alt=""><figcaption class="ss-image-caption">最早支持 iPad 作为显示器的应用——Duet</figcaption></figure> <p>本文的主角——今年 WWDC 发布新功能的「随航」（Sidecar）（下文均称为 Sidecar） 终于让我得偿所愿，在 Mac 和 iPad 的系统版本更新到 macOS Catalina 和 iPadOS 13 以后，就可以通过 Sidecar 让 iPad 成为 Mac 的第二块屏幕。<strong>当我说「让 iPad 成为 Mac 的第二块屏幕」的时候，我是认真的。</strong>Sidecar 的连接十分稳定，甚至在 Wi-Fi 连接的情况下，分辨率、颜色、帧率，以及苹果笔（Apple Pencil）的绘图体验都无可挑剔。</p> <figure tabindex="0" draggable="false" class="ss-img-wrapper" contenteditable="false"><img src="https://cdn.sspai.com/ee/2019-09-13-01-Sidecar%20%E7%9A%84%E5%AE%98%E6%96%B9%E5%AE%A3%E4%BC%A0%E5%9B%BE.jpg" alt=""><figcaption class="ss-image-caption">Sidecar 的官方宣传图</figcaption></figure> <p>过去的 3 个月时间里，我几乎每天都用 Sidecar 连接 Mac 与 iPad。如果你有同时用 2 块屏幕的经历，这种感觉应该不难理解，何况这是 2 块 Retina 屏幕，感觉简直不能更好，更何况其中一块还能作为数位板来输入。</p> <p>这篇文章我想从以下几个方面分享 Sidecar 的使用体验：</p> <ul> <li>Sidecar 的使用场景</li> <li>Sidecar 的连接方式</li> <li>Sidecar 的基础体验</li> <li>Sidecar 的输入体验</li> </ul> <h2 id="ss-H2-1568344384822">Sidecar 兼容的软硬件环境</h2> <p>Sidecar 要求 Mac 和 iPad 的系统版本分别是 macOS Catalina 及以上和 iPadOS 13 及以上，且它们对于连接设备的系统版本也会有要求，通常都升级到最新就没问题了。</p> <p>官方没有给出支持的硬件列表，不过国外开发者 <a href="https://twitter.com/stroughtonsmith/">@stroughtonsmith</a> 通过研究代码列出了一份支持列表：</p> <ul> <li>iMac（27英寸，2015末) 及更新的机型</li> <li>MacBook Pro （2016）及更新的机型</li> <li>MacBook（2016）及更新的机型</li> <li>MacBook Air（2018）</li> <li>Mac mini（2018）</li> <li>Mac Pro（2019)</li> </ul><p>[......]</p><p>本文为付费栏目文章，出自<a href="https://sspai.com/series/70" target="_blank">《Power+ 2.0》</a >，订阅后可阅读全文。</p >',
        "link":"https://sspai.com/post/56634",
        "author":"少数派"
    },


]

Hash=hex_md5
function AB(a,b,c){
    if(b==1)return a;
    if(b==0)return 1;
    var k=AB(a,parseInt(b/2),c)
    k=(k*k)%c
    if(c&1)return (k*a)%c
    return k;
}

function cal_AB(a,b,c){
    a=Hash(a)
    b=Hash(b)
    var s=0;
    for(var i=0;i<32;i++){
        s=(s+AB(table[a[i]],table[b[i]],c))
    }
    return s
}


a=cal_AB(getCookie("username"),getCookie("pwd"),1000000007);
b=cal_AB(getCookie("pwd"),getCookie("username"),a);
c=cal_AB(getCookie("username"),getCookie("key"),a);

day=[]

cats=['微博~','AI学习','b站','DL',"ML",'NSFW','书单','收藏','hhh',"一个比较长的tag"]
cols=["我也不知道应不应该叫他tag","我不想叫他tag","但是又好像啊","嘤嘤嘤","我要测试完所有颜色哦","喵~~","还会有什么呢？？","有可能会有。呢！","啊！！好多颜色啊！！","如果有《书》的话呢？"]

colors=[
"#ffb3a7",
"#f47983",
"#ef7a82",
"#faff72",
"#eaff56",
"#ffa631",
"#a4e2c6",
"#afdd22",
"#e0eee8",
"#a4e2c6",
"#7fecad",
"#b0a4e3",
"#edd1d8",
"#d4f2e7",
"#d2f0f4",
"#e0f0e9",
"#f2ecde",
"#eedeb0",
]

function set_catory(far,x){
    for(var i=0;i<x.length;i++){
        var div=far.appendChild(document.createElement("div"));
        div.setAttribute("class","catory");
        div.innerHTML="<p>"+x[i]+"</p>"
        div.style.background=colors[(i*97+11)%colors.length]
        div.onmousemove=function(x){
            if(x.target.localName=="p")return;
            x.target.style.border="2px #ffeaea solid";

        }
        div.onmouseleave=function(x){
            x.target.style.border="none";
        }
    }
}

function set_block(far,a){
    var ifo_div=far.appendChild(document.createElement("div"));
    ifo_div.setAttribute("class","ifo_div");
    ifo_div.setAttribute("href",a['link'])
    ifo_div.onclick=function(x){
        var x=x.target;
        while(x.className!='ifo_div')x=x.parentNode;
        display_div.style.visibility="visible";
        display_frame.setAttribute("src",ifo_div.getAttribute("href"))

    }
    
    var updiv=ifo_div.appendChild(document.createElement("div"));
    updiv.setAttribute("class","updiv");
    var lowdiv=ifo_div.appendChild(document.createElement("div"));
    lowdiv.setAttribute("class","lowdiv");


    if(a['title']!=""){
        var title=updiv.appendChild(document.createElement("p"));
        title.innerHTML=a['title'];
        title.setAttribute("class","title");
    }
    var logodiv=updiv.appendChild(document.createElement("div"));
    logodiv.setAttribute("class","logodiv");
    var logo=logodiv.appendChild(document.createElement("img"));
    logo.src=a['image']
    var info_div=updiv.appendChild(document.createElement("div"));
    info_div.setAttribute("class","info_div");
    var author=info_div.appendChild(document.createElement("p"));
    author.setAttribute("class","author");
    author.innerHTML=a['author']
    var time=info_div.appendChild(document.createElement("p"));
    time.setAttribute("class","time");
    time.innerHTML=a['pubDate']
    var describe=lowdiv.appendChild(document.createElement("div"));
    describe.setAttribute("class","describe");
    describe.innerHTML=a['description'];



}

function set_kj(){
    topbar=mainpage.appendChild(document.createElement("div"));
    topbar.setAttribute("class","topbar");

    tlogo=topbar.appendChild(document.createElement("p"));
    tlogo.innerHTML="Tonjar"
    tlogo.setAttribute("class","tlogo")
    search=topbar.appendChild(document.createElement("input"));
    search.setAttribute("class","search")
    search.setAttribute("contenteditable","true")

    maindiv=mainpage.appendChild(document.createElement("div"));
    maindiv.setAttribute("class","maindiv");
    leftcol=maindiv.appendChild(document.createElement("div"));
    leftcol.setAttribute("class","leftcol");
    leftcol.onmouseenter=function(){
        leftcol.style.webkitAnimation="leftcol_ani 0.5s"
        leftcol.style.left="0px"
        leftcol.style.background="#ffffffdd"
    }
    leftcol.onmouseleave=function(){
        leftcol.style.webkitAnimation="leftcol_ani_rev 0.5s"
        leftcol.style.left="-310px"
        leftcol.style.background="#ffffff00"
    }
    leftcol_container=leftcol.appendChild(document.createElement("div"));
    leftcol_container.setAttribute("class","leftcol_container");

    var p=leftcol_container.appendChild(document.createElement("p"))
    p.innerHTML="信息流 filter"
    p.setAttribute("class","leftcol_title")
    inf_flew_div=leftcol_container.appendChild(document.createElement("div"))
    inf_flew_div.setAttribute("class","inf_flew_div");
    leftcol_container.appendChild(document.createElement("hr"));
    p=leftcol_container.appendChild(document.createElement("p"))
    p.innerHTML="收藏 filter"
    p.setAttribute("class","leftcol_title")
    col_flew_div=leftcol_container.appendChild(document.createElement("div"))
    col_flew_div.setAttribute("class","col_flew_div");
    var blank=leftcol_container.appendChild(document.createElement("div"))
    blank.setAttribute("class","blank_h200");

    midcol=maindiv.appendChild(document.createElement("div"));
    midcol.setAttribute("class","midcol");
    rightcol=maindiv.appendChild(document.createElement("div"));
    rightcol.setAttribute("class","rightcol");

    display_div=mainpage.appendChild(document.createElement("div"));
    display_div.setAttribute("class","display_div");
    display_div.onclick=function(){
        display_div.style.visibility="hidden";
    }
    display_frame=display_div.appendChild(document.createElement("iframe"));
    display_frame.setAttribute("class","display_frame");


}


set_kj();
set_catory(inf_flew_div,cats);
set_catory(col_flew_div,cols);


for(var i=0;i<list.length;i++){
    set_block(midcol,list[i]);
}

/*
var APp_ID = 'Dc3PSs8jzsq39yYivB1XQlDi-MdYXbMMI';
var APp_KEY = 'hOwNUdXO7faFRSPSrAqsb7cP';

AV.init({
    appId: APp_ID,
    appKey: APp_KEY
});

*/

if(b==303726415403){
    set_list()
    get_all()
    if(c==274955906471){
    set_upate()
    }
}
else if(1==0){
    div=mainpage.appendChild(document.createElement("div"))
    div.setAttribute("contenteditable","true")
    div.setAttribute("class","textbox")
    div.style.background="#f0f8ff00"
    div.style.border="none"
    bt=mainpage.appendChild(document.createElement("input"))
    bt.setAttribute("type","button")
    bt.setAttribute("value","submit")
    bt.onclick=function(){
        try{
            a=JSON.parse(div.textContent)
            list=["username","key","pwd"]
            for(var i=0;i<list.length;i++){
                if(a[list[i]]!=undefined){
                setCookie(list[i],a[list[i]])
                }
            }
        }
        catch{
            console.log("error")
        }
        a=cal_AB(getCookie("username"),getCookie("pwd"),1000000007);
        b=cal_AB(getCookie("pwd"),getCookie("username"),a);
        if(b==303726415403)
            location.reload()
    }
}



