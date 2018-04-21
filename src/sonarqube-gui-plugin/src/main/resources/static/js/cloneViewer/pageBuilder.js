/*
*  This file schould contain all simple DOM creation code.
*  So to say this file replaces the index.html file of the plugin,
*  it will (, well it should!) be loaded first before all the other
*  scripts execute.
*/
SM.pageBuilder.cloneViewer = {};

SM.pageBuilder.cloneViewer.build = function() {
    var cloneClassSelectorSkeleton = [
      '<select id="cloneClassSelector">',
      '</select>'
    ].join("\n");

    var cloneInstanceSelectorSkeleton = [
      '<select id="cloneInstanceSelector">',
      '</select>'
    ].join("\n");

    var cloneInstanceSelector2Skeleton = [
      '<select id="cloneInstanceSelector2">',
      '</select>'
    ].join("\n");

    SM.getRoot().html([
        '<div id="cloneClassSelectorContainer">',
        '<div>CloneClassSelector: '+cloneClassSelectorSkeleton+'</div>',
        '<div>CloneInstanceSelector: '+cloneInstanceSelectorSkeleton+'</div>',
        '<div id="cloneViewer"></div>',
        '</div>',
        '<div id="cloneClassSelectorContainer2">',
        '<div>CloneInstanceSelector: '+cloneInstanceSelector2Skeleton+'</div>',
        '<div id="cloneViewer2"></div>',
        '</div>'
    ].join(""));

    //
    $( "#cloneClassSelector" )
        .selectmenu();

    $( "#cloneInstanceSelector" )
        .selectmenu();

    $( "#cloneInstanceSelector2" )
        .selectmenu();

    //eventlisteners
    $( "#cloneClassSelector" ).on( "selectmenuselect", function( event, ui ) {
        var cloneInstanceSelectorOptions = [];
        SM.state[SM.options.component.key].clone.data.forEach(function(x){
		    if(x.name === $('#cloneClassSelector').val()){
			    x.cloneInstances.forEach(function(c){
  				    cloneInstanceSelectorOptions.push("<option value="+c.displayedPath+"> "+c.name+"</option>");
  			    });
		    }
        });
        $( "#cloneInstanceSelector" )
            .find('option').remove().end()
	        .append(cloneInstanceSelectorOptions.join(""))
            .selectmenu("destroy").selectmenu({ style: "dropdown" });
        $( "#cloneInstanceSelector2" )
            .find('option').remove().end()
	        .append(cloneInstanceSelectorOptions.join(""))
            .selectmenu("destroy").selectmenu({ style: "dropdown" });
    });

    $( "#cloneInstanceSelector" ).on( "selectmenuselect", function( event, ui ) {
   		SM.RawFileLoader.requestSliceOfRawFile(function(rawFileData){
			$( "#cloneViewer" ).html(rawFileData.join("<br>"));
   		},$('#cloneInstanceSelector').val());
	});


    $( "#cloneInstanceSelector2" ).on( "selectmenuselect", function( event, ui ) {
   		SM.RawFileLoader.requestSliceOfRawFile(function(rawFileData){
			$( "#cloneViewer2" ).html(rawFileData.join("<br>"));
   		},$('#cloneInstanceSelector2').val());
	});

    //
    var cloneClassSelectorOptions = [];
    SM.state[SM.options.component.key].clone.data.forEach(function(c){
  	    cloneClassSelectorOptions.push("<option value="+c.name+"> "+c.name+"</option>");
    });

    $( "#cloneClassSelector" )
    	.append(cloneClassSelectorOptions.join(""))
        .selectmenu()
        .val(SM.state[SM.options.component.key].cloneViewer.selectedCloneClassName)
        .selectmenu("refresh")
        .trigger("selectmenuselect");

    $( "#cloneInstanceSelector" )
        .selectmenu()
        .val(SM.state[SM.options.component.key].cloneViewer.selectedCloneInstanceName)
        .selectmenu("refresh")
        .trigger("selectmenuselect");
  
};
