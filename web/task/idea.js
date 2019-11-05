idea_div=toprightcol

color_div=idea_div.appendChild(document.createElement('div'))
color_div.setAttribute('class','idea_color_div')

for(var i=0;i<ideacolors.length;i++){
    var c=color_div.appendChild(document.createElement('div'))
    c.setAttribute('class','small_color')
    c.style.background=ideacolors[i];
    c.onclick=function(e){
        console.log(e.target.style.background)
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

idea_task_list=idea_div.appendChild(document.createElement('div'))
idea_task_list.setAttribute('class','idea_task_list')

add_new_idea=idea_div.appendChild(document.createElement('div'))
add_new_idea.setAttribute('class','add_new_idea')

