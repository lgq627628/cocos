const Fs = require('fire-fs');

var item_size = 16;
var gen_tools = {
    'gen_ui': function (event) {
        /*;
        Editor.log('children length : ' + canvas.children.length);
        var pos = canvas.convertToWorldSpaceAR(cc.p(0, 0));
        Editor.log(pos);
		*/
		var select_name = null;
		
		let currentSelectionNode = Editor.Selection.curSelection('node');
		if (currentSelectionNode) {
			let selectionUUid = currentSelectionNode;
			let node = cc.engine.getInstanceById(selectionUUid);
			if (node) {
				select_name = node.name;
			}
		}
		
        if (event.reply) {
            event.reply("OK", select_name);
        }
    },
};

module.exports = gen_tools;