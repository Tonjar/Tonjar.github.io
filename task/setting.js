



bgcolor=[
    "#ffb3a7","#f47983","#ef7a82","#faff72","#eaff56","#ffa631",
    "#a4e2c6","#afdd22","#e0eee8","#a4e2c6","#7fecad","#b0a4e3",
    "#edd1d8","#d4f2e7","#d2f0f4","#e0f0e9","#f2ecde","#eedeb0"
]

ideacolors=[
    "#ffb3a7","#ec9190","#eaf1f1","#e2ffd5","#f3ecff","#efb4e3",
    "#ffd9d9","#afdd22","#e0eee8","#a4e2c6"
]





KEY_enpy={"!":"5","\"":"!","#":"X","$":"u","%":"d","&":"p","\'":"5","(":":",")":"p","*":"+","+":"O",",":"d","-":"{",".":"S","/":"%","0":"}","1":",","2":"T","3":"M","4":"#","5":"]","6":":","7":"V","8":">","9":"%",":":"g",";":"Q","<":";","=":"B",">":"G","?":"M","@":"Z","A":"r","B":"B","C":"r","D":"5","E":"d","F":"D","G":"z","H":"I","I":"9","J":"=","K":"3","L":"I","M":")","N":"H","O":"+","P":"-","Q":":","R":"H","S":"!","T":"d","U":"1","V":"\`","W":"b","X":"q","Y":"W","Z":"l","[":"S","\\":":","]":"4","^":",","_":"1","\`":"9","a":"D","b":"\'","c":"@","d":"I","e":".","f":"f","g":"!","h":"{","i":"v","j":"w","k":"a","l":"\"","m":"-","n":"g","o":"W","p":"x","q":"7","r":"2","s":"{","t":"a","u":"-","v":"h","w":"n","x":"_","y":"{","z":"u","{":"(","|":"F","}":"4"}


ID_p1={"!":"|","\"":"a","#":"!","$":"F","%":"j","&":"w","\'":"D","(":"W",")":"m","*":"S","+":"c",",":"d","-":"E",".":"n","/":"?","0":"1","1":"P","2":"g","3":"n","4":"[","5":"d","6":"}","7":"9","8":"#","9":"I",":":"c",";":"Z","<":"1","=":"h",">":"\`","?":"5","@":"y","A":"m","B":"$","C":"0","D":"&","E":"{","F":"O","G":"8","H":"f","I":"D","J":"r","K":"q","L":"a","M":"U","N":"2","O":"S","P":"A","Q":"n","R":"Z","S":"f","T":"8","U":"X","V":"y","W":"_","X":"A","Y":"r","Z":"A","[":"F","\\":"q","]":"E","^":"5","_":"Y","\`":"|","a":"L","b":"%","c":"9","d":"i","e":"|","f":"i","g":"\`","h":"_","i":"q","j":"\`","k":"\'","l":"1","m":"z","n":"b","o":"r","p":",","q":"F","r":"N","s":"|","t":"i","u":"n","v":"r","w":"\`","x":"_","y":"{","z":"5","{":"s","|":".","}":"+"}

ID_p2={"!":"N","\"":"+","#":"z","$":"b","%":"w","&":"8","\'":"(","(":"I",")":"0","*":"y","+":"C",",":"D","-":"f",".":"I","/":"?","0":"(","1":"-","2":"d","3":"L","4":"+","5":"U","6":"G","7":"U","8":"M","9":"k",":":"g",";":"b","<":"T","=":"c",">":"2","?":"d","@":"c","A":"c","B":"h","C":"3","D":"[","E":"^","F":"?","G":"q","H":"]","I":"<","J":"&","K":"x","L":"u","M":"g","N":"9","O":"*","P":";","Q":"9","R":"P","S":"i","T":"r","U":"_","V":">","W":"+","X":"D","Y":"4","Z":"Q","[":"2","\\":"l","]":"\\","^":"[","_":"p","\`":"d","a":"t","b":"]","c":"{","d":"7","e":"9","f":"E","g":"Q","h":"L","i":":","j":"b","k":"3","l":"I","m":"L","n":"7","o":"3","p":"Q","q":"2","r":":","s":"k","t":"|","u":"\'","v":"(","w":"e","x":"Q","y":"8","z":"9","{":"f","|":"H","}":"H"}


var APp_ID = create_str(e,ID_p1,759752277,23)+create_str(e,ID_p2,428698232,10)
var APp_KEY = create_str(e,KEY_enpy,826613728,22)+'cP';

AV.init({
    appId: APp_ID,
    appKey: APp_KEY
});