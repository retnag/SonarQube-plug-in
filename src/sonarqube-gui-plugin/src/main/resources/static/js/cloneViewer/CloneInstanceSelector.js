  SM.CloneInstanceSelector = function(HTMLelem, options){
  this.elem = null; // :DOMElement
  this.id; //: int (sorszám)
  this.cloneInstanceList; // :CloneClass[]
  this.selected; // :int
  this.codeBrowser; // :CodeBrowser (manages the diffs)
  this.parent; // :CloneClassSelector
  this.callBacks; // :map<string,function>

  var self = this;

  this.init = function(HTMLelem,options){

    this.id = (typeof options.id !== "undefined") ? options.id : 0;
    this.codeBrowser = (typeof options.codeBrowser !== "undefined") ? options.codeBrowser : null;
    this.parent = (typeof options.parent !== "undefined") ? options.parent : null;
    this.cloneInstanceList = (typeof options.cloneInstanceList !== "undefined") ? options.cloneInstanceList : [];
    this.selected = (typeof options.selected !== "undefined") ? options.selected : 0;
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
    this.elem.addClass("sm-cloneInstanceSelector");
    // put together the selectors html string
    var html = [];

    html.push('<div id="cloneInstanceLinkContainer">');
      html.push(SM.cloneViewer.generatePositionAnchorPopup(this.cloneInstanceList[this.selected]));
    html.push('</div>');
    html.push('<div>');
      html.push('<select id="selectmenu">');
      this.cloneInstanceList.forEach(function(cloneInstance, i){
          html.push("<option value=" + i + "> " + cloneInstance.name + "</option>");
      });
      html.push('</select>');
    html.push('</div>');
    html.push('<div id="cloneInstanceMetricsContainer'+this.id+'"></div>');

    this.elem.append(html.join(""));

    this.renderMetrics();

    // make selectmenu
    $("#cloneInstanceSelector" + this.id + " #selectmenu").selectmenu();
    $("#cloneInstanceSelector" + this.id + " #selectmenu").val(this.selected).selectmenu("refresh");

    $("#cloneInstanceSelector" + this.id + " .sm-cloneviewer-metric-title-container").tooltip({
      content: function() {
        return $(this).prop('title');
      }
    });

  };

  this.renderMetrics = function(){
    var div = $('#cloneInstanceMetricsContainer'+this.id);
    div.html("");
    var html = [];
    var metrics = this.cloneInstanceList[this.selected].cloneInstanceMetrics;
    //var metrics = SM.state["GB"].clone.data[0].cloneInstances[0].cloneInstanceMetrics;
    for(var metric in metrics){
      SM.state[SM.options.component.key].clone.instanceMetrics.forEach(function(tempMetric){
        if(metric === tempMetric.title){
          metric = tempMetric;
        }
      });
      metric = metric || { direction: 0 };
      html.push(SM.cloneViewer.getFormatedMetric(metrics[metric.title], metric));
    };
    html.push();

    div.append(html.join(""));
  };

  this.addCallBack = function(event, callback){
    if(typeof this.callBacks[event] === "undefined") this.callBacks[event] = [];
    this.callBacks[event].push(callback);
    callback(this.id);
  };

  /**
   * selects a CloneClass, and calls everything that needs to update its state.
   * @param  {int} choice    the id of the cloneclass in the this.CloneClassList
   * @return {void}
   */
  this.select = function (choice){
    this.selected = choice;
    this.renderMetrics();
    this.callBacks.onSelect.forEach(function(callback){
      callback(self.id);
    });

  };

  this.onCloneInstanceChange = function(event, ui){
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
    this.elem.on("selectmenuselect", this.onCloneInstanceChange);
  };

  SM.bindFunctions(this);
  this.init(HTMLelem,options);
};
