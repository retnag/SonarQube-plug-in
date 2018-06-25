/**
 * The object handling visual representation of the code
 * @param {[type]} HTMLelem [description]
 * @param {[type]} options  [description]
 */
SM.CloneViewer = function(){
  this.elem = null; // :DOMElement
  this.maxInstances = 2; // :int
  this.cloneClassSelector = null; // :SM.ClassSelector
  this.cloneInstanceSelectors = null; // :SM.InstanceSelector[]
  this.codeBrowser = null; // :SM.SideBySideDiffer (manages the diffs)

  this.selectedCloneClass = null;
  this.selectedInstances = null;
  this.codeBrowser = null;

  var self = this;

  this.init = function(){
    this.selectedCloneClass = SM.state[SM.options.component.key].cloneViewer.selectedCloneClass;
    this.selectedCloneClass = (this.selectedCloneClass)? this.selectedCloneClass : 0;
    this.selectedInstances = SM.state[SM.options.component.key].cloneViewer.selectedInstances;
    this.selectedInstances = (this.selectedInstances)? this.selectedInstances : [];

    this.codeBrowser = new SM.SideBySideDiffer($("#cloneViewerConatiner"), {});

    this.cloneClassSelector = new SM.CloneClassSelector(
      $("#cloneClassSelectorContainer"),
      {
        cloneClassList: SM.state[SM.options.component.key].clone.data,
        selected: this.selectedCloneClass
      }
    );

    this.cloneInstanceSelectors = [];
    for (var i = 0; i < this.maxInstances; i++){
      $("#cloneInstanceSelectorContainer").append('<div id="cloneInstanceSelector' + i + '"></div>');
      var instanceList = this.cloneClassSelector.cloneClassList[this.selectedCloneClass].cloneInstances;
      this.cloneInstanceSelectors[i] = new SM.CloneInstanceSelector(
        $("#cloneInstanceSelector" + i),
        {
          cloneInstanceList: instanceList,
          selected: (this.selectedInstances[i])? this.selectedInstances[i] : 0,
          id: i
        }
      );
      this.cloneInstanceSelectors[i].subscribe("onSelect", this.handleCloneInstanceChange);
    }
    this.cloneClassSelector.subscribe("onSelect", this.handleCloneClassChange);

    this.cloneClassSelector.select(this.selectedCloneClass) // triggers events
  };

  /**
   * Generates HTML of dependant of the current state of the object.
   * Then overwrites the HTML in the visible webpage as well.
   * @return {void}
   */
  this.renderAll = function(){
    this.cloneClassSelector.renderAll();
    this.cloneInstanceSelectors.renderAll();
    this.codeBrowser.renderAll();
  };

  /**
   * is called by CloneClassSelector
   * @return {void}
   */
  this.handleCloneClassChange = function(selection){
    this.selectedCloneClass = selection;
    this.cloneInstanceSelectors.forEach(function(instanceSelector, i){
      var instanceList = self.cloneClassSelector.cloneClassList[self.selectedCloneClass].cloneInstances;
      instanceSelector.cloneInstanceList = instanceList;
      instanceSelector.select(i);
      instanceSelector.renderAll();
    });
  };
  /**
   * is called by CloneInstanceSelector
   * @param  {int} id    id of the cloneInstanceSelector
   * @return {void}
   */
  this.handleCloneInstanceChange = function(id){
    var instanceSelector = this.cloneInstanceSelectors[id];
    var selectedInstance = instanceSelector.cloneInstanceList[instanceSelector.selected];
    var start = selectedInstance.positions[0].line;
    var stop = start + selectedInstance.cloneInstanceMetrics.CLLOC;
    var func = function(text){
      self.codeBrowser.setText(id+1, {startLine: start ,txt:text.join("\n")});
    };
    SM.RawFileLoader.requestSliceOfRawFile(
      func,
      selectedInstance.displayedPath,
      start,
      stop
    );
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

