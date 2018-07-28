function getCookie(c_name){
    if (document.cookie.length>0){c_start=document.cookie.indexOf(c_name + "=");if (c_start!=-1){var APp_ID="D8FFxajzSQr4hQO5NNjO0d";
        c_start=c_start + c_name.length+1 ;
        c_end=document.cookie.indexOf(";",c_start);if (c_end==-1) 
        c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end))} }return ""}var APp_ID = 'SAF5yA8FFxajzSQr4hQO5FDe-gzGzoHsz';var APp_KEY = 'R073VXVoAzJT6KASB5Y5pLX0';AV.init({appId: APp_ID,appKey: APp_KEY});function setCookie(c_name,value){var expiredays=365;var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString())}

function level(x){
    if(getCookie("UserName")=="")return -1;
    if(getCookie("UserPassword")=="")return 0;
    if(Hash(getCookie("UserName")+"_"+getCookie("UserEmail")+"_"+getCookie("UserPassword")+x)=="tjlhhalkpbzqqrmc")return 2;
    if(Hash(getCookie("UserName")+"_"+getCookie("UserPassword")+x)=="omxolhoalxembmas")return 1;
    return 0;
}

function time_seal(){
    return ((new Date()).getDate()+(new Date()).getMonth()*31)*5+Math.floor((new Date()).getHours()/4);
}

var get_articles_info=function(){
    var query_articles = new AV.Query('articles');
    query_articles.limit(1000)
    query_articles.notEqualTo("title","公告")
    query_articles.descending("updatedAt")
    if(level()==0)query_articles.equalTo("tourist",true)
    query_articles.equalTo("group2",true)
    query_articles.select(["title","tags","categories","description"])
    query_articles.find().then(function(articles){
        localStorage.articleInfoTime=time_seal();
        localStorage.articleinfo=""
        for(var i=0;i<articles.length;i++){
            if(i!=0)
                localStorage.articleinfo+="\n"
            localStorage.articleinfo+="{{"+articles[i].id+","+articles[i].updatedAt.toISOString().substr(0,10)+",bt["+articles[i].attributes.title+"]et,bT["+articles[i].attributes.tags+"]eT,bc["+articles[i].attributes.categories+"]ec,bd["+articles[i].attributes.description+"]}}";
        }
    },function(error){
        alert("请求数据失败，请联系网站所有者。")
    })
}
function build_info_list(){
    info_list=[]
    if(localStorage.articleinfo==undefined){
        return;
    }
    for(var i=0;i<localStorage.articleinfo.length;
        i+=localStorage.articleinfo.substr(i).search(/\]}}/)+4){
            info_list[info_list.length]={
                "id":localStorage.articleinfo.substr(i+2,24),
                "title":localStorage.articleinfo.substring(i+localStorage.articleinfo.substr(i).search(/bt\[/)+3,i+localStorage.articleinfo.substr(i).search(/\]et/)),
                "tags":localStorage.articleinfo.substring(i+localStorage.articleinfo.substr(i).search(/bT\[/)+3,i+localStorage.articleinfo.substr(i).search(/\]eT/)).replace(/^[\s,]+/,"").replace(/[\s,]+$/,"").split(/[\s\,]+/),
                "categories":localStorage.articleinfo.substring(i+localStorage.articleinfo.substr(i).search(/eT,bc\[/)+6,i+localStorage.articleinfo.substr(i).search(/\]ec,bd/)).replace(/^[\s,]+/,"").replace(/[\s,]+$/,"").split(/[\s\,]+/),
                "description":localStorage.articleinfo.substring(i+localStorage.articleinfo.substr(i).search(/ec,bd\[/)+6,i+localStorage.articleinfo.substr(i).search(/\]}}/)),
                "time":new Date(localStorage.articleinfo.substr(i+27,10))
            }
        }
    }
    if(time_seal()!=localStorage.articleInfoTime){
        get_articles_info();
}
var get_articleById=function(id){
    var query_articles = new AV.Query('articles');
    query_articles.notEqualTo("title","公告")
    query_articles.equalTo("objectId",id)
    query_articles.find().then(function(Articles){
        if(Articles.length==0){
            mainpage.appendChild(document.createElement("p")).innerHTML="没有找到此文章,将返回主页";
            setTimeout("location='https://tonjar.github.io'",5000)
        }
        else{
            article=Articles[0]
            var atr=mainpage.appendChild(document.createElement("div"))
                atr.setAttribute("class","article card")
            var atr_t=atr.appendChild(document.createElement("p"))
            atr_t.innerText=article.attributes.title
            atr_t.setAttribute("class","article-title")
            atr_t=atr.appendChild(document.createElement("p"))
            atr_t.innerText=article.updatedAt.toISOString().substring(0,article.updatedAt.toISOString().search(/T/))
            atr_t.setAttribute("class","article-time")
            if(level()==2){
            atr_t=atr.appendChild(document.createElement("a"))
            atr_t.innerText="EDIT"
            atr_t.href="edit.html?id="+id;
            atr_t.setAttribute("class","article-EDIT")
            }
            atr.appendChild(document.createElement("hr")).setAttribute("class","article-title-line")
            atr_t=atr.appendChild(document.createElement("div"))
            atr_t.setAttribute("class","article-main")
            titles=markdown(atr_t,article.attributes.article)
            pagename="article"+id;
            if(article.attributes.commit==true)
            apply_commit()
        }
    },function(error){
        mainpage.appendChild(document.createElement("p")).innerHTML="请求文章数据失败，请联系网站所有者。"
    })
}
function getStatement(){
    var query_articles = new AV.Query('articles');
    query_articles.equalTo("title","公告")
    query_articles.find().then(function(statement){
        if(statement.length===0){
            mainpage.appendChild(document.createElement("p")).innerText="欢迎来到我的博客，大家可以从右边边侧栏查看我的文章。<br>现在不知道为什么，我暂时没有找到公告。<br>有任何问题可以在本页下方评论区留言。或者通过邮件联系我ღ( ´･ᴗ･` )比心。"
        }
        for(var i=statement.length-1;i>=0;i--){
            buildstatement(mainpage,statement[i])
        }
        apply_commit()

    },function(error){
        mainpage.appendChild(document.createElement("p")).innerText="请求公告数据失败，请联系网站所有者。"
        apply_commit()

    }) 
}
teststatement={}
teststatement.attributes={}
teststatement.attributes.article="##hello \n > mkie  \n $\\frac{1}{2}$ $$\frac{x^2_1}{x_0+x_i}$$\n #uuu ## ds  **2** ***3*** *3* ##hello \n > mkie  \n $\\frac{1}{2}$ $$\frac{x^2_1}{x_0+x_i}$$\n #uuu ## ds  **2** ***3*** *3* ##hello \n > mkie  \n $\\frac{1}{2}$ $$\frac{x^2_1}{x_0+x_i}$$\n #uuu ## ds  **2** ***3*** *3* ##hello \n > mkie  \n $\\frac{1}{2}$ $$\frac{x^2_1}{x_0+x_i}$$\n #uuu ## ds  **2** ***3*** *3* ##hello \n > mkie  \n $\\frac{1}{2}$ $$\frac{x^2_1}{x_0+x_i}$$\n #uuu ## ds  **2** ***3*** *3* \n> 2 \n"
teststatement.updatedAt=new Date()
function buildstatement(area,state){
    var p=area.appendChild(document.createElement("div"))
    p.setAttribute("class","card state")
    var pp=p.appendChild(document.createElement("div"))
    pp.style="border-bottom: 1px solid;"
    var g=pp.appendChild(document.createElement("h1"))
    g.innerText="公告";
    g.setAttribute("class","stitle")
    g=pp.appendChild(document.createElement("p"))
    g.innerText=state.updatedAt.toISOString().substring(0,state.updatedAt.toISOString().search(/T/));
    g.setAttribute("class","stitletime")
    p=p.appendChild(document.createElement("div"))
    p.setAttribute("class","statement-area")
    markdown(p,state.attributes.article)
}

function getURLinfo(){if(location.href.search(/#/)==-1)return "";return location.href.substr(location.href.search(/#/)+1);}function Hash(x){x="_"+x+"_";x=x.toLocaleLowerCase();s="qwertyuiopasdfghjklzxcvbnm";d={};vd={};for(var i=0;i<26;i++){d[s[i]]=((((i+21)*(83*i)^4221)%317+3)^152)%97;d[i]=i;vd[i]=s[i];vd[i+26]=s[i];}key=[];for(var i=0;i<16;i++){key[i]=(((i+21)*i+i+2)^37)%41}for(var i=0;i<x.length;i++){if(d[x[i]]==undefined)continue;key[i%16]+=d[x[i]];}for(var i=0;i<x.length;i++){if(d[x[i]]==undefined)continue;key[(i*i)%16]+=d[x[i]];key[(i*i*(i+17))%16]+=d[x[i]];}ans="";for(var i=0;i<16;i++){key[i]%=26;ans+=vd[key[i]];}return ans;}

/*/---------------------------------------------------/*/
 /*/-----------------------------------------------/*/
  /*/-------------------------------------------/*/
   /*/---------------------------------------/*/
    /*/-----------------------------------/*/
     /*/-------------------------------/*/
      /*/---------------------------/*/
       /*/-----------------------/*/
        /*/-------------------/*/
         /*/---------------/*/
          /*/-----------/*/
           /*/-------/*/
            /*/---/*/
             /*/*/




function markdown(e,x,gb=0,TOC_support=true){
    var author="@author Tonjar";
    var md_status=0;
    var last=0;
    var sig={"- ":1, "* ":1, "> ":1, "+ ":1}
    x="\n"+x+"\n\n      ";
    var md_titles=[]
    var md_tocs=[]
    var md_footer={}
    var md_web_index={}
    var md_use_footer=[]
    var md_web_a=[]
    var passage_complete=function(e,x,TOC_support=true,gb=0){
        if(gb<0)gb=0;
        if(x.search(/^\s*\[TOC\]\s*$/)==0)return make_TOC(e)
        if(x.search(/^\s*----*\s*$/)==0){
            e.appendChild(document.createElement("hr")).setAttribute("class","md-hr");
            return;
        }
        var title_mode=/^\S{1,}\n={3,}$/.exec(x)
        if(title_mode!=null){
            e.setAttribute("class","md-h1")
            var h1=e.appendChild(document.createElement("h1"))
            h1.id="title"+(h1.innerText=/\S{1,}/.exec(title_mode[0]))
            md_titles[md_titles.length]=[1,h1.innerText]
            return;
        }
        var title_mode=/^\S{1,}\n-{3,}$/.exec(x)
        if(title_mode!=null){
            e.setAttribute("class","md-h2")
            var h1=e.appendChild(document.createElement("h2"))
            h1.id="title"+(h1.innerText=/\S{1,}/.exec(title_mode[0]))
            md_titles[md_titles.length]=[2,h1.innerText]
            return;
        }
        var pas_index=(/\${2}[^\$]{1,}\${2}/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            var md_te=e.appendChild(document.createElement("div"))
            md_te.appendChild(document.createElement("pre")).innerText=x.substring(pas_index.index+2,pas_index.index+pas_index[0].length-2)
            md_te.setAttribute("class","md-latex-block")
            md_latex(md_te)
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/\${1}[^\$]{1,}\${1}/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            var md_te=e.appendChild(document.createElement("div"))
            md_te.appendChild(document.createElement("pre")).innerText=x.substring(pas_index.index+1,pas_index.index+pas_index[0].length-1)
            md_te.setAttribute("class","md-latex-inline")
            md_latex(md_te)
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }

        pas_index=(/(\*{3}|_{3})\S{1,}\1/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            e.appendChild(document.createElement("b")).appendChild(document.createElement("i")).innerText=x.substring(pas_index.index+3,pas_index.index+pas_index[0].length-3)
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/(\*{2}|_{2})\S{1,}\1/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            e.appendChild(document.createElement("b")).innerText=x.substring(pas_index.index+2,pas_index.index+pas_index[0].length-2)
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/(\*{1}|_{1})\S{1,}\1/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            e.appendChild(document.createElement("i")).innerText=x.substring(pas_index.index+1,pas_index.index+pas_index[0].length-1)
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/`[^`\n]{1,}`/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            var sp=e.appendChild(document.createElement("span"))
            sp.innerText=x.substring(pas_index.index+1,pas_index.index+pas_index[0].length-1)
            sp.setAttribute("class","md-inline-code")
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/!\[[^\n]*\]\(\S*\)/).exec(x)
        if(pas_index!=null){
            var picName=pas_index[0].substring(2,pas_index[0].search(/]\(/))
            var picurl=pas_index[0].substring(pas_index[0].search(/]\(/)+2,pas_index[0].length-1)
            passage_complete(e,x.substring(0,pas_index.index),false)
            var sp=e.appendChild(document.createElement("img"))
            sp.alt=picName
            sp.src=picurl
            sp.setAttribute("class"," md-img")
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }

        pas_index=(/\[[^\n]*\]\(\S*\)/).exec(x)
        if(pas_index!=null){
            var aName=pas_index[0].substring(1,pas_index[0].search(/]\(/))
            var url=pas_index[0].substring(pas_index[0].search(/]\(/)+2,pas_index[0].length-1)
            passage_complete(e,x.substring(0,pas_index.index),false)
            var sp=e.appendChild(document.createElement("a"))
            sp.innerText=aName
            sp.href=url
            sp.setAttribute("class"," md-a-inline")
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }

        pas_index=(/^\[\^\S{1,}\]:[ \S]{1,}$/).exec(x)
        if(pas_index!=null){
            var cName=pas_index[0].substring(2,pas_index[0].search(/]:/))
            var ccontent=pas_index[0].substring(pas_index[0].search(/]:/)+2,pas_index[0].length)
            md_footer[cName]=ccontent
            passage_complete(e,x.substring(0,pas_index.index),false)
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/^\[\S{1,}\]:[ \S]{1,}$/).exec(x)
        if(pas_index!=null){
            var cName=pas_index[0].substring(1,pas_index[0].search(/]:/))
            var url=pas_index[0].substring(pas_index[0].search(/]:/)+2,pas_index[0].length)
            md_web_index[cName]=url
            passage_complete(e,x.substring(0,pas_index.index),false)
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/\[\^\S{1,}\]/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            var p=e.appendChild(document.createElement("sup")).appendChild(document.createElement("a"))
            p.innerText=pas_index
            md_use_footer[md_use_footer.length]=[p]
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/\[[^\n]*\]\[\S*\]/).exec(x)
        if(pas_index!=null){
            passage_complete(e,x.substring(0,pas_index.index),false)
            var p=e.appendChild(document.createElement("a"))
            p.innerText=pas_index
            md_web_a[md_web_a.length]=[p]
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }

        pas_index=(/((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+|<((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+>/).exec(x)
        if(pas_index!=null){
            var code_url=(pas_index[0][0]=="<"?pas_index[0].substring(1,pas_index[0].length-1):pas_index[0])
            passage_complete(e,x.substring(0,pas_index.index),false)
            var a=e.appendChild(document.createElement("a"));
            a.innerText=code_url
            a.href=code_url
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }
        pas_index=(/www.[^\s]*.(com|cn|io|net)\/?[^\s]*|<www.[^\s]*.(com|cn|io|net)\/?[^\s]*>/).exec(x)
        if(pas_index!=null){
            var code_url=(pas_index[0][0]=="<"?pas_index[0].substring(1,pas_index[0].length-1):pas_index[0])
            passage_complete(e,x.substring(0,pas_index.index),false)
            var a=e.appendChild(document.createElement("a"));
            a.innerText=code_url
            a.href="https://"+code_url
            return passage_complete(e,x.substr(pas_index.index+pas_index[0].length),false)
        }



        e.appendChild(document.createElement("p")).innerHTML=x.replace(/</,"&lt;").replace(/\n/g,"<br>");
        return -gb*0;
    }
    var make_title=function(e,x){
        var cnt=0;
        for(;cnt<x.length&&cnt<5&&x[cnt]=="#";cnt++);
        e.setAttribute("class","md-h"+cnt)
        var head=cnt,end=x.length;
        if(x.length>cnt*2){
            for(var i=1;i<=cnt+1;i++){
                if(i==cnt+1){
                    end-=cnt;
                    break;
                }
                if(x[x.length-i]!="#")break;
            }
        }
        while(x[head]==" ")head++;
        while(x[end-1]==" ")end--;
        var title=x.substring(head,end)
        var h=e.appendChild(document.createElement("h"+cnt))
        h.innerText=title;
        h.id="title"+title
        md_titles[md_titles.length]=[cnt,title]
    }
    var make_quote=function(e,x){
        markdown(e,x.replace(/\n> /g,"\n"),-1,false)
    }
    var make_ol=function(e,x){
        e.appendChild(document.createElement("p")).innerText=x;

    }
    var make_ul=function(e,x){
        e.appendChild(document.createElement("p")).innerText=x;

    }
    var make_code=function(e,x,gb=0){
        if(gb<=0)gb=0;
        e.onclick=function(e){
            e=e.target
            while(e.className!="md-code")
                e=e.parentElement
            for(var i=0;i<e.children[1].childElementCount;i++){
                e.children[0].children[i].style.height=e.children[1].children[i].offsetHeight+"px"
            }
         }
        code_index=e.appendChild(document.createElement("pre"))
        var pre=e.appendChild(document.createElement("pre"))
        var linecnt=0;
        var code_last=0;
        var code_lan=""
        code_index.appendChild(document.createElement("div")).innerText="1"
        var code_line=pre.appendChild(document.createElement("div"))
        code_line.setAttribute("class","md-code-line")
        var md_code_status=0
        for(var i=3;i<x.length;i++){
            if(linecnt==0){
                if(x[i]=="\n"){
                    linecnt++;
                    code_last=i+1
                    if(gb>0&&gb<i)gb=-code_line.offsetTop;
                }
                else if(x[i]!=" ")
                    code_lan+=x[i]
                continue;
            }
            if(x[i]=="\n"){
                code_line.appendChild(document.createElement("span")).innerText=x.substring(code_last,i)
                if(i==x.length-1)break;
                linecnt++
                code_index.appendChild(document.createElement("div")).innerText=linecnt
                code_line=pre.appendChild(document.createElement("div"))
                code_line.setAttribute("class","md-code-line")
                code_last=i+1
                continue;
            }
            switch(md_code_status){
                case 0:
                    if(x[i]==" ")md_code_status=2;
                    else md_code_status=1;
                    break;
                case 1:
                    if(x[i]==" "){
                        code_line.appendChild(document.createElement("span")).innerText=x.substring(code_last,i)
                        code_last=i
                    }break;
                case 2:
                    if(x[i]!=" "){
                        code_line.appendChild(document.createElement("span")).innerText=x.substring(code_last,i)
                        code_last=i
                    }break;

            }
        }
        code_index.setAttribute("class","md-code-index")
        if(linecnt<10)pre.setAttribute("class","md-code-main md-code1")
        else if(linecnt<100)pre.setAttribute("class","md-code-main md-code2")
        else if(linecnt<1000)pre.setAttribute("class","md-code-main md-code3")
        else if(linecnt<10000)pre.setAttribute("class","md-code-main md-code4")
        e.click()
        return -gb;
    }
    var make_TOC=function(e){
        md_tocs[md_tocs.length]=e
        e.appendChild(document.createElement("p")).innerText="-目录-";
    }
    var gbe=0;
    for(var i=0;i<x.length-3;i++){
        if(x[i]=="\n"){
            switch(md_status){
                case 0:last=i;break;//空行
                case 1://普通段落
                    if(x[i+1]=="#"||x[i+1]=="\n"||(x[i+1]==x[i+2]&&x[i+2]==x[i+3]&&x[i+3]=="`")||((x[i+1]+x[i+2])in sig)||x.substr(i+1).search(/^[0,1,2,3,4,5,6,7,8,9]{1,}\. /)==0||x.substr(i+1).search(/^ *\n/)==0){
                        var passage=e.appendChild(document.createElement("div"))
                        passage.setAttribute("class","md-passage")
                        if(gb>0&&gb-5<i){
                            gb=-passage_complete(passage,x.substring(last+1,i),TOC_support,gb-last);
                            gbe=passage;
                        }
                        else
                            passage_complete(passage,x.substring(last+1,i),TOC_support);
                        last=i;
                        md_status=0;
                    }break;
                case 2://#
                    var passage=e.appendChild(document.createElement("div"))
                    make_title(passage,x.substring(last+1,i));
                    if(gb>0&&gb<i){
                        gbe=passage;
                        gb=0;
                    }
                    last=i;
                    md_status=0;
                    break;
                case 3://>
                    if(x[i+1]=="#"||x[i+1]=="\n"||(x[i+1]==x[i+2]&&x[i+2]==x[i+3]&&x[i+3]=="`")||((x[i+1]+x[i+2])in sig &&x[i+1]!=">")||x.substr(i+1).search(/^[0,1,2,3,4,5,6,7,8,9]{1,}\. /)==0){
                        var passage=e.appendChild(document.createElement("div"))
                        passage.setAttribute("class","md-quote")
                        make_quote(passage,x.substring(last,i));
                        last=i;
                        md_status=0;
                        if(gb>0&&gb<i){
                            gbe=passage;
                            gb=0;
                        }
                    }
                    break;
                case 4:// - + *
                    if((x[i+1]+x[i+2])in sig&&x[i+1]!=">")break;
                    var passage=e.appendChild(document.createElement("div"))
                    passage.setAttribute("class","md-ul")
                    make_ul(passage,x.substring(last+1,i));
                    last=i;
                    md_status=0;
                    if(gb>0&&gb<i){
                        gbe=passage;
                        gb=0;
                    }
                    break;
                case 5://```
                    if(x.substr(i+1).search(/^``` *\n/)==0){
                        var passage=e.appendChild(document.createElement("div"))
                        passage.setAttribute("class","md-code")
                        if(gb>0&&gb-5<i){
                            gb=-make_code(passage,x.substring(last+1,i+1),gb-last);
                            gbe=passage;
                        }
                        else
                            make_code(passage,x.substring(last+1,i+1));
                        last=i+5;
                        i+=5
                        md_status=0;
                    }
                    break;
                case 6://1.2.
                    if(x.substr(i+1).search(/^(    )*[0,1,2,3,4,5,6,7,8,9]{1,}\. /)==0)break;
                    var passage=e.appendChild(document.createElement("div"))
                    passage.setAttribute("class","md-ol")
                    make_ol(passage,x.substring(last+1,i));
                    last=i;
                    md_status=0;
                    if(gb>0&&gb<i){
                        gbe=passage;
                        gb=0;
                    }
                    break;

                    
            }
            if(md_status==0){
                if(x[i+1]=="#")md_status=2;
                else if(x[i+1]==">"&&x[i+2]==" ")md_status=3;
                else if((x[i+1]+x[i+2])in sig&&x[i+1]!=">") md_status=4;
                else if(x[i+1]==x[i+2]&&x[i+2]==x[i+3]&&x[i+3]=="`")md_status=5;
                else if(x.substr(i+1).search(/^[0,1,2,3,4,5,6,7,8,9]{1,}\. /)==0) md_status=6;
            }
        }
        if(md_status==0&&x[i]!=' '&&x[i]!="\n"){
            md_status=1;
        }
    }
    if(md_use_footer.length>0){
        var cnt=0;
        for(var i=0;i<md_use_footer.length;i++){
            var fName=md_use_footer[i][0].innerText.substr(2,md_use_footer[i][0].innerText.length-3)
            if(fName in md_footer){
                cnt++;
                if(cnt==1){
                    e.appendChild(document.createElement("hr")).setAttribute("class","End-Of-doc")
                }
                var div=e.appendChild(document.createElement("div"))
                div.setAttribute("class","md-footer")
                div.appendChild(document.createElement("p")).innerText=cnt+". "
                div.appendChild(document.createElement("p")).innerText=md_footer[fName]
                var a=div.appendChild(document.createElement("a"))
                a.innerText="↩"
                a.href="#mdcontentfooter"+cnt
                md_use_footer[i][0].href="#footer"+cnt
                md_use_footer[i][0].innerText=cnt
                fName=md_use_footer[i][0].id="mdcontentfooter"+cnt
                a.id="footer"+cnt
            }
            else{
                md_use_footer[i][0].setAttribute("class","md-error")
            }
        }
    }
    for(var i=0;i<md_web_a.length;i++){
        var fName=md_web_a[i][0].innerText.substring(md_web_a[i][0].innerText.search(/\]\[/)+2,md_web_a[i][0].innerText.length-1)
        if(fName in md_web_index){
            md_web_a[i][0].innerText=fName
            md_web_a[i][0].href=md_web_index[fName];
        }
        else{
            md_web_a[i][0].setAttribute("class","md-error")
        }
    }
    
    if(md_tocs.length>0){
        var e=md_tocs[0];
        e.innerText=""
        var toc=e.appendChild(document.createElement("div"))
        toc.setAttribute("class","md-toc")
        if(md_titles.length==0)toc.appendChild(document.createElement("p")).innerText="暂无目录"
        for(var i=0;i<md_titles.length;i++){
            var a=toc.appendChild(document.createElement("a"))
            a.href="#title"+md_titles[i][1];
            a.innerText=md_titles[i][1]
            a.setAttribute("class","md-toc-a"+md_titles[i][0])
        }
        for(var i=1;i<md_tocs.length;i++){
            md_tocs[i].innerText=""
            md_tocs[i].appendChild(e.children[0].cloneNode(true))
        }
    }

    return [md_titles,gbe.offsetTop-gb];
}   
function md_latex(e){
    
}
