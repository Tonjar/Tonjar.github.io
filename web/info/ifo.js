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

inflist=[]
taskinf={}
spiders=[]
taskid=[]
spidername={}

update_inf_index=10

window.onscroll=function(){
  if(update_inf_index>=inflist.length)return;
  if(document.body.offsetHeight-window.scrollY>1500)return;
  set_block(midcol,inflist[update_inf_index]);
  update_inf_index++;
}

function get_spiders(){
  var query=new AV.Query('spiderinfo')
  query.find().then(
    function(ts){
      for(var i=0;i<ts.length;i++){
        spiders[i]=[ts[i].id,ts[i].attributes]
        spidername[ts[i].id]=ts[i].attributes.name
      }
    },
    function(error){
      console.log(error)
    }
  )
}

function set_settingpage(){
  var error_p=setting_div.appendChild(document.createElement('p'))
  error_p.setAttribute('class','setting_h1')
  error_p.innerHTML="故障列表"
  var error_s=setting_div.appendChild(document.createElement('p'))
  error_s.setAttribute('class','setting_h2')
  error_s.innerHTML="爬虫"

  var index_s=0,index_t=0;
  for(var i=0;i<spiders.length;i++){
    if(spiders[i][1].error=='true'){
      index_s++;
      var error_item=setting_div.appendChild(document.createElement('p'))
      error_p.setAttribute('class','error_p')
      error_p.innerHTML="序号"+index_s+" id:"+spiders[i][0]+" name"+spiders[i][1].name+" lastuse"+spiders[i][1].lastuse
    }
  }
  for(var i=0;i<taskid.length;i++){
    if(taskinf[taskid[i]].error=='true'){
      index_t++;
      var error_item=setting_div.appendChild(document.createElement('p'))
      error_p.setAttribute('class','error_p')
      error_p.innerHTML="序号"+index_t+" id:"+taskid[i]+" name"+taskinf[taskid[i]].name+" spider_id"+taskinf[taskid[i]].spider+" spider_name"+spidername[taskinf[taskid[i]].spider]
    }
  }
}

function get_taskinf(){
  var query=new AV.Query('tasksinfo')
  query.limit(1000)
  query.find().then(
    function(ts){
      for(var i=0;i<ts.length;i++){
        taskinf[ts[i].id]=ts[i].attributes
        taskid[i]=ts[i].id
      }
      get_list()
    },
    function(error){
      console.log(error)
    } 
  )
}


function get_list(){
  console.log('start get list')
  var query= new AV.Query('infolist')
  query.limit(100)
  query.find().then(
    function(ts){
      for(var i=0;i<ts.length;i++){
        ts[i].attributes['summary']=ts[i].attributes['summary']
        inflist[i]=ts[i].attributes
        inflist[i]['id']=ts[i].id
        if(i<10)
          set_block(midcol,ts[i].attributes)
      }
    },
    function(error){
      console.log(error)
    }
  )
}

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
"#ffb3a7","#f47983","#ef7a82","#faff72","#eaff56","#ffa631",
"#a4e2c6","#afdd22","#e0eee8","#a4e2c6","#7fecad","#b0a4e3",
"#edd1d8","#d4f2e7","#d2f0f4","#e0f0e9","#f2ecde","#eedeb0",
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
geth=function(a){
  s=a.offsetTop;
  while(a!=document.body){
    a=a.offsetParent;
    s=s+a.offsetTop;
  }
  return s
}

function set_block(far,a){
  console.log('start set block')
    var ifo_div=far.appendChild(document.createElement("div"));
    ifo_div.setAttribute("class","ifo_div");
    ifo_div.setAttribute("href",a['link'])
    ifo_div.onclick=function(x){
      if(x.target.localName=='img'){
        if(x.target.className=='bigpic'){
          x.target.setAttribute('class','')
             if(geth(x.target)-60<window.scrollY)
          scrollTo(0,geth(x.target)-60)

        }
        else{
          x.target.setAttribute('class','bigpic')
        }
      }

    }
    
    var updiv=ifo_div.appendChild(document.createElement("div"));
    updiv.setAttribute("class","updiv");
    var lowdiv=ifo_div.appendChild(document.createElement("div"));
    lowdiv.setAttribute("class","lowdiv");


    var logodiv=updiv.appendChild(document.createElement("div"));
    logodiv.setAttribute("class","logodiv");
    var logo=logodiv.appendChild(document.createElement("img"));
    //logo.src=a['image']
    var info_div=updiv.appendChild(document.createElement("div"));
    info_div.setAttribute("class","info_div");
    var author=info_div.appendChild(document.createElement("p"));
    author.setAttribute("class","author");
    author.innerHTML=taskinf[a['task_id']]['name']
    var time=info_div.appendChild(document.createElement("p"));
    time.setAttribute("class","time");
    if(a['time'].getFullYear()!=new Date().getFullYear())
    time.innerHTML=a['time'].getFullYear()+'-'+(a['time'].getMonth()+1)+'-'+a['time'].getDate()+" "+(a['time'].getHours()<10?'0':'')+a['time'].getHours()+":"+(a['time'].getMinutes()<10?'0':'')+a['time'].getMinutes()
    else
    time.innerHTML=(a['time'].getMonth()+1)+'月'+a['time'].getDate()+"日 "+(a['time'].getHours()<10?'0':'')+a['time'].getHours()+":"+(a['time'].getMinutes()<10?'0':'')+a['time'].getMinutes() 
    var describe=lowdiv.appendChild(document.createElement("div"));
    describe.setAttribute("class","describe");
    var summary=a['summary']
    var sl=summary.length
    do{
      sl=summary.length
      summary=summary.replace(/(?<=<img[\s|\S]*>)(\s)*("(&nbsp;)*")*(\s)*(<br>)+<img/,'<img')
      summary=summary.replace(/<a[\s|\S]*?>(?=<img)/,'')
      summary=summary.replace(/(?<=<img[\s|\S]*>)<\/a>/,'')
    }while(sl!=summary.length);

    if(taskinf[a['task_id']]['type']=='article'){
        describe.innerHTML="<p class='title_atr'>"+a['title']+"<\/p><br>"+summary

     //   console.log(a['description'].substr(0,200))
    }
    else
        describe.innerHTML=summary;

    var URLlink=lowdiv.appendChild(document.createElement("a"));
    URLlink.setAttribute("href",a['link'])
    URLlink.setAttribute('target','_blank')
    URLlink.setAttribute('class','URLlink')
    var urldiv=URLlink.appendChild(document.createElement("div"))
    urldiv.setAttribute("class","URLdiv")
    urldiv.innerHTML="<div>"+a['title']+"</div>"

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
    setting=topbar.appendChild(document.createElement('p'))
    setting.innerHTML="设置"
    setting.setAttribute('class','setting_logo')

    maindiv=mainpage.appendChild(document.createElement("div"));
    maindiv.setAttribute("class","maindiv");
    leftcol=maindiv.appendChild(document.createElement("div"));
    leftcol.setAttribute("class","leftcol");
    leftcol.onmouseenter=function(){
        leftcol.style.webkitAnimation="leftcol_ani 0.5s"
        leftcol.style.left="0px"
        leftcol.style.background="#ffffffdd"
    }
    tlogo.onclick=leftcol.onmouseenter;
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

    setting_div=maindiv.appendChild(document.createElement("div"));
    setting_div.setAttribute("class",'setting_div')

}
var APp_ID = 'Dc3PSs8jzsq39yYivB1XQlDi-MdYXbMMI';
var APp_KEY = 'hOwNUdXO7faFRSPSrAqsb7cP';

AV.init({
    appId: APp_ID,
    appKey: APp_KEY
});

set_kj();
set_catory(inf_flew_div,cats);
set_catory(col_flew_div,cols);

get_taskinf();


/*
var APp_ID = 'Dc3PSs8jzsq39yYivB1XQlDi-MdYXbMMI';
var APp_KEY = 'hOwNUdXO7faFRSPSrAqsb7cP';

AV.init({
    appId: APp_ID,
    appKey: APp_KEY
});

*/

if(b==303726415403){
  //  set_list()
  //  get_all()
    if(c==274955906471){
  //  set_upate()
    }
}
else{
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



