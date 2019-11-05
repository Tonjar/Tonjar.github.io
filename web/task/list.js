topleftcol=mainpage.appendChild(document.createElement('div'))
topleftcol.setAttribute('class','topleftcol')
toprightcol=mainpage.appendChild(document.createElement('div'))
toprightcol.setAttribute('class','toprightcol')
bottomcol=mainpage.appendChild(document.createElement('div'))
bottomcol.setAttribute('class','bottomcol')

day=[]


s=body.appendChild(document.createElement('script'))
s.setAttribute('src','week.js')
s=body.appendChild(document.createElement('script'))
s.setAttribute('src','idea.js')
s=body.appendChild(document.createElement('script'))
s.setAttribute('src','gantt.js')



function set_list(){
    mainpage=document.getElementById("mainpage")
    list=mainpage.appendChild(document.createElement("div"))
    list.setAttribute("class","mainlist")
    left_list=list.appendChild(document.createElement("div"))
    left_list.setAttribute("class","leftcol")
    var today=new Date()
    var date=new Date(today-(-1000*3600*24*(7-today.getDay())))
    for(var i=0;i<7;i++){
        if(date.getDay()==today.getDay())
            date=today

        day.push(list.appendChild(document.createElement("div")))
        day[i].setAttribute("class","col")
        if(date.getDay()<today.getDay())
            day[i].style.background="#f2f2f2"
        var div=day[i].appendChild(document.createElement("div"))
        div.setAttribute("class","date")
        div.innerHTML="<p>"+(date.getMonth()+1)+"/"+date.getDate()+"</p>"
        date=new Date(date-(-1000*3600*24))
    }
    day.push(list.appendChild(document.createElement("div")))
    day[7].setAttribute("class","col")
    var div=day[i].appendChild(document.createElement("div"))
    div.setAttribute("class","date")
    div.innerHTML="<p>TODO_LIST</p>"
    day.push(list.appendChild(document.createElement("div")))
    day[8].setAttribute("class","col")
    day[8].style.width="10px"

    for(var i=6;i<24;i++){
        var p=left_list.appendChild(document.createElement("p"))
        p.innerHTML=i+":00";
        p.setAttribute("class","leftcol_time")

    }

}


testcase={
    'start_time':13,
    'last':2,
    'bg':'#fffff2',
    'text':'测试用例<br>13:00-15:00<br>地点',
    'day':0
}
var vl=[0,0,0,0,0,0,0,0]
function new_tast(task,i){
    var task_div=day[task['day']].appendChild(document.createElement("div"))
    task_div.setAttribute("class","task")
    var q=task_div.appendChild(document.createElement("input"))
    q.setAttribute("class","delate_task "+i)
    q.setAttribute("type","button")
    q.setAttribute("value","x")
    q.onclick=function(t){
        delete_task(parseInt(t.target.classList[1]))
    }
    var p=task_div.appendChild(document.createElement("p"))
    p.innerHTML=task['text'];
    task_div.style.top=(task['start_time']-6)*38-vl[task['day']]-15+'px';
    task_div.style.height=task['last']*38+'px';
    vl[task['day']]=vl[task['day']]+task['last']*38+2
    task_div.style.background=task['bg']
    return task_div;
}

function set_upate(){
    textbox=mainpage.appendChild(document.createElement("div"))
    textbox.setAttribute("class","textbox")
    textbox.setAttribute("contenteditable","true")

    textbox.textContent='{"start_time":9,"last":1,"bg":"#f1f1f1","text":"这个一个样例<br>","day":0}'
    submit=mainpage.appendChild(document.createElement("input"))
    submit.setAttribute("value","update")
    submit.setAttribute("type","button")


    errmsg=mainpage.appendChild(document.createElement("div"))
    errmsg.setAttribute("class","errmsg")
    textbox.addEventListener("input",convert)

    view_task=day[8].appendChild(document.createElement("div"))
    view_task.setAttribute("class","task")
    var q=view_task.appendChild(document.createElement("input"))
    q.setAttribute("class","delate_task")
    q.setAttribute("type","button")
    q.setAttribute("value","x")

    p=view_task.appendChild(document.createElement("p"))
    view_task.style.top='-200px';
    view_task.style.height='0px';

    submit.addEventListener("click",update)


}




function setmsg(x){
    errmsg.innerHTML="<p>"+x+"</p>"
}


function convert(){
    try{
        testcase=JSON.parse(textbox.textContent)
        setmsg("ok!")
    }
    catch{
        setmsg("input error")
        return false;
    }
    var str=[['start_time','last','day'],['bg','text']]
    for(var i=0;i<str[0].length;i++){
        if(testcase[str[0][i]]==undefined||(typeof testcase[str[0][i]]!="number")){
            setmsg(str[0][i]+" should be a number")
            return false;
        }
    }
    for(var i=0;i<str[1].length;i++){
        if(testcase[str[1][i]]==undefined||(typeof testcase[str[1][i]]!="string")){
            setmsg(str[1][i]+" should be a string")
            return false;
        }
    }
    view(testcase)
    return true;
}



function view(task){
    view_task.style.top=(task['start_time']-6)*38+14+'px'
    view_task.style.height=task['last']*38+'px';
    view_task.style.left=-1009-144+task['day']*144+"px"
    view_task.style.background=task['bg']
    view_task.children[1].innerHTML=task['text']
}

if(location.host=="tonjar.github.io"){

var APp_ID = 'Dc3PSs8jzsq39yYivB1XQlDi-MdYXbMMI';
var APp_KEY = 'hOwNUdXO7faFRSPSrAqsb7cP';

AV.init({
    appId: APp_ID,
    appKey: APp_KEY
});
tasks=AV.Object.extend("tasks")

}
task_inf=[]

function get_all(){
    var query=new AV.Query('tasks')
    query.notEqualTo("deleted","true")
    query.find().then(
        function(ts){
            for(var i=0;i<ts.length;i++){
                var str=ts[i].attributes.info
                task_inf.push([new_tast(JSON.parse(str),task_inf.length),ts[i]])
            }
        },
        function(error){
            alert(error)
        }
    )
}

function delete_task(i){
    task_inf[i][0].style.visibility="hidden"
    task_inf[i][1].save({
            "deleted":"true"
            })
}


function update(){
    if(convert()==false)return false;
    task=new tasks()
    task.save({
        "info":textbox.textContent
            })
    task_inf.push([new_tast(testcase,task_inf.length),task])
    setmsg("success")
}




