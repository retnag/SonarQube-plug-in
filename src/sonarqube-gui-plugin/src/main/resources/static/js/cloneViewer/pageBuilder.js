/*
*  This file schould contain all simple DOM creation code.
*  So to say this file replaces the index.html file of the plugin,
*  it will (, well it should!) be loaded first before all the other
*  scripts execute.
*/
SM.pageBuilder.cloneViewer = {};

SM.pageBuilder.cloneViewer.build = function() {
    SM.getRoot().html([
        '<div class="sm-page-header">',
          '<img id="sm-logo" height="36px" src="/static/SourceMeterGUI/graphics/MainLogo.png">',
          '<h1 class="sm-page-title">Clone Viewer</h1>',
        '</div>',
        '<hr>',
        '<div id="cloneClassSelectorContainer"></div>',
        '<hr>',
        '<div id="cloneInstanceSelectorContainer"></div>',
        '<hr>',
        '<div id="cloneViewerConatiner"></div>',
    ].join(""));
};
