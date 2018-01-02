var wowClasses=["Death Knight","Demon Hunter","Druid","Hunter","Mage","Monk","Paladin","Priest","Rogue","Shaman","Warlock","Warrior"];
var classColors=["#C41F3B","#A330C9","#FF7D0A","#ABD473","#69CCF0","#00FF96","#F58CBA","#FFFFFF","#FFF569","#0070DE","#9482C9","#C79C6E"];
var classColorsF=["#ee91a0","#d398e6","#ffbb80","#c5e19d","#8bd8f4","#80ffca","#f9b9d4","#D7CCC8","#fff780","#80bfff","#b3a6d9","#dbc0a3"];
var classColorsB=["#fce9ec","#edd6f5","#ffe4cc","#e8f3d8","d1effa","#ccffea","#fbd0e3","#FFFFFF","#fffccc","#cce6ff","#e0dbf0","#f1e6da"];
var specsID=[ ["250","251","252"],["577","581"],["105","104","103","102"],["253","254","255"],["62","63","64"],["268","269","270"],
             ["65","66","70"],["256","257","258"],["259","260","261"],["262","263","264"],["265","266","267"],["71","72","73"]];

var specs=[ ["Blood","Frost","Unholy"],["Havoc","Vengeance"],["Restoration","Guardian","Feral","Balance"],["Beast Mastery","Marksmanship","Survival"],
           ["Arcane","Fire","Frost"],["Brewmaster","Mistweaver","Windwalker"],["Holy","Protection","Retribution"],["Discipline","Holy","Shadow"],
           ["Assassination","Outlaw","Subtlety"],["Elemental","Enhancement","Restoration"],["Affliction","Demonology","Destruction"],
           ["Arms","Fury","Protection"]];

var bisId=["Helm","Neck","Shoulders","Cloak","Chest","Bracers","Gloves","Belt","Legs","Boots","Ring1","Ring2","Trinket1","Trinket2",
           "Relic1","Relic2","Relic3"];

var tosBisList=[];
var itemsList=[];
var specID="";

$( document ).ready(function() {
    //Links: items / tosBisLists
    loadJSON(['https://api.myjson.com/bins/wtq3v','https://api.myjson.com/bins/x53tv']);
});


function addClickFunction(){

    //Spec selector for BiS List:
    $("#classSelect").change(function(){
        populateSpecSelect($(this).val());                           
    });
    
    //Fetch the BiS List
    $('#bisFetch').click(function(){
        //Clear the hrefs in the text fields:
        for (var i=0;i<bisId.length;i++){
            $("#bis"+bisId[i]+"Text").empty();
        }
        $("#loadDisplay").css("display","none");
        $("#bisWrapper").show(200);
        $('#bisTableHolder').show(200);
        $('#bisRelicTableHolder').show(200);
        populateBiS();
    });   
}

function populateSpecSelect(val){
    var select = document.getElementById("specSelect");
    select.options.length=0;

    for (i=0;i<specs[val].length;i++){
        var option = document.createElement("option");
        option.value=i;
        option.text = specs[val][i];
        select.add(option, -1);
    }
}

function loadJSON(links){
    //Items list
    
    var requestURL = links[0];
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    
    request.responseType = 'json';
    request.send();
    
    request.onload = function() {
        itemsList = Array.from(request.response);
    };
    
    var requestURL2 = links[1];
    var request2 = new XMLHttpRequest();
    request2.open('GET', requestURL2);
    
    request2.responseType = 'json';
    request2.send();
    
    request2.onload = function() {
        tosBisList = Array.from(request2.response);
        $("#loaderWrapper").fadeTo(400,0,function(){
            $("#loaderWrapper").css("display","none");
            $("#bisWrapper").fadeTo(400,1);
            addClickFunction();
        });
        
    };
    
}

function populateBiS(){
    var selVal=[ $("#classSelect").val(), $("#specSelect").val() ];
    specID=specsID[$("#classSelect").val()][$("#specSelect").val()];
    
    $(".cardHeader").css("background-color",classColors[selVal[0]]);
    $(".cardFooter").css("background-color",classColorsF[selVal[0]]);
    $(".cardBlock").css("background-color",classColorsB[selVal[0]]);

    //Fetch the selected Spec Bis List:
    var found=false;
    var selectedBisList=[];
    for (i=0;i<tosBisList.length;i++){
        if ( tosBisList[i].class.localeCompare(wowClasses[selVal[0]])===0 && tosBisList[i].spec.localeCompare(specs[selVal[0]][selVal[1]])===0 ){
            selectedBisList=$.extend(true,{}, tosBisList[i]);
            found=true;
            break;
        }
    }
    //If the spec is not available, place an error message:
    if (found === false){
        console.log("Spec not yet available!");
    }
    //Fetch all items for bis list:
    console.log(selectedBisList);
    for (var key in selectedBisList){
        if (selectedBisList.hasOwnProperty(key) && key!="class"  && key!="spec" && key!="classType" && key!="note1" && key!="note2" && key!="note3" && key!="relicType1" && key!="relicType2" && key!="relicType3"){
            console.log(key);
            var sId=key.toString().replace(/\b\w/g, l => l.toUpperCase());
            var id=["#bis"+sId+"Pic","#bis"+sId+"Text","#bis"+sId+"Footer"];
            var pieceId=selectedBisList[key];
            console.log(id);
            console.log(pieceId);
            for (var j=0;j<itemsList.length;j++){
                if (pieceId==itemsList[j].itemID){
                    $(id[2]).text(itemsList[j].bossDrop);
                    $(id[1]).append("<a href='http://www.wowhead.com/item="+pieceId+"&spec="+specID+"'>"+itemsList[j].name+"</a>");

                    var pos=itemsList[j].spriteSheet.split(",");
                    $(id[0]).css("background-position",(pos[1]*-28).toString()+"px "+(pos[0]*-28).toString()+"px");  
                    break;
                }
            }
        }     
    }


}