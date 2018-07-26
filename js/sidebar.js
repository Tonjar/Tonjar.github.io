var list=["主页","文章目录","游戏目录"]
var href=["./index.html","./ArticleIndex.html","./GameIndex.html"]
var descripion="数学！数据！算法！"
sidebar=document.getElementById("sidebar")
overlay=sidebar.appendChild(document.createElement("div"))
overlay.setAttribute('class','header-overlay')

sideshow=overlay.appendChild(document.createElement("p"))
sidehidden=overlay.appendChild(document.createElement("p"))
sideshow.innerHTML="→"
sidehidden.innerHTML="←"
sideshow.setAttribute("class","side-arrow")
sidehidden.setAttribute("class","side-arrow")
sidehidden.style.left="254px";
sideshow.setAttribute("onclick","sideShow()")
sidehidden.setAttribute("onclick","sideHidden()")

avator=sidebar.appendChild(document.createElement("a"))
avator.href="./index.html"
avator.setAttribute('class','header-avator')
avator=avator.appendChild(document.createElement("img"))
avator.src="img/Tonjar.png"

headgroup=sidebar.appendChild(document.createElement("div"))
headgroup.setAttribute('class',"header-group")


head=headgroup.appendChild(document.createElement("h1"))
head.setAttribute('class',"header-author")
head=head.appendChild(document.createElement("a"))
head.innerHTML="Tonjar"
head.href="./index.html"

desp=headgroup.appendChild(document.createElement("p"))
desp.innerHTML=descripion
desp.setAttribute('style','margin: 30px 0px 0px 0px;font-size: small;color: #9b9b9b;')
ul=headgroup.appendChild(document.createElement("ul"))
ul.setAttribute('class',"header-menu");
kt=10;
for(var i=0;i<list.length;i++){
    var li=ul.appendChild(document.createElement("li"))
    var a=li.appendChild(document.createElement("a"))
    a.innerHTML=list[i];
    a.href=href[i];
}
if(level(sideshow.hashinfo)==(kt^8)){
    a=ul.appendChild(document.createElement("li")).appendChild(document.createElement("a"))
    a.innerHTML="新增博文"
    a.href="./edit.html"
}
UserPassword={}
if(getCookie('UserName')!=""){
    var user=headgroup.appendChild(document.createElement("p"))
    user.innerHTML="已登录为："+getCookie('UserName')+(level(getCookie("salt")+overlay.kindpassword)>0?"(权限用户)":" ")+(getCookie("UserEmail")!=""?getCookie("UserEmail"):"未注册邮箱");
    user.setAttribute('style','margin: 30px 0px 0px 0px;')

    var login=headgroup.appendChild(document.createElement("button"));
    login.innerHTML="logout"
    login.setAttribute('onclick',"javascript:setCookie('UserName','');location.reload();")
    login.setAttribute('class',"header-login")
    setCookie('UserName',getCookie('UserName'))
}
else{
    var login=headgroup.appendChild(document.createElement("button"));
    login.innerHTML="login"
    login.setAttribute('onclick',"javascript:f_login()")
    login.setAttribute('class',"header-login")
}
UserPassword.value=""

var f_login=function(){
    var loginbackgound=sidebar.parentElement.appendChild(document.createElement("div"))
    loginbackgound.setAttribute("style","background: #00000040;width: 100%;position: fixed;height: 100%;top: 0px;left: 0px;");
    var logintext=loginbackgound.appendChild(document.createElement("div"))
    logintext.setAttribute("class","login-text");
    logintext.appendChild(document.createElement("p")).innerHTML="在此设置你的昵称和联系邮箱。这些信息将用于评论时显示你的昵称。否则将显示为“匿名用户”<br>可以将邮箱设置为空。<br>请不要在昵称中使用特殊字符。昵称长度不能超过20个字符。<br>不检查邮箱格式。<br>"

    var logingroup=loginbackgound.appendChild(document.createElement("div"))
    logingroup.setAttribute("class","login-frame");
    var group1=logingroup.appendChild(document.createElement("div"))
    group1.setAttribute("style","position: relative;top: 70px;");
    group1.appendChild(document.createElement("label")).innerHTML="UserName:"
    UserName=group1.appendChild(document.createElement("input"))
    var group2=logingroup.appendChild(document.createElement("div"))
    group2.setAttribute("style","position: relative;top: 100px;");
    group2.appendChild(document.createElement("label")).innerHTML=" E-mail :"
    UserEmail=group2.appendChild(document.createElement("input"))
    var login_bt_ok=sidebar.parentElement.appendChild(document.createElement("button"))
    login_bt_ok.setAttribute("class","header-bt")
    login_bt_ok.setAttribute("onclick","javascript:km()")
    var login_bt_ok=logingroup.appendChild(document.createElement("button"))
    var login_bt_cancel=logingroup.appendChild(document.createElement("button"))
    login_bt_ok.setAttribute("style","position: absolute;bottom: 50px;left: 100px;");
    login_bt_cancel.setAttribute("style","position: absolute;bottom: 50px;left: 160px;");
    login_bt_ok.setAttribute("onclick","javascript:set_UserName();");
    login_bt_cancel.setAttribute("onclick","javascript:remove_login();");
    login_bt_ok.innerHTML="确认"
    login_bt_cancel.innerHTML="取消"
}

var remove_login=function(){
    sidebar.parentElement.removeChild(sidebar.parentElement.lastChild)
    sidebar.parentElement.removeChild(sidebar.parentElement.lastChild)
}
var set_UserName=function(){
    if(/[ ,$,!,@,#,$,%,^,&,*,(,),_,+,},|,",:,?,>{,<,\,,;,',.]/.test(UserName.value)||UserName.value.length==0||UserName.value.length>20){
        alert("检查UserName");
        return;
    }
    setCookie("UserName",UserName.value)
    if(UserEmail.value!="")
        setCookie("UserEmail",UserEmail.value)
    if(UserPassword.value!="")
        setCookie("UserPassword",UserPassword.value)
    location.reload()
}
var km=function(){
    kt--;
    if(kt!=0)return;
    UserPassword=sidebar.parentElement.lastElementChild.appendChild(document.createElement("input"))
}

window.addEventListener("resize", resizeMainPage, false);
function sideHidden(){
    mainpage.style.left="50px"
    sidebar.style.left="-270px";
    sidehidden.style.visibility="hidden"
    sideshow.style.visibility="";
    resizeMainPage(1)
}
function sideShow(){
    mainpage.style.left=""
    sidebar.style.left="20px";
    sidehidden.style.visibility=""
    sideshow.style.visibility="hidden";
    resizeMainPage(1)
}
if(window.innerWidth>1000)
    sideShow()
else
    sideHidden()

function resizeMainPage(x=0) {
    if(x!=1){
            mainpage.style.left=sidebar.style.left="";
    }
    if(sideshow.style.visibility=="hidden"&&window.innerWidth>1000)
        document.getElementById("mainpage").style.width=window.innerWidth-400+"px";
    else
        document.getElementById("mainpage").style.width=window.innerWidth-80+"px";
    if(x!=1){
        sidehidden.style.visibility=""
        sideshow.style.visibility="hidden";
        if(window.innerWidth<1000){
            sidehidden.style.visibility="hidden"
            sideshow.style.visibility="";
        }
    }

}

srolldiv=mainpage.parentElement.appendChild(document.createElement("div"))
srolldiv.setAttribute("class","sroll-contrainer");
sroll=srolldiv.appendChild(document.createElement("button"))
sroll.setAttribute("class","sroll-bt");
sroll.innerHTML="↑"
sroll.onclick=function(){
    window.scrollTo(window.scrollX,0)
}
window.onscroll=function(){
    if(window.scrollY>200){
        srolldiv.style.visibility="visible"
    }
    else
        srolldiv.style.visibility="hidden"
}


