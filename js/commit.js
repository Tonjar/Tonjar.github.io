function apply_commit(){
    if(pagename==undefined){
        alert("cannot apply comment because of fail to find pagename")
        return;
    }
    commitarea=mainpage.appendChild(document.createElement("div"))
    commitarea.setAttribute("class","card commit")
    commitarea.appendChild(document.createElement("p")).innerHTML="评论";
    Commit=commitarea.appendChild(document.createElement("textarea"))
    Commit.setAttribute("class","makeCommits")
    bt_commit=commitarea.appendChild(document.createElement("button"))
    bt_commit.innerHTML="发布"
    bt_commit.style.margin="10px 0px"
    bt_commit.style.left="0px"
    bt_commit.style.top="-10px"
    bt_commit.setAttribute("class","commit-replay")
    bt_commit.onclick=function (e){
        var x=e.target.parentElement.children[1].value
        if(x.search(/^ *$/)==0||x=="不能发布空的消息"){
            e.target.parentElement.children[1].value="不能发布空的消息"
            return;
        }
        e.target.parentElement.children[1].value=""
        var comme=new AV.Object.extend("Comment")
        var cc=new comme();
        cc.save({
            "content":x,
            "userName":(getCookie("UserName")==""?"匿名用户":getCookie("UserName")),
            "Email":getCookie("UserEmail"),
            "pagename":pagename
                })

    }
    commitarea.appendChild(document.createElement("div")).setAttribute("class","bottom-dash"
)
    var Query_comment=new AV.Query("Comment")
    Query_comment.equalTo("pagename",pagename)
    Query_comment.find().then(function(comments){
        if(comments.length==0){
            commitarea.appendChild(document.createElement("p")).innerHTML="暂无评论";
        }
        else{
            commitarea.appendChild(document.createElement("p")).innerHTML=comments.length+"评论";
        }
        for(var i=comments.length-1;i>=0;i--){
            biuld_commit(commitarea,comments[i],i+1)
        }
        
    },function(error){
        commitarea.appendChild(document.createElement("p")).innerHTML="获取数据失败";
    })
}

testcase={}
testcase.attributes={}
testcase.attributes.content="##hello \n > mkie  \n $\\frac{1}{2}$ $$\frac{x^2_1}{x_0+x_i}$$"
testcase.attributes.userName="Tonjar"
testcase.attributes.Email="33@dd.com"
testcase.createdAt=new Date()



function biuld_commit(area,infos,low){
    var a=area.appendChild(document.createElement("div"))
    userinfo=a.appendChild(document.createElement("div"))
    commit_content=a.appendChild(document.createElement("div"))
    var l=userinfo.appendChild(document.createElement("p"))    
    var un=userinfo.appendChild(document.createElement("p"))
    var ut=userinfo.appendChild(document.createElement("p"))   
    var replay=userinfo.appendChild(document.createElement("button")) 
    l.innerHTML=low+"楼"
    un.innerHTML=infos.attributes.userName
    ut.innerHTML=infos.createdAt.toISOString().substring(0,infos.createdAt.toISOString().search(/T/))
    l.setAttribute("class","low")
    un.setAttribute("class","userName")
    ut.setAttribute("class","creattime")
    replay.innerHTML="回复"
    replay.setAttribute("class","commit-replay")
    replay.onclick=function(e){
        scrollTo(window.scrollX,bt_commit.parentElement.offsetTop)
        bt_commit.parentElement.children[1].value="@"+e.target.parentElement.children[1].innerHTML+" "+bt_commit.parentElement.children[1].value
    }
    commit_content.setAttribute("class","commit-area")
    markdown(commit_content,infos.attributes.content);
    a.setAttribute("class","bottom-dash")
}
    
