/**
 * The object handling visual representation of the code
 * @param {[type]} HTMLelem [description]
 * @param {[type]} options  [description]
 */
SM.SideBySideDiffer = function(HTMLelem, options){
  this.elem = null; // :DOMElement
  this.text1; // :string
  this.text2; // :string
  this.callBacks; // :map<string,function>

  this.init = function(HTMLelem,options){
    options = (options) ? options:  {};
    this.text1 = options.text1 ? options.text1 : [];
    this.text2 = options.text2 ? options.text2 : [];
    this.callBacks = {};

    this.elem = HTMLelem;
    this.bindElement(HTMLelem);
    this.renderAll();

  };

  /**
   * Generates HTML of dependant of the current state of the object.
   * Then overwrites the HTML in the visible webpage as well.
   * @return {void}
   */
  this.renderAll = function(){
    this.elem.html("");
  };

  this.addCallBack = function(event, callback){
    if(typeof this.callBacks[event] === "undefined") throw "this event is undefined for CloneClassSelector";
    this.callBacks[event].push(callback);
  };

  this.setText1 = function (str){
  };

  this.setText2 = function (str){
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
  };

  SM.bindFunctions(this);
  this.init(HTMLelem,options);
};

