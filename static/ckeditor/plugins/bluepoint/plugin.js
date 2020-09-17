(function () {
  CKEDITOR.plugins.add('bluepoint', {
    init: function (editor) {
      editor.addCommand('insertBluePoint', {
        exec: function (editor) {
          // element左右需加一個空白 
          editor.insertHtml(' <span><svg width="14" height="12" viewBox="0 0 14 12" class="bullet-list__item-svg"><path fill="#005BAC" fill-rule="evenodd" d="M12.402 2.219c-.417-.406-.854-.795-1.34-1.104C8.94-.235 6.478.013 6.376.025a6.902 6.902 0 0 0-2.375.771c-.92.508-2.599 1.63-3.514 3.698-.25.566-.544 1.293-.477 2.242.078 1.127.622 1.633 1.463 2.33.84.697 2.223.695 3.24 1.041.734.25 1.222 1.399 1.972 1.584.773.191 1.564.349 2.357.3 1.125-.069 2.214-.562 3.072-1.335.857-.773 1.484-1.817 1.832-2.95.144-.473.013-3.52-.552-4.353-.285-.42-.633-.785-.992-1.134z"></path></svg> </span>');
        }
      });
      editor.ui.addButton('bluepoint', {
        label: '添加藍點',
        command: 'insertBluePoint',
        toolbar: 'insert',
        icon: 'plugins/bluepoint/icons/bluepoint.jpg'
      });
    }
  });
})();