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
    this.text1 = options.text1 ? options.text1 : "";
    this.text2 = options.text2 ? options.text2 : "";

    this.elem = HTMLelem;
    this.bindElement(HTMLelem);
    this.renderAll();

  };
/*
  this.diff = JsDiff.createPatch('fileName', this.setText1, this.setText2, 'oldHeader', 'newHeader');

  this.html = Diff2Html.getPrettySideBySideHtmlFromDiff(this.diff, {
      wordByWord: true,
      // outputFormat: 'line-by-line',
      outputFormat: 'side-by-side'
    });
*/

  /**
   * Generates HTML of dependant of the current state of the object.
   * Then overwrites the HTML in the visible webpage as well.
   * @return {void}
   */
  this.renderAll = function(){
    var diff = JsDiff.createPatch('fileName', this.text1, this.text2, 'oldHeader', 'newHeader',{context:100000});
    var html = Diff2Html.getPrettySideBySideHtmlFromDiff(diff, {
      wordByWord: true,
      outputFormat: 'side-by-side'
    });
    this.elem.html(html);
    $(".d2h-file-header").html("Diff:");
  };

  this.setText1 = function (str){
    this.text1 = str;
    this.renderAll();
  };

  this.setText2 = function (str){
    this.text2 = str;
    this.renderAll();
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
