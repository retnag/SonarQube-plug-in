SM.CloneInstanceSelector = function(HTMLelem, options){
  this.elem = null; // :DOMElement
  this.id; //: int (sorszám)
  this.cloneInstanceList; // :CloneClass[]
  this.selected; // :int
  this.codeBrowser; // :CodeBrowser (manages the diffs)
  this.parent; // :CloneClassSelector
  this.callBacks; // :map<string,function>

  this.init = function(HTMLelem,options){

    this.id = options.id ? options.id : 0;
    this.codeBrowser = options.codeBrowser ? options.codeBrowser : null;
    this.parent = options.parent ? options.parent : null;
    this.cloneInstanceList = options.cloneInstanceList ? options.cloneInstanceList : [];
    this.selected = options.selected ? options.selected : 0;
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
    var html = [];

    html.push('<div id="cloneInstanceSelector' + this.id + '">');
    html.push('<select id="c' + this.id + '">')
    this.cloneInstanceList.forEach(function(cloneInstance, i){
        html.push("<option value=" + i + "> " + cloneInstance.name + "</option>");
    });
    html.push('</select>');
    html.push('<div id="cloneInstanceMeticsContainer'+this.id+'">');
    var metrics = this.cloneInstanceList[this.selected].cloneInstanceMetrics;
    //var metrics = SM.state["GB"].clone.data[0].cloneInstances[0].cloneInstanceMetrics;
    for(var metric in metrics){
      html.push(this.getFormatedMetric(metrics[metric],metric));
    });
    html.push('</div>');
    html.push('</div>');
    this.elem.append(html.join(""));

    // make selectmenu
    $("#cloneInstanceSelector" + this.id).selectmenu();
    $("#cloneInstanceSelector" + this.id).val(this.selected).selectmenu("refresh");

  };

  this.addCallBack = function(event, callback){
    if(typeof this.callBacks[event] === "undefined") this.callBacks[event] = [];
    this.callBacks[event].push(callback);
  };

  this.getFormatedMetric = function(val, metric) {
    if (val === undefined) {
      return '-';
    }
    SM.state[SM.options.component.key].clone.instanceMetrics.forEach(function(tempMetric){
      if(metric === tempMetric.title){
        metric = tempMetric;
      }
    });
    metric = metric || { direction: 0 };
    var greenClass = "sm-widget-threshold-green";
    var redClass = "sm-widget-threshold-red";
    var faCheckCircle = "fa fa-check-circle";
    var faExclamationCircle = "fa fa-exclamation-circle";
    var valueClass = "";
    var iconClass = "";
    var iconStyle = "";
    if (metric.baseline === undefined) {
    } else if (metric.direction === -1) { // 1:lesser=worse && larger=better;
      valueClass = (val <= metric.baseline) ? greenClass : redClass;
      iconClass = (val <= metric.baseline) ? faCheckCircle : faExclamationCircle;
      iconStyle = (val <= metric.baseline) ? "color:green" : "color:red";
    } else if (metric.direction === 1) { // -1: lesser=better && larger=worse
      valueClass = (val >= metric.baseline) ? greenClass : redClass;
      iconClass = (val >= metric.baseline) ? faCheckCircle : faExclamationCircle;
      iconStyle = (val >= metric.baseline) ? "color:green" : "color:red";
    }

    return '<div><div><i class="'+iconClass+'" style="'+iconStyle+'"></i></div><div>'+metric.title+'</div><div class="' + valueClass + '">' + (Math.round(val * 100) / 100) + '</div></div>';
  };

  /**
   * selects a CloneClass, and calls everything that needs to update its state.
   * @param  {int} choice    the id of the cloneclass in the this.CloneClassList
   * @return {void}
   */
  this.select = function (choice){
    this.selected = choice;
    this.callBacks.onSelect.forEach(function(callback){
      callback(choice);
    });

  };

  this.onCloneInstanceChange = function(event, ui){
    this.select(ui.item.index);
    this.callBacks.onSelect.forEach(function(callback){
      callback(this.id);
    }).bind(this);
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
    this.elem.on("selectmenuselect", "#cloneInstanceSelector" + this.id, this.onCloneInstanceChange);
  };

  SM.bindFunctions(this);
  this.init(HTMLelem,options);
};
