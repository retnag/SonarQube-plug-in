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
    
    this.renderMetrics();

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
      callback(choice);
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

  this.renderMetrics = function(){
    var div = $('#cloneClassMetricsContainer');
    div.html("");
    var html = [];
    var metrics = this.cloneClassList[this.selected].cloneClassMetrics;
    for(var metric in metrics){
      html.push(this.getFormatedMetric(metrics[metric],metric));
    };
    html.push();

    div.append(html.join(""));
  };


  this.getFormatedMetric = function(val, metric) {
    if (val === undefined) {
      return '-';
    }
    SM.state[SM.options.component.key].clone.classMetrics.forEach(function(tempMetric){
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

    return [
      '<div class="sm-cloneviewer-metric-container">',
      '  <div class="sm-cloneviewer-metric-icon-container"><i class="'+iconClass+'" style="'+iconStyle+'"></i></div>',
      '  <div class="">'+metric.longName+'</div>',
      '  <div class="sm-cloneviewer-metric-title-container">('+metric.title+'</div>,',
      '  <div class="sm-cloneviewer-metric-value-container ' + valueClass + '">' + (Math.round(val * 100) / 100) + ')</div>',
      '</div>'
    ].join("");
  };


  SM.bindFunctions(this);
  this.init(HTMLelem,options);
};

