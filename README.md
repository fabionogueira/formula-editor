# formula-editor
Editor de formulas no estilo excel

under construction

_updateCaret() {
        let doc = this._editor.contentDocument.body.ownerDocument || this._editor.contentDocument.body.document
        let win = doc.defaultView || doc.parentWindow
        let sel, range
        let rect

        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
            }
        } else if ( (sel = doc.selection) && sel.type != "Control") {
            range = doc.selection.createRange();
        }

        this._activeCaretRange = range
        rect = range.getBoundingClientRect()

        if (doc.body.innerText==''){
            rect = {x:6, y:6}
        } else if (rect.x==0 && rect.y==0){
            rect = range.startContainer.getBoundingClientRect()
        }

        if (rect.x==0 && rect.y==0){
            rect = {x:6, y:6}
        }

        this._caret.style.top = (rect.y-2) + 'px'
        this._caret.style.left = rect.x + 'px'
    }