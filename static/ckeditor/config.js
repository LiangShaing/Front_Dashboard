/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
  // Define changes to default configuration here. For example:
  // config.language = 'fr';
  // config.uiColor = '#AADC6E';
  config.toolbar = 'Full';
  config.allowedContent = true;
  config.extraPlugins = ['bluepoint','customSymbol'];
  config.pasteFilter = null;
  config.toolbar_Full = [
    // { name: 'document', items: ['Source'] },
    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'Undo', 'Redo'] },
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'links', items: ['Link', 'Unlink', 'anchor'] },
    // { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'CopyFormatting', 'RemoveFormat'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent',] },
    { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
    { name: 'insert', items: ['bluepoint','customSymbol', 'Table', 'Image'] },
    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },


  ]
};
