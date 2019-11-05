
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