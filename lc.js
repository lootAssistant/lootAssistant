// 0 - Tier Piece, 1 - Cloth, 2 - Leather, 3 - Mail, 4 - Plate, 5 - Cloak, 6 - Neck, 7 - Ring, 8 - Trinket, 9 - Relic, 10 - Tier Token

var wowClasses=["Death Knight","Demon Hunter","Druid","Hunter","Mage","Monk","Paladin","Priest","Rogue","Shaman","Warlock","Warrior"];
var classColors=["#C41F3B","#A330C9","#FF7D0A","#ABD473","#69CCF0","#00FF96","#F58CBA","#FFFFFF","#FFF569","#0070DE","#9482C9","#C79C6E"];
var classColorsF=["#ee91a0","#d398e6","#ffbb80","#c5e19d","#8bd8f4","#80ffca","#f9b9d4","#D7CCC8","#fff780","#80bfff","#b3a6d9","#dbc0a3"];
var classColorsB=["#fce9ec","#edd6f5","#ffe4cc","#e8f3d8","d1effa","#ccffea","#fbd0e3","#FFFFFF","#fffccc","#cce6ff","#e0dbf0","#f1e6da"];


var specs=[ ["Blood","Frost","Unholy"],["Havoc","Vengeance"],["Restoration","Guardian","Feral","Balance"],["Beast Mastery","Marksmanship","Survival"],
           ["Arcane","Fire","Frost"],["Brewmaster","Mistweaver","Windwalker"],["Holy","Protection","Retribution"],["Discipline","Holy","Shadow"],
           ["Assassination","Outlaw","Subtlety"],["Elemental","Enhancement","Restoration"],["Affliction","Demonology","Destruction"],
           ["Arms","Fury","Protection"]];

var bisId=["helm","neck","shoulders","cloak","chest","bracers","gloves","belt","legs","boots","ring1","ring2","trinket1","trinket2",
           "relic1","relic2","relic3"];

var tosBisList=[];
var itemsList=[];

var tierSlot="";
var tierType=["Conqueror","Protector","Vanquisher"];
var tierCheck=false;
var tierDist=[ ["Paladin","Priest","Warlock","Demon Hunter"],["Warrior","Hunter","Shaman","Monk"],["Rogue","Death Knight","Mage","Druid"]];

var slots=["helm","neck","shoulders","cloak","chest","bracers","gloves","belt","legs","boots","ring","trinket","relic","tier"];

var clickedTableElements=[];

$( document ).ready(function() {
    //Links: items / abtBisLists / tosBisLists
    loadJSON(['https://api.myjson.com/bins/a8wub','https://api.myjson.com/bins/x53tv']);
});

function addClickFunction(){
     var bossID="";    
    //Boss button for LC
    $(".bossButton").click(function(){      
        populateTable($(this).attr("id"));
        bossID=$(this).attr("id");
        $("#buttonWrapper").css("display","block");
        $("#buttonWrapper").show(200);
    });
    
    //Reverse search for BiS:
    $('#bisReverse').click(function(){
       reverseSearch(bossID); 
    });
    
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
    
    requestURL = links[1];
    var request2 = new XMLHttpRequest();
    request2.open('GET', requestURL);
    
    request2.responseType = 'json';
    request2.send();
    
    request2.onload = function() {
        tosBisList = Array.from(request2.response);
        endLoading();
    };
    
}

function endLoading(){
    
    $("#loaderWrapper").fadeOut(800, function(){
    //$("#loaderWrapper").css("display","none");
    
        var globalRaid=sessionStorage.getItem('raid');
        //reset 2 displays:
        console.log(globalRaid);
        if (globalRaid=="abt"){
            $("#abtBossSelectorC").fadeIn(800);
        }else if(globalRaid=="tos"){
            $("#tosBossSelectorC").fadeIn(800);
        }else{
            $("#tosBossSelectorC").fadeIn(800);
        }
        
        addClickFunction();
    
    });
}



function populateTable(id){
    
    //Clear the table:
    $("#lootTable").empty();
    clickedTableElements=[];
    tierCheck=false;
    tierSlot="";
    var loot=[];
    var slotCount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    //fetch all items from the selected boss:
    for (i=0; i<itemsList.length;i++){
        if ( (itemsList[i].bossDrop).localeCompare(id)===0 && itemsList[i].tier==="0" && !((itemsList[i].bossDrop).localeCompare("Argus the Unmaker")===0 && itemsList[i].slot=="trinket") ){
            //2nd condition: Exclude the Argus trinkets
            loot.push(itemsList[i]);
            
            //Check if that slot exists on the table:
            for (j=0;j<slots.length;j++){
                if (slots[j].localeCompare(itemsList[i].slot)===0){
                    slotCount[j]++;
                }
            }
        }
        
        //Check if it is a tier boss:
        if ( (itemsList[i].bossDrop).localeCompare(id)===0 && itemsList[i].tier==="1" ){
            tierCheck=true;
            tierSlot=itemsList[i].slot;
        }
        
    }
    
    console.log(tierSlot);
    console.log(slots);
    console.log(slotCount);
    console.log(loot);
    
    var max = slotCount.reduce(function(a, b) {
        return Math.max(a, b);
    });
    console.log(max);
    
    //Create the matrix that will hold the table info:
    var rows=new Array(14);
    for (i=0;i<14;i++){
        rows[i]=new Array(max);
    }
    
    slotCount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (var i=0;i<loot.length;i++){       
        //Scan the loot for the matching slot:
        for (j=0;j<slots.length;j++){
            //Slot found:
            if (( slots[j].localeCompare(loot[i].slot))===0){
                rows[j][slotCount[j]]=loot[i].name;
                slotCount[j]++;
            }
        }
        
    }
    
    if (tierCheck){
        slotCount[13]=3;
    }
    
    console.log(rows);
    
    var x=0;//Tracks the slots;
    var w=0;
    var neR=0;//non-empty rows;
    for (i=0;i<slots.length;i++){
        
        //Check if slot has items:
        if (slotCount[i]>0){
            //Add the header:
            neR++;
            $('#lootTable').append("<div id='s"+x+"' class='slot'></div>");
            $('#s'+x.toString()).append("<div id='h"+x+"' class='header'>"+slots[i].toUpperCase()+"</div>");
            $('#s'+x.toString()).append("<div id='c"+x+"' class='slotC'></div>");
            
            //No top padding on the first slot:
            if (x===0){
                $('#s'+x.toString()).css("padding-top","0px");
            }
            
            
            //Add the items:
            if (i<13){
                for (j=0;j<slotCount[i];j++){
                    $('#c'+x.toString()).append("<div id='it"+w+"' class='item'>"+rows[i][j]+"</div>");
                    $('#it'+w.toString()).on("click",itemsClick);
                    w++;
                }
            }else{
                for (j=0;j<slotCount[i];j++){
                    $('#c'+x.toString()).append("<div id='it"+w+"' class='item'>"+tierType[j]+"</div>");
                    $('#it'+w.toString()).on("click",itemsClick);
                    w++;
                }
            }
            x++;
        }
    }
    
    $("#lootTable").hide();
    $("#lootTable").css("visibility","visible");
    $("#lootTable").show(200);
}


function itemsClick(){
    var item=$(this).text();
    
    var prevI=-1;
    var prevClick=false;
    //Check if the clicked item has been selected before:
    if (clickedTableElements.length>0){
        for (i=0;i<clickedTableElements.length;i++){
            if( clickedTableElements[i].localeCompare(item)===0){
                prevClick=true;
                prevI=i;
                break;
            }
        }            
    }
        
    if (prevClick){
        //Put the correct color back and remove the item from the list:
        $(this).css('color','white');           
        clickedTableElements.splice(i,1);
        
    }else if(prevClick===false && clickedTableElements.length<6){
        $(this).css("color","#284dbd");
        clickedTableElements.push($(this).text());
    }
}

function reverseSearch(bossID){

    $("#lootTable").hide(100);
    $("#buttonWrapper").hide(100);
    
    //empty all previous tables:
    for (i=0;i<6;i++){
        $("#healerC"+i).empty();
        $("#dpsC"+i).empty();
        $("#tankC"+i).empty();
        $("#healerC"+i).append("<p class='reverseP reverseItemTitle'>Healer</p>");
        $("#dpsC"+i).append("<p class='reverseP reverseItemTitle'>DPS</p>");
        $("#tankC"+i).append("<p class='reverseP reverseItemTitle'>Tank</p>");
        $("#i"+i+"c").css("visibility","hidden");
    }
    
    
    for (i=0;i<clickedTableElements.length;i++){
    
        var id=0;
        var tierCheck=false;
        var tierPieces=[];
        var cI=["#tankC","#dpsC","#healerC"];
        //Search for items properties:
        //Case for regular items vs tier:
        if ( clickedTableElements[i].localeCompare("Protector")===0 || clickedTableElements[i].localeCompare("Conqueror")===0 || clickedTableElements[i].localeCompare("Vanquisher")===0 ){
            //TIER
            tierCheck=true;
            $("#i"+i+"t").empty();
            $("#i"+i+"t").append("<a>"+clickedTableElements[i]+" Token - "+tierSlot[0].toUpperCase()+tierSlot.slice(1)+"</a>");
            //Add the tier pieces to the array:
            for (j=0;j<itemsList.length;j++){
                if (itemsList[j].bossDrop.localeCompare(bossID)===0 && itemsList[j].tier.localeCompare("1")===0){
                    //Add the correct tier pieces from the selected boss:
                    tierPieces.push(itemsList[j].itemID);
                }
            }
            
            
        }else{
            for (j=0;j<itemsList.length;j++){
                if (clickedTableElements[i].localeCompare(itemsList[j].name)===0){
                    id=itemsList[j].itemID;
                    $("#i"+i+"t").empty();
                    $("#i"+i+"t").append("<a href='http://www.wowhead.com/item="+itemsList[j].itemID+"'>"+itemsList[j].name+"</a>");                
                    var pos=itemsList[j].spriteSheet.split(",");
                    $("#i"+i+"i").css("background-position",(pos[1]*-28).toString()+"px "+(pos[0]*-28).toString()+"px");
                    break;
                }
            }
        }
        
        var revSpecs=[0,0,0];
        for (j=0;j<tosBisList.length;j++){
            var duplicateCheck=0;
            for (z=0;z<bisId.length;z++){
                
                var compareIds=[];
                if(tierCheck){
                    compareIds=Array.from(tierPieces);
                }else{                   
                    compareIds=[id];
                }
                
                for (x=0;x<compareIds.length;x++){
                    if (tosBisList[j][bisId[z]]==compareIds[x]){
                        console.log(duplicateCheck);
                        duplicateCheck++;
                        //Find matching class
                        var skip=false;
                        var c=0;
                        for (y=0;y<wowClasses.length;y++){
                            if(tosBisList[j].class.localeCompare(wowClasses[y])===0){                               
                                c=y;
                                var tClass=false;
                                if (tierCheck){
                                    //Find match for the tier token:
                                    for (k=0;k<tierType.length;k++){
                                        if (tierType[k].localeCompare(clickedTableElements[i])===0){
                                            break;
                                        }
                                    }
                                    //Find if the class fits on the tier distribution selected:
                                    for (l=0;l<tierDist[k].length;l++){
                                        if (tosBisList[j].class.localeCompare(tierDist[k][l])===0){
                                            console.log(tosBisList[j].class+" found in "+tierDist[k][l]);
                                            tClass=true;
                                            break;
                                        }
                                    }
                                }
                                if (tierCheck && !tClass){
                                    skip=true;
                                }
                                break;
                            }
                        }
                        
                        if (!skip && duplicateCheck===1){
                            if (tosBisList[j].classType==2){
                                $("#healerC"+i).append("<p class='reverseP textShadow' style='color:"+classColors[c]+";'>"+tosBisList[j].spec+" "+tosBisList[j].class+"</p>");
                                revSpecs[2]++;
                            }else if(tosBisList[j].classType==1){
                                $("#dpsC"+i).append("<p class='reverseP textShadow' style='color:"+classColors[c]+";'>"+tosBisList[j].spec+" "+tosBisList[j].class+"</p>");
                                revSpecs[1]++;
                            }else if(tosBisList[j].classType==="0"){
                                $("#tankC"+i).append("<p class='reverseP textShadow' style='color:"+classColors[c]+";'>"+tosBisList[j].spec+" "+tosBisList[j].class+"</p>");
                                revSpecs[0]++;
                            }                       
                        }
                        
                        if (!skip && duplicateCheck>1){
                            $(cI[tosBisList[j].classType]+i+" p").last().remove();
                            $(cI[tosBisList[j].classType]+i).append("<p class='reverseP textShadow' style='color:"+classColors[c]+";'>"+tosBisList[j].spec+" "+tosBisList[j].class+" (x2)"+"</p>");
                        }
                    }
                }
                

            }
        }
        
        //var max=Math.max(revSpecs[0],revSpecs[1],revSpecs[2]);
        for (k=0;k<revSpecs.length;k++){
            if (revSpecs[k]===0){
                $(cI[k]+i).append("<p class='reverseP textShadow' style='color: white'> - </p>");
            }
        }
        
        $("#i"+i+"c").css("visibility","visible");
        $("#i"+i+"c").css("display","block");
    
    }
    
    $("#riHolder").css("visibility","visible");
    $("#riHolder").show(100);
}


