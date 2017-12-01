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
var global1=1;

var clickedTableElements=[];

$( document ).ready(function() {
    //Links: items / tosBisLists
    loadJSON(['https://api.myjson.com/bins/r1kwb',"https://api.myjson.com/bins/co1q3"]);
    console.log( "ready!" );
    addClickFunction();
    console.log(global1);
});



function addClickFunction(){
    
    //Raid Selector brings the bis/lc option:
    $("#tosSelect").click(function(){
        //Hide raid select:
        $('#raidWrapper').hide(200);
        $('#optWrapper').show(200);
        global1++;
        console.log(global1);
    });
    
    //Bis Selector
    $("#bisSelect").click(function(){
        //Hide intro screen:
        $('#introScreen').hide(200);
        $('#bisWrapper').show(200);
        window.location.href = "bislists.html";
    });
    
    $("#lcSelect").click(function(){
        //Hide intro screen:
        $('#introScreen').hide(200);
        $('#bossSelectorC').show(200);       
    });
        
    //Boss button for LC
    $(".bossButton").click(function(){
        populateTable($(this).attr("id"));
        $('#bossLootTableHolder').show(200);

    });
    
    //Spec selector for BiS List:
    $("#classSelect").change(function(){
        populateSpecSelect($(this).val());                           
    });
    
    //Fetch the BiS List
    $('#bisFetch').click(function(){
        populateBiS();
        $("#bisWrapper").show(200);
        $('#bisTableHolder').show(200);
        $('#bisRelicTableHolder').show(200);
    });
    
    //Reverse search for BiS:
    $('#bisReverse').click(function(){
       reverseSearch(); 
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
    };
    
}



function populateTable(id){
    // Clear the table
    $("#lootTable tr").remove();
    //SHow the table:
    clickedTableElements=[];
    // Fetch the loot:
    
    var loot=[];
    for (var i=0;i<itemsList.length;i++){
        if( itemsList[i].bossDrop.localeCompare(id)===0 && itemsList[i].type!==0){
            loot.push([itemsList[i].type,itemsList[i].name]);
        }
    }
    
    var gearTypeCheck=[0,0,0,0,0,0,0,0,0,0,0];
    var headers=["tp","Cloth","Leather","Mail","Plate","Cloak","Neck","Ring","Trinket","Relic","Tier"];
    
    //Check for gear types:
    for (i=0;i<loot.length;i++){
        gearTypeCheck[ loot[i][0] ]+=1;
    }
    gearTypeCheck[0]=0;
    
    var splicedHeaders=[];
    var gearType=[];
    for (i=0;i<gearTypeCheck.length;i++){
        if (gearTypeCheck[i]!==0){
            splicedHeaders.push(headers[i]);
            gearType.push(i);
        }
    }
    console.log(splicedHeaders);

    var table=document.getElementById("lootTable");
    //Add the headers:
    
    var row = table.insertRow(-1);
    for (i = 0; i < splicedHeaders.length; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = splicedHeaders[i];
        row.appendChild(headerCell);
    }
      
    var min=0; //Checks if it is a tier boss;
    //Add the data rows.
    var safe=0;
    while (loot.length>min) {
        row = table.insertRow(-1);
        for (i = 0; i < splicedHeaders.length; i++) {
            
            var found="";
            for (var j=0;j<loot.length;j++){
                
                if (loot[j][0]==gearType[i]){
                    found=loot[j][1];
                    loot.splice(j,1);
                    break;
                }
            }
            
            var cell=row.insertCell(-1);
            cell.innerHTML = found;
        }
        
        safe++;
        if (safe==50){
            console.log("YOU DUN FUCKED UP");
            break;
        }
    }
    
    $("#lootTable td").click(function(e){
        
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent());
        
        var prevI=-1;
        var prevClick=false;
        if (clickedTableElements.length>0){
            for (i=0;i<clickedTableElements.length;i++){
                if( clickedTableElements[i][0]==col && clickedTableElements[i][1]==row){
                    prevClick=true;
                    prevI=i;
                    break;
                }
            }            
        }
        
        if (prevClick){
            $(this).css("background-color","#070d20");
            clickedTableElements.splice(i,1);
        }else if(prevClick===false && clickedTableElements.length<6){
            $(this).css("background-color","#11204f");
            clickedTableElements.push([col,row,$(this).text()]);
        }
      
        //console.log($(this).text());
        console.log($(this).css("background-color"));
        e.stopPropagation();
        

        console.log('Row: ' + row + ', Column: ' + col);
    });
}

function reverseSearch(){
    $("#bossLootTableHolder").hide(100);
    $("#lootTable tr").remove();
    var holderHeight=100;
    
    //empty all previous tables:
    for (i=0;i<6;i++){
        $("#healerC"+i).empty();
        $("#dpsC"+i).empty();
        $("#tankC"+i).empty();
        $("#healerC"+i).append("<p class='reverseP reverseItemTitle'>Healer</p>");
        $("#dpsC"+i).append("<p class='reverseP reverseItemTitle'>DPS</p>");
        $("#tankC"+i).append("<p class='reverseP reverseItemTitle'>Tank</p>");
        $("#i"+i+"c").css("display","none");
    }
    
    //Check if tier was selected:
    var tierPieces=[];
    for (i=0;i<clickedTableElements.length;i++){
        
        for (j=0;j<itemsList.length;j++){
            if (clickedTableElements[i][2].localeCompare(itemsList[j].name)===0 && itemsList[j].type==10){
                //If one of the items is a tier piece, add all tier pieces from that boss to the list:
                var boss=itemsList[j].bossDrop;
                for (z=0;z<itemsList.length;z++){
                    if (boss.localeCompare(itemsList[z].bossDrop)===0 && itemsList[z].type===0){
                        tierPieces.push(itemsList[z].itemID);
                    }
                }
            }
        }
        
    }
    
    
    
    for (i=0;i<clickedTableElements.length;i++){
    
        var id=0;
        var iType=-1;
        //Search for items properties:
        for (j=0;j<itemsList.length;j++){
            if (clickedTableElements[i][2].localeCompare(itemsList[j].name)===0){
                id=itemsList[j].itemID;
                iType=itemsList[j].type;
                $("#i"+i+"t").text(itemsList[j].name);
                var pos=itemsList[j].spriteSheet.split(",");
                $("#i"+i+"i").css("background-position",(pos[1]*-28).toString()+"px "+(pos[0]*-28).toString()+"px");
                break;
            }
        }
        
        var revSpecs=[0,0,0];
        for (j=0;j<tosBisList.length;j++){
            for (z=0;z<bisId.length;z++){
                
                var compareIds=[];
                if(iType!=10){
                    compareIds=[id];
                }else{
                    compareIds=Array.from(tierPieces);
                }
                
                for (x=0;x<compareIds.length;x++){
                    if (tosBisList[j][bisId[z]]==compareIds[x]){
                            
                        //Find matching class
                        var c=0;
                        for (y=0;y<wowClasses.length;y++){
                            if(tosBisList[j].class.localeCompare(wowClasses[y])===0){
                                c=y;
                                break;
                            }
                        }
                        if (tosBisList[j].classType==2){
                            $("#healerC"+i).append("<p class='reverseP textShadow' style='color:"+classColors[c]+";'>"+tosBisList[j].spec+" "+tosBisList[j].class+"</p>");
                            revSpecs[2]++;
                        }else if(tosBisList[j].classType==1){
                            $("#dpsC"+i).append("<p class='reverseP textShadow' style='color:"+classColors[c]+";'>"+tosBisList[j].spec+" "+tosBisList[j].class+"</p>");
                            revSpecs[1]++;
                        }else if(tosBisList[j].classType===0){
                            $("#tankC"+i).append("<p class='reverseP textShadow' style='color:"+classColors[c]+";'>"+tosBisList[j].spec+" "+tosBisList[j].class+"</p>");
                            revSpecs[0]++;
                        }
                    }
                }
                

            }
        }
        
        var max=Math.max(revSpecs[0],revSpecs[1],revSpecs[2]);
        var itH=32+(max)*(10+22.4)+40+27.2;
        $("#i"+i+"c").css("height",itH);
        holderHeight+=itH;
        $("#i"+i+"c").css("display","block");
    
    }
    
    $("#riHolder").css("height",holderHeight);
    $("#riHolder").css("display","block");
}


