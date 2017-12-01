var global1=1;

$( document ).ready(function() {
    //Links: items / tosBisLists
    console.log( "ready!" );
    cacheCheck();
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
    $('#raidWrapper').hide(200);
    $('#optWrapper').show(200);
    if (r.localeCompare("abt")===0){
        
    }else if(r.localeCompare("tos")===0){
        
    }
}