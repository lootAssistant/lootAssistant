
$( document ).ready(function() {
    //Links: items / tosBisLists
    console.log( "ready!" );
    cacheCheck();
    addClickFunction();
});

function addClickFunction(){
    
    //Raid Selector brings the bis/lc option:
    //ToS hidden for now, while BiS is added:
    $("#tosSelect").click(function(){
        //Hide raid select:
        //handleRaidSelect("tos");
    });
    
    $("#abtSelect").click(function(){
        //Hide raid select:
        handleRaidSelect("abt");
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
        window.location.href = "lc.html";
    });
    
    //Strat Selector
    $("#stratSelect").click(function(){
        //Hide intro screen:
        $('#introScreen').hide(200);
        $('#bisWrapper').show(200);
        window.location.href = "antorusFights.html";
    });
    
    //Return button:
    $("#returnB").click(function(){
        $("#returnWrapper").fadeTo(400,0);
        $('#optWrapper').fadeTo(400,0,function(){
            $('#optWrapper').css("display","none");
            $("#returnWrapper").css("display","none");
            $('#raidWrapper').fadeTo(400,1); 
        }); 
        
    });
    
}

function cacheCheck(){
	// Check if a new cache is available on page load.
	window.addEventListener('load', function(e) {

	  window.applicationCache.addEventListener('updateready', function(e) {
		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		  // Browser downloaded a new app cache.
		  // Swap it in and reload the page to get the new hotness.
		  window.applicationCache.swapCache();
		  if (confirm('A new version of this site is available. Load it?')) {
			window.location.reload();
		  }
		} else {
		  // Manifest didn't changed. Nothing new to server.
		}
	  }, false);

	}, false);
}

function handleRaidSelect(r){
    $('#raidWrapper').fadeTo(400,0,function(){
        $('#raidWrapper').css("display","none");
        $('#optWrapper').fadeTo(400,1);
        $('#returnWrapper').fadeTo(400,1);
        if (r.localeCompare("abt")===0){
            sessionStorage.setItem('raid', 'abt');
        }else if(r.localeCompare("tos")===0){
            sessionStorage.setItem('raid', 'tos');
        }
    });
}