topleftcol=mainpage.appendChild(document.createElement('div'))
topleftcol.setAttribute('class','topleftcol')
toprightcol=mainpage.appendChild(document.createElement('div'))
toprightcol.setAttribute('class','toprightcol')
bottomcol=mainpage.appendChild(document.createElement('div'))
bottomcol.setAttribute('class','bottomcol')
if(IsPC()==false){
    mainpage.setAttribute("class","phone_mainpage mainpage")
}
s=body.appendChild(document.createElement('script'))
s.setAttribute('src','week.js')
s=body.appendChild(document.createElement('script'))
s.setAttribute('src','idea.js')
s=body.appendChild(document.createElement('script'))
s.setAttribute('src','gantt.js')


