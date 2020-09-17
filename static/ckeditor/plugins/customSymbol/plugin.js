(function () {
  CKEDITOR.plugins.add('customSymbol', {
    init: function (editor) {
      editor.addCommand('insertCustomSymbol', {
        exec: function (editor) {
          editor.insertText('※');
        }
      });
      editor.ui.addButton('customSymbol', {
        label: '添加米字號',
        command: 'insertCustomSymbol',
        toolbar: 'insert',
        icon: 'plugins/customSymbol/icons/symbol.jpg'
      });
    }
  });
})();