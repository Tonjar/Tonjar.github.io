day=[]
start_day=undefined
now_start_day=undefined
var vl=[-190,-190,-190,-190,-190,-190,-190,-190]
earest_day=undefined

week_div=topleftcol
view_task_div=document.createElement("div")
view_task_div.setAttribute("class","task")
view_task_text=view_task_div.appendChild(document.createElement("div"))
view_task_text.setAttribute("class","task_msg")
view_task_div.style.width="124px"
view_task_div.style["border-left"]="2px solid white"

tasks=[] //[ [sunday_date,[0,1,2...6]],[ ,[[],[],[],...,[]]]  ]
tasks_l=AV.Object.extend("tjtasks")

function set_list(){
    list=week_div.appendChild(document.createElement("div"))
    list.setAttribute("class","mainlist")
    left_list=list.appendChild(document.createElement("div"))
    left_list.setAttribute("class","leftcol")
    today=new Date(new Date().toISOString().substr(0,10))
    var date=new Date(today-(-1000*3600*24*(-today.getDay())))
    start_day=date
    now_start_day=date
    earest_day=today
    for(var i=0;i<7;i++){
        day.push(list.appendChild(document.createElement("div")))
        day[i].setAttribute("class","col")
        if(date<today)
            day[i].style.background="#f5f5f5"
        var div=day[i].appendChild(document.createElement("div"))
        div.setAttribute("class","date")
        div.innerHTML="<p>"+date.toJSON().substr(0,10)+"</p>"
        date=new Date(date-(-1000*3600*24))
    }
    day.push(list.appendChild(document.createElement("div")))
    day[7].setAttribute("class","col")
    day[7].style.width="10px"

    var control_panel=left_list.appendChild(document.createElement("div"))
    control_panel.setAttribute("class","control_panel")

    last_week=control_panel.appendChild(document.createElement("input"))
    last_week.setAttribute("value","<")
    last_week.setAttribute("type","button")
    last_week.style.display="inline-block"
    last_week.onclick=function(){
        if(start_day<earest_day)return;
        start_day=new Date(start_day-(1000*3600*24*7))
        set_date();
    }
    this_week=control_panel.appendChild(document.createElement("input"))
    this_week.setAttribute("value","今天")   
    this_week.setAttribute("type","button")
    this_week.style.display="inline-block"
    this_week.onclick=function(){
        start_day=now_start_day
        set_date();
    }
    next_week=control_panel.appendChild(document.createElement("input"))
    next_week.setAttribute("value",">")
    next_week.setAttribute("type","button")
    next_week.style.display="inline-block"
    next_week.onclick=function(){
        start_day=new Date(start_day-(-1000*3600*24*7))
        set_date();
    }

    for(var i=6;i<24;i++){
        var p=left_list.appendChild(document.createElement("p"))
        p.innerHTML=i+":00";
        p.setAttribute("class","leftcol_time")
    }
}

function set_date(){
    vl=[-190,-190,-190,-190,-190,-190,-190,-190]
    var date=start_day
    var k=0
    for(;k<tasks.length;k++){
        if(tasks[k][0]==date.toString())break;
    }
    for(var i=0;i<7;i++){
        day[i].children[0].children[0].innerHTML=date.toJSON().substr(0,10)
        if(date<today)
            day[i].style.background="#f5f5f5"
        else
            day[i].style.background=""
        date=new Date(date-(-1000*3600*24))
        while(day[i].children.length>1){
            day[i].removeChild(day[i].lastChild)
        }
        if(k<tasks.length){
            for(var j=0;j<tasks[k][1][i].length;j++){
                day[i].appendChild(tasks[k][1][i][j][0])
                vl[i]=vl[i]-tasks[k][1][i][j][0].offsetHeight
            }
        }
    }
}

set_list();

function view_task(date,msg,st,et,color){
    if(date<today){
        quxiao_view();
        return;
    }
    var i=date.getDay()
    var stt=new Date(date-(-1000*3600*24*(-date.getDay())))
    if(stt.toString()!=start_day.toString()){
        start_day=stt;
        set_date()
    }
    day[i].appendChild(view_task_div)
    view_task_text.innerHTML=msg;
    view_task_div.style.top=vl[i]+st*30+"px"
    view_task_div.style.height=(et-st)*30+"px"
    view_task_div.style.background=color
}


function show_task(i,msg,st,et,color,id_d){
    if(view_task_div.parentNode!=null){
        view_task_div.parentNode.removeChild(view_task_div)
    }
    var task_div=day[i].appendChild(document.createElement("div"))
    task_div.setAttribute("class","task")
    task_div.ondblclick=function(e){
        var a=e.target;
        if(a.className!="task")a=a.parentNode
        a.setAttribute("class",a.className+" hidden")
        var it=a.id.split("_")
        tasks[it[1]][1][it[2]][it[3]][1].save({"deleted":"true"})
    }
    task_div.innerHTML="<div class='task_msg'>"+msg+"</div>"
    task_div.style.top=vl[i]+st*30+"px"
    task_div.style.height=(et-st)*30+"px"
    task_div.style.background=color
    vl[i]=vl[i]-task_div.offsetHeight;
    task_div.id="task"+id_d
    return task_div
}

function add_new_task(date,msg,st,et,color){
    if(date<today){
        quxiao_view();
        return;
    }
    var stt=new Date(date-(-1000*3600*24*(-date.getDay())))
    flag=0;
    for(var i=0;i<tasks.length;i++){
        if(tasks[i][0]==stt.toString()){
            flag=1;
            
            var new_task=new tasks_l()
            new_task.save({
                "msg":msg,
                "date":date,
                "st":st,
                "et":et,
                "color":color
            })
            tasks[i][1][date.getDay()].push([show_task(date.getDay(),msg,st,et,color,"_"+i+"_"+date.getDay()+"_"+tasks[i][1][date.getDay()].length),new_task])
            break;
        }
    }
    if(flag==0){
        
        tasks.push([stt.toString(),[[],[],[],[],[],[],[]]])
        var new_task=new tasks_l()
        new_task.save({
            "msg":msg,
            "date":date,
            "st":st,
            "et":et,
            "color":color
        })
        tasks[tasks.length-1][1][date.getDay()].push([show_task(date.getDay(),msg,st,et,color,"_"+(tasks.length-1)+"_"+date.getDay()+"_"+0),new_task])
    }
}



function get_all(){
    var query=new AV.Query('tjtasks')
    query.notEqualTo("deleted","true")
    query.find().then(
        function(ts){
            for(var I=0;I<ts.length;I++){
                var date=ts[I].attributes.date;
                var msg=ts[I].attributes.msg;
                var st=ts[I].attributes.st;
                var et=ts[I].attributes.et;
                var color=ts[I].attributes.color;
                var stt=new Date(date-(-1000*3600*24*(-date.getDay())))
                start_day=stt;
                set_date();
                flag=0;
                if(earest_day>date)earest_day=date;
                for(var i=0;i<tasks.length;i++){
                    if(tasks[i][0]==stt.toString()){
                        flag=1;
                        tasks[i][1][date.getDay()].push([show_task(date.getDay(),msg,st,et,color,"_"+i+"_"+date.getDay()+"_"+tasks[i][1][date.getDay()].length),ts[I]])
                        break;
                    }
                }
                if(flag==0){
                    tasks.push([stt.toString(),[[],[],[],[],[],[],[]]])
                    tasks[tasks.length-1][1][date.getDay()].push([show_task(date.getDay(),msg,st,et,color,"_"+(tasks.length-1)+"_"+date.getDay()+"_"+0),ts[I]])
                }
            }
            start_day=now_start_day
            set_date()
        },
        function(error){
            alert(error)
        }
    )

}

function quxiao_view(){
    if(view_task_div.parentNode!=null){
        view_task_div.parentNode.removeChild(view_task_div)
    }
}

get_all()
