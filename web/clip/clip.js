leftcol=mainpage.appendChild(document.createElement('div'))
leftcol.setAttribute('class','leftcol')

rightcol=mainpage.appendChild(document.createElement('div'))
rightcol.setAttribute('class','rightcol')

add_list=mainpage.appendChild(document.createElement('button'))
add_list.setAttribute('class','add_list')
add_list.innerText="添加List"



add_list.onclick=function(e){
  var c=new clips()
  c.save({"name":"newlist"}).then(
    function(e){
      lists.push(["newlist",e.id,[],[]])
      putlists(lists.length-1)
    }
  )

}



lists=[]//[['name',id,[urllist],[tags]],[item2],...]

tagset={}

selected=[]

clips=AV.Object.extend('clips')


function fitter(){
  for(var i=0;i<lists.length;i++){
    var item=rightcol.children[i];
    if(item.className=='hidden')continue;
    var hide=0;
    for(var j=0;j<selected.length;j++){
      hide=1;
      for(var k=0;k<lists[i][3].length;k++){
        if(lists[i][3][k]==selected[j]){
          hide=0;
          break;
        }
      }
      if(hide==1)break;
    }
    if(hide==1)item.setAttribute('class','item hidden')
    else item.setAttribute('class','item')
  }
}

function puttags(tag){
  if(tagset[tag]==undefined){
    tagset[tag]=true;
    p=leftcol.appendChild(document.createElement('p'))
    p.innerHTML=tag
    p.setAttribute('class','tag')
    p.style.background=getcolor(tag,bgcolor)
    p.onclick=function(e){
      var p=e.target
      if(p.className=="tag"){
        p.setAttribute("class","tag selected")
        selected.push(p.innerText);
      }
      else{
        p.setAttribute("class","tag")
        for(var i=0;i<selected.length;i++){
          if(selected[i]==p.innerText){
            selected[i]=selected[selected.length-1];
            selected.pop();
            break;
          }
        }
      }
      fitter();
    }
  }
}



function putlists(i){
  if(i<0||i>lists.length)return;
  var item=rightcol.appendChild(document.createElement('div'))
  item.setAttribute('class','item')
  item.setAttribute('id',i)
  var name=item.appendChild(document.createElement('div'))
  name.setAttribute('class','item_name')
  name.setAttribute("contenteditable","true")
  name.onkeydown=function(e){
    var a=e.target;
    var i=a.parentNode.id
    if(e.key=='Space')return false
    if(e.key=='Enter'){
      a.setAttribute('class','item_name')
      lists[i][0]=a.innerText;
      var s=AV.Object.createWithoutData('clips', lists[i][1]);
      s.save({'name':lists[i][0]})
      return false;
    }
    a.setAttribute('class','item_name editing')  
  }
  name.onblur=function(e){
    var a=e.target;
    var i=a.parentNode.id;
    a.setAttribute('calss','item_name')
    a.innerText=lists[i][0]
  }
  name.innerText=lists[i][0]
  var bt=item.appendChild(document.createElement('p'))
  bt.setAttribute('class','bt_list')
  bt.innerHTML="X"
  bt.onclick=function(e){
    var item=e.target.parentNode;
    var i=item.id
    var s=AV.Object.createWithoutData('clips', lists[i][1]);
    s.save({'deleted':"True"})
    item.setAttribute('class','hidden')
  }
  var url_div=item.appendChild(document.createElement('div'))
  url_div.setAttribute('class','url_div')
  for(var j=0;j<lists[i][2].length;j++){
    var urld=url_div.appendChild(document.createElement('div'))
    var url=urld.appendChild(document.createElement('a'))
    urld.setAttribute('class','urld')
    url.setAttribute('class','url')
    url.setAttribute('target','_blank')
    url.setAttribute('href',lists[i][2][j])
    url.innerHTML=lists[i][2][j]
  }
  var urld=url_div.appendChild(document.createElement('div'))
  urld.setAttribute('class','urld')
  var input=urld.appendChild(document.createElement('input'))
  var submit=urld.appendChild(document.createElement('button'))
  submit.setAttribute('class','submit')
  submit.innerHTML="添加"
  submit.onclick=function(e){
    var url_div=e.target.parentNode.parentNode;
    var item=url_div.parentNode;
    var i=parseInt(item.id);
    var URL=url_div.lastChild.children[0].value
    url_div.lastChild.children[0].value=""
    lists[i][2].push(URL)
    var urld=url_div.appendChild(document.createElement('div'))
    var url=urld.appendChild(document.createElement('a'))
    urld.setAttribute('class','urld')
    url.setAttribute('class','url')
    url.setAttribute('target','_blank')
    url.setAttribute('href',URL)
    url.innerHTML=URL
    url_div.appendChild(url_div.children[url_div.children.length-2])
    var s=AV.Object.createWithoutData('clips', lists[i][1]);
    s.save({'urls':lists[i][2]})
  }
  var tag_div=item.appendChild(document.createElement('div'))
  tag_div.setAttribute('class','tag_div')
  for(var j=0;j<lists[i][3].length;j++){
    puttags(lists[i][3][j]);
    var p=tag_div.appendChild(document.createElement('p'))
    p.innerHTML=lists[i][3][j]
    p.setAttribute('class','tag')
    p.style.background=getcolor(lists[i][3][j],bgcolor)
    p.onclick=function(e){
      var p=e.target;
      var i=p.parentNode.parentNode.id;
      for(var j=0;j<lists[i][3].length;j++){
        if(lists[i][3][j]==p.innerText){
          lists[i][3][j]=lists[i][3][lists[i][3].length-1]
          lists[i][3].pop()
          break;
        }
      }
      p.parentNode.removeChild(p)
      var s=AV.Object.createWithoutData('clips', lists[i][1]);
      s.save({'tags':lists[i][3]})
    }
  }
  var add_tag=item.appendChild(document.createElement('div'))
  add_tag.setAttribute('class','add_tag')
  add_tag.innerText="添加标签"
  add_tag.setAttribute("contenteditable","true")
  add_tag.style.background=getcolor('添加标签',bgcolor)
  add_tag.onclick=function(){
    if(add_tag.innerText=="添加标签"){
      add_tag.innerText=""
    }
  }
  add_tag.onkeydown=function(e){
    var a=e.target
    var i=a.parentNode.id
    if(e.key=='Enter'){
      if(a.innerText!=""&&!(a.innerText in lists[i][3])){
        lists[i][3].push(a.innerText)
        var p=a.parentNode.children[3].appendChild(document.createElement('p'))
        p.innerHTML=a.innerText;
        p.setAttribute('class','tag')
        p.style.background=getcolor(a.innerText,bgcolor)
        var s=AV.Object.createWithoutData('clips', lists[i][1]);
        s.save({'tags':lists[i][3]})
        if(tagset[a.innerText]==undefined){
          puttags(a.innerText)
        }
      }
      a.id='0'
      return false;
    }
    a.id='1'
  }
  add_tag.onkeyup=function(e){
    var a=e.target
    if(a.id=='0'){
      a.innerText="添加标签"
      a.id='1'
    }
    a.style.background=getcolor(a.innerText,bgcolor)
  }
  add_tag.onblur=function(e){
    var a=e.target;
    a.innerText="添加标签"
    a.style.background=getcolor('添加标签',bgcolor)
    mainpage.focus();
  }
}

function getclips(){
  var query=new AV.Query('clips')
  query.notEqualTo('deleted','True')
  query.find().then(
    function(ts){
      for(var i=0;i<ts.length;i++){
        lists[i]=[ts[i].attributes.name,ts[i].id,ts[i].attributes.urls==undefined?[]:ts[i].attributes.urls,ts[i].attributes.tags==undefined?[]:ts[i].attributes.tags]

        putlists(i);
      }
    },
    function(error){
      console.log(error)
    }
  )
}

getclips();
