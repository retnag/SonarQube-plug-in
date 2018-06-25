SM.CloneClassSelector = function(HTMLelem, options){
  SM.Subscribable.call(this); // inherit from SM.Subscribable
  this.elem = null; // :DOMElement
  this.cloneClassList; // :CloneClass[]
  this.selected; // :int

  var self = this;

  this.init = function(HTMLelem,options){
    this.cloneClassList = (typeof options.cloneClassList !== "undefined") ? options.cloneClassList : [];
    this.selected = (typeof options.selected !== "undefined") ? options.selected : undefined;

    this.elem = HTMLelem;
    this.bindElement(HTMLelem);
    this.renderAll();
    SM.MetricLoader.subscribe("finishedAllRequests", function() {
      self.renderMetrics();
    });
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
    html.push('<div>');
    html.push('<select id="cloneClassSelector">')
    this.cloneClassList.forEach(function(cloneClass, i){
        html.push("<option value="+i+"> "+cloneClass.name+"</option>");
    });
    html.push('</select>');
    html.push('</div>');
    html.push('<div id="cloneClassMetricsContainer"></div>');

    this.elem.append(html.join(""));

    this.renderMetrics();

    // make selectmenu
    $("#cloneClassSelector").selectmenu();
    $("#cloneClassSelector").val(this.selected).selectmenu("refresh");

  };

  this.renderMetrics = function(){
    var div = $('#cloneClassMetricsContainer');
    var html = [];
    var data = this.cloneClassList[this.selected].cloneClassMetrics;
    var metrics = SM.state[SM.options.component.key].clone.classMetrics;
    metrics.forEach(function(metric) {
      html.push(SM.cloneViewer.getFormatedMetric(data[metric.title], metric));
    });
    div.html(html.join(""));
    $("#cloneClassSelectorContainer .sm-cloneviewer-metric-title-container").tooltip({
      content: function() {
        return $(this).prop('title');
      }
    });
  };

  /**
   * selects a CloneClass, and calls everything that needs to update its state.
   * @param  {int} choice    the id of the cloneclass in the this.CloneClassList
   * @return {void}
   */
  this.select = function (choice){
    this.selected = choice;
    this.renderMetrics();
    this.emit("onSelect", choice);
  };

  this.onCloneClassChange = function(event, ui){
    this.select(ui.item.index);
  };

  this.bindElement = function(elem) {
    if (this.elem !== null && jQuery.contains(document, this.elem[0])) {
      this.elem.html("");
    }
    this.elem = elem;
    if (this.elem !== null && jQuery.contains(document, this.elem[0])) {
      this.renderAll();
      this.registerEvents();
    }
  };

  this.registerEvents = function() {
    this.elem.on("selectmenuselect", "#cloneClassSelector", this.onCloneClassChange);
  };

  this.getFormatedMetric = function(val, metric) {
    if (val === undefined) {
      return '-';
    }
    SM.state[SM.options.component.key].clone.classMetrics.forEach(function(tempMetric){
      if (metric === tempMetric.title){
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
SM.CloneClassSelector.prototype = new SM.Subscribable();
SM.CloneClassSelector.prototype.constructor = SM.Subscribable;
