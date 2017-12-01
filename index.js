var global1=1;

$( document ).ready(function() {
    //Links: items / tosBisLists
    console.log( "ready!" );
    addClickFunction();
    console.log(global1);
});

function addClickFunction(){
    
    //Raid Selector brings the bis/lc option:
    //ToS hidden for now, while BiS is added:
    /*$("#tosSelect").click(function(){
        //Hide raid select:
        handleRaidSelect("tos");
        global1++;
    });*/
    
    $("#abtSelect").click(function(){
        //Hide raid select:
        handleRaidSelect("abt");
        global1++;
    });
    
    //Bis Selector
    $("#bisSelect").click(function(){
        //Hide intro screen:
        $('#introScreen').hide(200);
        $('#bisWrapper').show(200);
        window.location.href = "bislists.html";
    });
    
    /*$("#lcSelect").click(function(){
        //Hide intro screen:
        $('#introScreen').hide(200);
        $('#bossSelectorC').show(200);       
    });*/
    
    //Strat Selector
    $("#stratSelect").click(function(){
        //Hide intro screen:
        $('#introScreen').hide(200);
        $('#bisWrapper').show(200);
        window.location.href = "antorusFights.html";
    });
    
}

function handleRaidSelect(r){
    $('#raidWrapper').hide(200);
    $('#optWrapper').show(200);
    if (r.localeCompare("abt")===0){
        
    }else if(r.localeCompare("tos")===0){
        
    }
}