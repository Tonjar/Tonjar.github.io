idea_div=toprightcol
ideas=[]


color_div=idea_div.appendChild(document.createElement('div'))
color_div.setAttribute('class','idea_color_div')

ideas_l=AV.Object.extend("tjideas")

setting_idea_error=3
setting_i=0;

for(var i=0;i<ideacolors.length;i++){
    var c=color_div.appendChild(document.createElement('div'))
    c.setAttribute('class','small_color')
    c.style.background=ideacolors[i];
    c.onclick=function(e){
        selected_color_text.innerText=e.target.style.background
        selected_color.style.background=e.target.style.background
        display_idea_card.style.background=e.target.style.background
        try_view()    
    }
}

selected_color_div=idea_div.appendChild(document.createElement('div'))
selected_color_div.setAttribute('class','selected_color_div')
selected_color=selected_color_div.appendChild(document.createElement('div'))
selected_color.setAttribute('class','small_color')
selected_color.style.background=ideacolors[0]
selected_color_text=selected_color_div.appendChild(document.createElement('div'))
selected_color_text.setAttribute('class','selected_color_text')
selected_color_text.setAttribute("contenteditable","true")
selected_color_text.innerHTML=ideacolors[0]
selected_color_text.onkeydown=function(e){
    var a=e.target;
    if(e.code=='Space')return false;
    if(e.key=='Enter')return false;

}
selected_color_text.onkeyup=function(e){
    selected_color.style.background=selected_color_text.innerText
    display_idea_card.style.background=selected_color_text.innerText
    try_view()
}
idea_task_list=idea_div.appendChild(document.createElement('div'))
idea_task_list.setAttribute('class','idea_task_list')

idea_task_list_left=idea_task_list.appendChild(document.createElement('div'))
idea_task_list_left.setAttribute('class','idea_sublist')
idea_task_list_right=idea_task_list.appendChild(document.createElement('div'))
idea_task_list_right.setAttribute('class','idea_sublist')

add_new_idea=idea_task_list_left.appendChild(document.createElement('div'))
add_new_idea.setAttribute('class','idea_card add_new_idea')
add_new_idea.appendChild(document.createElement('p')).innerHTML="还想做什么呢？"
add_new_idea.onclick=function(){
    if(add_new_idea.innerHTML!="<p>还想做什么呢？</p>")return;
    add_new_idea.setAttribute('contenteditable',"true");
    add_new_idea.innerHTML=""
    add_new_idea.focus()
}

add_new_idea.onblur=function(){
    if(/^( |<br>|&nbsp;)*$/.test(add_new_idea.innerHTML)==false){
        var new_idea=new ideas_l()
        new_idea.save({
            "msg":add_new_idea.innerHTML.toString(),
            "color":selected_color_text.innerText
        })
        add_new_idea_div(add_new_idea.innerHTML.toString(),selected_color_text.innerText,new_idea);
    }
    add_new_idea.setAttribute('contenteditable','false')
    add_new_idea.innerHTML="<p>还想做什么呢？</p>"
}


function add_new_idea_div(msg,color,new_idea){
    idea_task_list.appendChild(add_new_idea)
    var idea=document.createElement('div')
    idea.setAttribute("class","idea_card")
    idea.innerHTML=msg
    idea.style.background=color
    idea.id="idea"+ideas.length;
    ideas[ideas.length]=[idea,new_idea]
    if(idea_task_list_left.offsetHeight>idea_task_list_right.offsetHeight)
    idea_task_list_right.appendChild(idea)
    else{
        idea_task_list_left.appendChild(idea)
    }
    if(idea_task_list_left.offsetHeight>idea_task_list_right.offsetHeight)
    idea_task_list_right.appendChild(add_new_idea)
    else{
        idea_task_list_left.appendChild(add_new_idea)
    }

    idea.setAttribute('contenteditable',"true");
    idea.style.outline="none"

    idea.onblur=function(e){
        e.target.style.border=""
        save_idea(e.target.id.substr(4,200))
    }
    idea.onkeydown=function(e){
        e.target.style.border="1px solid";
    }
    idea.ondblclick=function(e){
        var a=e.target;
        display_idea_card.innerHTML=a.innerHTML
        display_idea_card.style.background=a.style.background
        idea_setting_div.setAttribute("class","idea_setting_div")
        setting_i=e.target.id.substr(4,200)
    }

}

idea_setting_div=idea_div.appendChild(document.createElement("div"))
idea_setting_div.setAttribute("class","idea_setting_div hidden")
display_idea_card=idea_setting_div.appendChild(document.createElement("div"))
display_idea_card.setAttribute("class","idea_card")
display_idea_card.setAttribute('contenteditable',"true");
display_idea_card.onkeyup=function(){
    try_view()
}

idea_control_panel=idea_setting_div.appendChild(document.createElement("div"))
idea_control_panel.setAttribute("class","idea_panel")
idea_setting_time=idea_setting_div.appendChild(document.createElement("p"))
idea_setting_time.innerText="时间"
idea_setting_time_input=idea_setting_div.appendChild(document.createElement("input"))
idea_setting_time_input.onkeyup=function(e){
    if(/^[012]{0,1}[0-9]:[0-6][0-9]-[012]{0,1}[0-9]:[0-6][0-9]$/.test(e.target.value)==false){
        setting_idea_error=setting_idea_error|1;
        idea_setting_time_input.style.color="red"
    }
    else{
        var nums=e.target.value.split(":")
        var st_h=parseInt(nums[0])
        var st_m=parseInt(nums[1].split("-")[0])
        var et_h=parseInt(nums[1].split("-")[1])
        var et_m=parseInt(nums[2])
        var st=st_h+st_m/60
        var et=et_h+et_m/60
        if(st_m>=60||et_m>=60||st>=23||st<=5.5||et<=5.5||et>=23||et<=st+0.5){
            setting_idea_error=setting_idea_error|1;
            idea_setting_time_input.style.color="red"
        }
        else{
            setting_idea_error=setting_idea_error&2;
            idea_setting_time_input.style.color=""
            if(e.key=="Enter"){
                idea_setting_add_in_week.onclick();
            }
        }

    }
    try_view()

}
idea_setting_date=idea_setting_div.appendChild(document.createElement("p"))
idea_setting_date.innerText="日期"
idea_setting_date_input=idea_setting_div.appendChild(document.createElement("input"))
idea_setting_date_input.onkeyup=function(e){
    if(/^20[1-9][0-9]-[0-9]{2}-[0-9]{2}$/.test(idea_setting_date_input.value)){
        var date=new Date(idea_setting_date_input.value)
        if(isNaN(date.getDate())){
            setting_idea_error=setting_idea_error|2;
            idea_setting_date_input.style.color="red"
        }
        else{
            setting_idea_error=setting_idea_error&1;
            idea_setting_date_input.style.color=""
            if(e.key=="Enter"){
                idea_setting_add_in_week.onclick();
            }
        }
    }
    else{
        setting_idea_error=setting_idea_error|2;
        idea_setting_date_input.style.color="red"
    }

    try_view()
}

idea_setting_add_in_week=idea_control_panel.appendChild(document.createElement("input"))
idea_setting_add_in_week.setAttribute("class","idea_panel_bt")
idea_setting_add_in_week.setAttribute("type","button")
idea_setting_add_in_week.setAttribute("value","加入计划")
idea_setting_add_in_week.onclick=function(e){
    if(setting_idea_error==0){
        var date=new Date(idea_setting_date_input.value)
        var nums=idea_setting_time_input.value.split(":")
        var st_h=parseInt(nums[0])
        var st_m=parseInt(nums[1].split("-")[0])
        var et_h=parseInt(nums[1].split("-")[1])
        var et_m=parseInt(nums[2])
        var st=st_h+st_m/60
        var et=et_h+et_m/60
        add_new_task(date,display_idea_card.innerHTML.toString(),st,et,display_idea_card.style.background)
    }
}


idea_setting_delete=idea_control_panel.appendChild(document.createElement("input"))
idea_setting_delete.setAttribute("class","idea_panel_bt")
idea_setting_delete.setAttribute("type","button")
idea_setting_delete.setAttribute("value","删除")
idea_setting_delete.style.color="red"
idea_setting_delete.onclick=function(){
    idea_setting_div.setAttribute("class","idea_setting_div hidden")
    a=ideas[setting_i][0]
    a.parentNode.removeChild(a);
    add_new_idea.parentNode.removeChild(add_new_idea)
    if(idea_task_list_left.offsetHeight>idea_task_list_right.offsetHeight)
    idea_task_list_right.appendChild(add_new_idea)
    else{
        idea_task_list_left.appendChild(add_new_idea)
    }
    ideas[setting_i][1].save({
        "deleted":"true"
    })
    quxiao_view();
}
// idea_setting_quxiao=idea_control_panel.appendChild(document.createElement("input"))
// idea_setting_quxiao.setAttribute("class","idea_panel_bt")
// idea_setting_quxiao.setAttribute("type","button")
// idea_setting_quxiao.setAttribute("value","取消")
idea_setting_comfirm=idea_control_panel.appendChild(document.createElement("input"))
idea_setting_comfirm.setAttribute("class","idea_panel_bt")
idea_setting_comfirm.setAttribute("type","button")
idea_setting_comfirm.setAttribute("value","确认")
idea_setting_comfirm.onclick=function(){
    idea_setting_div.setAttribute("class","idea_setting_div hidden")
    ideas[setting_i][0].style.background=display_idea_card.style.background;
    ideas[setting_i][0].innerHTML=display_idea_card.innerHTML;
    save_idea(setting_i)
    quxiao_view();
}


function try_view(){
    if(setting_idea_error==0){
        var date=new Date(idea_setting_date_input.value)
        var nums=idea_setting_time_input.value.split(":")
        var st_h=parseInt(nums[0])
        var st_m=parseInt(nums[1].split("-")[0])
        var et_h=parseInt(nums[1].split("-")[1])
        var et_m=parseInt(nums[2])
        var st=st_h+st_m/60
        var et=et_h+et_m/60
        view_task(date,display_idea_card.innerHTML.toString(),st,et,display_idea_card.style.background)
    }
}


function save_idea(i){
    ideas[i][1].save({
        "msg":ideas[i][0].innerHTML.toString(),
        "color":ideas[i][0].style.background
    })
}

function get_all_idea(){
    var query=new AV.Query("tjideas")
    query.notEqualTo("deleted","true")
    query.find().then(
        function(ts){
            for(var i=0;i<ts.length;i++){
                add_new_idea_div(ts[i].attributes.msg,ts[i].attributes.color,ts[i])
            }
        },
        function(err){
            console.log(err)
        }
    )
}

get_all_idea();