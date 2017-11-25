var ids=["Garothi","Felhounds","HighCommand","Hasabel","Eonar","Imonar","Kingaroth","Varimathras","Coven","Aggramar","Argus"];
var shortName=["Garothi","Felhounds","High Command","Hasabel","Eonar","Imonar","Kin'garoth","Varimathras","Coven","Aggramar","Argus"];
var fullName=["Garothi Worldbreaker","Felhounds of Sargeras","Antoran High Command","Portal Keeper Hasabel","Eonar the Life-Binder",
              "Imonar the Soulhunter","Kin'garoth","Varimathras","The Coven of Shivarra","Aggramar","Argus the Unmaker"];
var sizes=[[80,250],[90,250],[130,300],[80,300],[60,300],[60,300],[90,100],[110,120],[50,300],[90,100],[50,200]];
var prevClick=-1;
var check=false;

$( document ).ready(function() {
    console.log( "ready!" );
    startSizing();
    addMouseOvers();
	cacheCheck()
});

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

function startSizing(){
    for (i=0;i<sizes.length;i++){
        $('#'+i).css("width",sizes[i][0]);
    }
    
    $("li a").hover(function(e) {
        if (prevClick!=$(this).attr("id")){
            $(this).css("background-color",e.type === "mouseenter"?"#266982":"transparent");
        }
    });
}

function addMouseOvers(){
    $("li a").on("mousedown", function () {
        var id=($(this).attr("id"));
        
        if (prevClick<0){
            $("#welcome").hide();
        }
        console.log(check);
        if (!check){
            if(id!=prevClick){
                check=true;
                var l=sizes[id][1]+"px";
                if (prevClick>=0){           
                    $('#'+prevClick).text(shortName[prevClick]);
                    $('#'+prevClick).animate({width:sizes[prevClick][0]},500);
                    $('#'+prevClick).css("background","#333");
                    $('#'+ids[prevClick]).slideUp(400);
                }
                $(this).animate({width:l},500).promise().done(function() {$(this).text(fullName[id]);check=false;});
                $(this).css("background","#1B5E20");
                $('#'+ids[id]).slideDown(800);
                prevClick=id;
            }
        }
    });
}