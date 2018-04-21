/**
 * The object handling visual representation of the code
 * @param {[type]} HTMLelem [description]
 * @param {[type]} options  [description]
 */
SM.CloneViewer = function(){
  this.elem = null; // :DOMElement
  this.maxInstances = 2; // :int
  this.cloneClassSelector; // :ClassSelector
  this.cloneInstanceSelectors; // :InstanceSelector[]
  this.codeBrowser; // :CodeBrowser (manages the diffs)

  this.selectedCloneClass;
  this.selectedInstances;

  var self = this;

  this.init = function(){

    this.selectedCloneClass = SM.state[SM.options.component.key].cloneViewer.selectedCloneClass;
    this.selectedInstances = SM.state[SM.options.component.key].cloneViewer.selectedInstances;

    this.cloneClassSelector = new SM.CloneClassSelector(
      $("#cloneClassSelectorContainer"),
      {cloneClassList: SM.state[SM.options.component.key].clone.data}
    );
    this.cloneClassSelector.addCallBack("onSelect", this.handleCloneClassChange);

    this.cloneInstanceSelectors = [];
    for(var i = 0; i < this.maxInstances; i++){
      $("#cloneInstanceSelectorContainer").append('<div id="cloneInstanceSelector' + i + '"></div>');
        var instanceList = this.cloneClassSelector.cloneClassList[this.selectedCloneClass].cloneInstances;
        this.cloneInstanceSelectors[i] = new SM.CloneInstanceSelector(
        $("#cloneInstanceSelector" + i),
        {
          cloneInstanceList: instanceList,
          id: i
        }
      );
      this.cloneInstanceSelectors[i].addCallBack("onSelect", this.handleCloneInstanceChange);
    }
    this.codeBrowser = new SM.SideBySideDiffer($("#cloneViewerConatiner"), {});
  };

  /**
   * Generates HTML of dependant of the current state of the object.
   * Then overwrites the HTML in the visible webpage as well.
   * @return {void}
   */
  this.renderAll = function(){
    this.elem.html("");
  };

  /**
   * is called by CloneClassSelector
   * @return {void}
   */
  this.handleCloneClassChange = function(selection){
    this.selectedCloneClass = selection;
    this.cloneInstanceSelectors.forEach(function(instanceSelector){
      var instanceList = self.cloneClassSelector.cloneClassList[self.selectedCloneClass].cloneInstances;
      instanceSelector.select(0);
      instanceSelector.renderAll();
    });
  };
  /**
   * is called by CloneInstanceSelector
   * @param  {int} id    id of the cloneInstanceSelector
   * @return {void}
   */
  this.handleCloneInstanceChange = function(id){

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
  this.init();
};

