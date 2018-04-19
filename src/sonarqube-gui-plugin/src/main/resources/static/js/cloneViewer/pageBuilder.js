/*
*  This file schould contain all simple DOM creation code.
*  So to say this file replaces the index.html file of the plugin,
*  it will (, well it should!) be loaded first before all the other
*  scripts execute.
*/
SM.pageBuilder.cloneViewer = {};

SM.pageBuilder.cloneViewer.build = function() {
    var cloneClassSelectorOptions = [
      '<select id="cloneClassSelector">',
      '</select>'
    ].join("\n");

    var cloneInstanceSelectorOptions = [
      '<select id="cloneInstanceSelector">',
      '</select>'
    ].join("\n");

SM.getRoot().html([
    '<div id="cloneClassSelectorContainer">CloneClassSelector: '+cloneClassSelectorOptions+'</div>',
    '<div id="cloneInstanceSelectorContainer">CloneInstanceSelector: '+cloneInstanceSelectorOptions+'</div>',
    '<div id="cloneViewer"></div>'
  ].join(""));


  
  var temp = [];
  SM.state[SM.options.component.key].clone.data.forEach(function(c){
  	temp.push("<option value="+c.name+"> "+c.name+"</option>");
  });
  $( "#cloneClassSelector" )
	.append(temp.join(""))
    .selectmenu();

  


//eventlisteners
  $( "#cloneClassSelector" ).on( "selectmenuchange", function( event, ui ) {
  var temp1 = [];
  SM.state[SM.options.component.key].clone.data.forEach(function(x){
		if(x.name === $('#cloneClassSelector').val()){
			x.cloneInstances.forEach(function(c){
  				temp1.push("<option value="+c.displayedPath+"> "+c.name+"</option>");
  			});
		}
	});
  $( "#cloneInstanceSelector" )
	.append(temp1.join(""))
    .selectmenu();
  }
 );

   $( "#cloneInstanceSelector" ).on( "selectmenuchange", function( event, ui ) {
   		SM.RawFileLoader.requestRawFile($('#cloneInstanceSelector').val(),function(rawFileData){
			$( "#cloneViewer" ).html(rawFileData);
   		});
	});
};
