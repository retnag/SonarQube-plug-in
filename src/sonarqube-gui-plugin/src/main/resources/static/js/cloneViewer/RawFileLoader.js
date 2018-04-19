SM.RawFileLoader = new (function() { // Singleton object
  var self = this;
  var storeValue = true;
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
  this.requestRawFileOld = function(projectName, fileUrl, callback) {
  window.SonarRequest.request(location.origin + '/api/sources/raw')
    .setMethod("GET")
    .setData({
      key: projectName+":"+fileUrl
    })
    .submit()
    .then(function(response) {
      response.text().then(function(res){
        //visszaadja a fájlnak a szövegét stringben
        callback(res);
      })
    })
  };

  this.requestRawFile = function(projectName, fileUrl, callback) {
    var url = projectName+":"+fileUrl;
    $.get(location.origin + '/api/sources/raw',
      {key: url},
      function( data ) {
        if(storeValue){
          SM.RawFileLoader.chache["rawFiles"] = {url:data}
        }
        
        callback(data);
      });
  };

})();
