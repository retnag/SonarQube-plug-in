SM.RawFileLoader = new (function() { // Singleton object
  var self = this;
  var storeValue = true;
  this.cache = {};

  /**
   * Gets raw file data
   * @param  {string}   fileUrl  url of the file
   * @param  {Function} callback is called with the raw data passed as argument (string)
   * @return {void}              [description]
   */
  this.requestRawFileOld = function(filePath, callback) {
  window.SonarRequest.request(location.origin + '/api/sources/raw')
    .setMethod("GET")
    .setData({
      key: filePath
    })
    .submit()
    .then(function(response) {
      response.text().then(function(res){
        //visszaadja a fájlnak a szövegét stringben
        callback(res);
      });
    });
  };

  this.requestRawFile = function(filePath, callback) {
    if(storeValue && filePath in this.cache){
      callback(this.cache[filePath]);
      return;
    }
    $.get(location.origin + '/api/sources/raw',
      {key: filePath},
      (function( data ) {
        if(storeValue){
          this.cache[filePath]=data;
        }
        callback(data);
      }).bind(this));
    };

    this.requestSliceOfRawFile = function(callback, filePath, fromLine, toLine){
        this.requestRawFile(filePath, function(rawFile){
            var temp = [];
            var x = rawFile.split("\n");
            if(fromLine === undefined){
                fromLine = 0;
            }
            if(toLine === undefined || toLine > x.length){
                toLine = x.length;
            }
            for(var i = fromLine-1; i < toLine-1; i++){
                temp.push(x[i]);
            }
            callback(temp);
        });
    };
})();
