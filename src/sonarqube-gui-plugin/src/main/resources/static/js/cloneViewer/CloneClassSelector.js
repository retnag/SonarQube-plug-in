SM.CloneClassSelector = function(HTMLelem, options){
  this.elem = null; // :DOMElement
  this.cloneClassList; // :CloneClass[]
  this.selected; // :int
  this.callBacks; // :map<string,function>

  this.init = function(HTMLelem,options){

    this.cloneClassList = options.cloneClassList ? options.cloneClassList : [];
    this.selected = options.selected ? options.selected : undefined;
    this.callBacks = {
      onSelect: []
    };

    this.elem = HTMLelem;
    this.bindElement(HTMLelem);

    this.select(this.selected);
    this.renderAll();

  };

  /**
   * Generates HTML of dependant of the current state of the object.
   * Then overwrites the HTML in the visible webpage as well.
   * @return {void}
   */
  this.renderAll = function(){
    this.elem.html("");

    // put together the selectors html string
    var cloneClassSelectorSkeleton = [];
    cloneClassSelectorSkeleton.push('<select id="cloneClassSelector">')
    this.cloneClassList.forEach(function(cloneClass, i){
        cloneClassSelectorSkeleton.push("<option value="+i+"> "+cloneClass.name+"</option>");
    });
    cloneClassSelectorSkeleton.push('</select>');
    this.elem.append(cloneClassSelectorSkeleton.join(""));

    // make selectmenu
    $("#cloneClassSelector").selectmenu();
    $("#cloneClassSelector").val(this.selected).selectmenu("refresh");

  };

  this.addCallBack = function(event, callback){
    if(typeof this.callBacks[event] === "undefined") throw "this event is undefined for CloneClassSelector";
    this.callBacks[event].push(callback);
  };

  /**
   * selects a CloneClass, and calls everything that needs to update its state.
   * @param  {int} choice    the id of the cloneclass in the this.CloneClassList
   * @return {void}
   */
  this.select = function (choice){

    this.selected = choice;
    this.callBacks.onSelect.forEach(function(callback){
      callback();
    });

  };

  this.onCloneClassChange = function(event, ui){
    this.select(ui.item.index);
  };

  this.bindElement = function(elem) {
    if (!jQuery.contains(document, this.elem[0])) {
      this.elem.html("");
    }
    this.elem = elem;
    if (jQuery.contains(document, this.elem[0])) {
      this.renderAll();
      this.registerEvents();
    }
  };

  this.registerEvents = function() {
    this.elem.on("selectmenuselect", "#cloneClassSelector", this.onCloneClassChange);
  };

  SM.bindFunctions(this);
  this.init(HTMLelem,options);
};

