function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
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

BTrue=276722344541
CTrue=324677432711
function geta(){
    return cal_AB(getCookie("username"),getCookie("pwd"),1000000007);
}
function getb(){
    return cal_AB(getCookie("pwd"),getCookie("username"),a);
}
function getc(){
    return cal_AB(getCookie("username"),getCookie("key"),a);
}

function getd(){
    return cal_AB(getCookie('pwd'),"IMAKEAMISTAKE",a);
}

function gete(){
    return cal_AB("ITHINKYOUCANNOTKNOWTHIS",getCookie("username"),getd())
}

a=geta();
b=getb();
c=getc();
e=gete()-147292253557;

function getcolor(name,colors){
    var a=Hash(name)
    var s=0
    for(var i=0;i<a.length;i++){
        s=(s+a.charCodeAt(i)*17)%colors.length
    }
    return colors[s];
}


function get_next_char(c,x){
    var i=c.charCodeAt();
    return String.fromCharCode(((i+x-33)%93)+33);
}

function get_last_char(c,x){
    var i=c.charCodeAt();
    return String.fromCharCode(((((i-x-33)%93)+93)%93)+33);
}

function get_next_num(a){
    while(a<100000)a=a**3+37
    return (a*10457+219302112331)%(1000000007)
}

function get_bad_string(s){
    if(s=='\"')return "\\\""
    if(s=='\'')return "\\\'"
    if(s=='\`')return "\\\`"
    if(s=='{')return "\{"
    if(s=='}')return "\}"
    if(s=='\\')return "\\\\"
    return s
}

function general_dict(a,str){
    seed=parseInt(Math.random()*100)
    n=str.length;
    for(var III=0;III<10000;III++){
        s=a
        seed=get_next_num(seed)
        dict={}
        FALL=false;
        s=get_next_num(s+seed)

        c=get_next_char(String.fromCharCode(33),s)
        s=get_next_num(s+seed)
        for(var i=0;i<n;i++){
            tmp=get_last_char(str[i],s);
            if(dict[c]==undefined)dict[c]=tmp;
            if(dict[c]!=tmp){
                FALL=true;
                break;
            }
            c=str[i]
            s=get_next_num(s+seed)
        }
        if(FALL==true){
            continue;
        }
        aaaa="{"
        for(var i=0;i<93;i++){
            if(dict[String.fromCharCode(33+i)]==undefined)
                dict[String.fromCharCode(33+i)]=get_next_char('a',parseInt(Math.random()*100))

            aaaa=aaaa+"\""+get_bad_string(String.fromCharCode(33+i))+"\":\""+get_bad_string(dict[String.fromCharCode(33+i)])+"\","
        }
        return [aaaa,n,seed,dict];
    }
    return "faill"
}



function create_str(a,dict,p,n){
    a=get_next_num(a+p)
    c=get_next_char(String.fromCharCode(33),a)
    str=""
    for(var i=0;i<n;i++){
        c=dict[c]
        a=get_next_num(a+p)
        c=get_next_char(c,a)
        str=str+c
    }
    return str
}



////////////////////////////////////////////

function dragFunc(Drag) {
    Drag.onmousedown = function(event) {
        var ev = event || window.event;
        event.stopPropagation();
        var disX = ev.clientX - Drag.offsetLeft;
        var disY = ev.clientY - Drag.offsetTop;
        document.onmousemove = function(event) {
            var ev = event || window.event;
            Drag.style.left = ev.clientX - disX + "px";
            Drag.style.top = ev.clientY - disY + "px";
            Drag.style.cursor = "move";
        };
    };
    Drag.onmouseup = function() {
        document.onmousemove = null;
        this.style.cursor = "default";
    };
};