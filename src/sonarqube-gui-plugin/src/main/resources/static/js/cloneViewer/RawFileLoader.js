SM.RawFileLoader = new (function() { // Singleton object
  var self = this;
  var storeValue = true;
  this.cache = {};

  /**
   * Gets raw file data
   * @param  {string}   fileUrl  url of the file
   * @param  {Function} callback is called with the raw data passed as argument (string)
   * @return {void}
   */
   this.requestRawFile = function(filePath, callback) {
    if (storeValue && filePath in this.cache) {
      callback(this.cache[filePath]);
      return;
    }
    $.get(location.origin + '/api/sources/raw',
      {key: filePath},
      (function(data) {
        if (storeValue) {
          this.cache[filePath]=data;
        }
        callback(data);
      }).bind(this));
    };

  /**
   * Gets raw file data, only returns lines fromLine toLine
   * @param  {string}   filePath  url of the file
   * @param  {Function} callback is called with the raw data passed as argument (string)
   * @param  {Number}   fromLine starting default is 0
   * @param  {Number}   toLine   ending line default is file length, truncated if longer
   * @return {void}
   */
    this.requestSliceOfRawFile = function(callback, filePath, fromLine, toLine){
        this.requestRawFile(filePath, function(rawFile) {
            var temp = [];
            var x = rawFile.split("\n");

            if (fromLine === undefined) {
                fromLine = 0;
            }
            if (toLine === undefined || toLine > x.length) {
                toLine = x.length;
            }

            for (var i = fromLine-1; i < toLine-1; i++) {
                temp.push(x[i]);
            }
            callback(temp);
        });
    };
})();
