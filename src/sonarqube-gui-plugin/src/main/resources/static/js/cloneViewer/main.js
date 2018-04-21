SM.cloneViewer = {};

/**
 * Entry point for the cloneViewer. this function is guaranteed to be executed
 * after loading of all dependency scripts and styles. It will be executed every
 * time when the user opens the codeViewer page.
 * @return {void}
 */
SM.cloneViewer.init = function() {
  SM.pageBuilder.cloneViewer.build();
  SM.state[SM.options.component.key].cloneViewer.data = new SM.CloneViewer();
}

SM.cloneViewer.main = function() {

  if (!SM.state[SM.options.component.key].hasOwnProperty("cloneViewer")) {
    SM.state[SM.options.component.key].cloneViewer = {}; // create it the first time
  }

  var stateData = SM.state[SM.options.component.key].cloneViewer;

  // dashboard data was never fetched before, so neither was the cloneViewer or the dashboard visited before
  if(!SM.state[SM.options.component.key].initialized) {
    SM.dashboard.fetch();
    SM.waitForNDo(
      function() {
        if(SM.state[SM.options.component.key].clone) {
          return true;
        } else {
          return false ;
        }
      },
      function() {
        stateData.numOfCloneClasses = SM.state[SM.options.component.key].clone.data.length;
        stateData.selectedCloneClass = (stateData.numOfCloneClasses >= 1)? 0 : undefined;
        stateData.selectedInstances = (stateData.numOfCloneClasses >= 1)? [0,1] : undefined;
        SM.cloneViewer.init();
      },
      100
    );
    return;
  } else {// dashboard or cloneViewer WAS visited and loaded before
    SM.cloneViewer.init();
  }

}; // END OF function main
