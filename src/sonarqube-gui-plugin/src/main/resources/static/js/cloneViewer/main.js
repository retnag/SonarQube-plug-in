SM.cloneViewer = {};

/**
 * Entry point for the cloneViewer. this function is guaranteed to be executed
 * after loading of all dependency scripts and styles. It will be executed every
 * time when the user opens the codeViewer page.
 * @return {void}
 */
SM.cloneViewer.main = function() {

  SM.pageBuilder.cloneViewer.build();

}; // END OF function main
