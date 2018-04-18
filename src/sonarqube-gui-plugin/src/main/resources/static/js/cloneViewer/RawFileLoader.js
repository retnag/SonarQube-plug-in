SM.RawFileLoader = new (function() { // Singleton object
  var self = this;
  this.chache = {};

  this.fancyFunction = function(){
    console.log("fancí");
  }
  /**
   * Gets raw file data
   * @param  {string}   fileUrl  url of the file
   * @param  {Function} callback is called with the raw data passed as argument (string)
   * @return {void}              [description]
   */
  this.requestRawFile = function(fileUrl, callback) {
    // ...

    window.SonarRequest.getJSON(location.origin + '/api/settings/values', {
      component: SM.options.component.key,
      keys: queryString
    }).then(function(response) {
      //visszaadja a fájlnak a szövegét stringben
      callback(response.toString());
    });

    // ...
  };

})();