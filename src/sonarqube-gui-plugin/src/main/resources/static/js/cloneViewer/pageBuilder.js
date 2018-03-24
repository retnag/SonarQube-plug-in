/*
*  This file schould contain all simple DOM creation code.
*  So to say this file replaces the index.html file of the plugin,
*  it will (, well it should!) be loaded first before all the other
*  scripts execute.
*/
SM.pageBuilder.cloneViewer = {};

SM.pageBuilder.cloneViewer.build = function() {
  html = "it loads, yay!";

  SM.getRoot().html(html);
};
