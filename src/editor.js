// @ts-check


import Tokenizer from './tokenizer'

export default class Editor{
    constructor(element, config = {}){
        element.init = () => {
            let body

            delete(element.init)

            this._background = element.children[0].children[0]
            this._editor = element.children[0].children[1]

            this._initIframe(this._background, this._backgroundStyle)
            this._initIframe(this._editor, this._editorStyle)

            body = this._editor.contentDocument.body
            body.innerHTML = 
                `<pre style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:1;margin:0;padding:6px;overflow:auto" spellcheck="false" contenteditable="true"></pre>
                 <div class="caret" style="left:6px;top:4px"></div>`

            this._caret = body.children[1]
            
            this._showCaret(false)
            this._initEvents()
        }

        this._config(config)

        element.innerHTML = 
        `<div class="formula-editor" style="position:relative;width:100%;height:100%">
            <iframe frameborder="0" class="formula-1"></iframe>
            <iframe frameborder="0" class="formula-2" onload="this.parentNode.parentNode.init();"></iframe>
        </div>`

        this._onTip = config.onTip
        this._functions = {}
        this._fields = {}
        this._tokenizer = new Tokenizer()
        this._activeCaretRange = null
    }

    _initIframe(frameElement, styles){
        let doc = frameElement.contentDocument;
        let style = doc.createElement('style')
        
        style.type = 'text/css';
        style.innerHTML = `* {font-family: monospace; }\n${styles ? styles : ''}`;
        
        frameElement.contentDocument.body.style.overflow = 'hidden'
        frameElement.contentDocument.head.appendChild(style)
    }

    _config(config){
        this._backgroundStyle = `
            .string{
                color: #FFC107
            }
            .function, .field, .context_var{
                color: #c0c0c0
            }
            .function.validate{
                color:blue
            }
            .field-start, .field-end, .field.validate{
                color:#009688
            }
            .context_var.validate{
                font-weight: bold;
                color: #000;
            }
            .operator{
                color: #9C27B0;
            }
            .number.unvalidate {
                color: red;
                /* background-image: url(wiggle.png);
                background-repeat: repeat-x;
                background-position: bottom; */
            }
            pre{
                padding:0;margin:0
            }
            body{
                padding:6px;margin:0
            }
            `
        this._editorStyle = `
            .caret {
                position:absolute;
                height:19px;
                width:1px;
                background: black;
                /*animation: 1s blink step-end infinite;
                -webkit-animation: 1s blink step-end infinite;*/
            }
            @keyframes "blink" {
              from, to { background: transparent; }
              50% {background: black; }
            }
            @-webkit-keyframes "blink" {
              from, to { background: transparent; }
              50% {background: black; }
            }
            * {
                color:transparent
            }
            `
    }

    _showCaret(show){
        this._caret.style.display = show ? 'block' : 'none'
    }

    _initEvents(){
        let doc = this._editor.contentDocument
        let body= doc.body

        body.children[0].onscroll = () => {
            this._background.contentDocument.body.scrollTop = body.children[0].scrollTop
            this._background.contentDocument.body.scrollLeft = body.children[0].scrollLeft

            this._updateCaret()
        }
        body.children[0].onblur = () => {
            this._showCaret(false)
        }
        body.children[0].onfocus = () => {
            this._showCaret(true)
        }

        doc.onkeyup = () => {
            let t, i, o, n, s, b
            let tip = ''
    
            this._updateCaret()
    
            t = this._getParamDefinition(this._activeCaretRange.startOffset-1)
            
            if (t){
                if (t.type=='function'){
                    for (i in this._functions){
                        tip += `<p>${i}</p>`
                    }
                } else if (t.type=='field-start' || t.type=='field'){
                    for (i in this._fields){
                        tip += `<p>${i}</p>`
                    }
                } else if (t.context){
                    o = this._functions[t.context]
                    if (o){
                        tip = t.context + '('
                        s = ''
                        
                        if (o.arguments){
                            for (i=0; i<o.arguments.length; i++){
                                n = o.arguments[i].name
                                b = (i == t.argumentIndex)
                                if (!b && n == '...'){
                                    b = true
                                }
                                tip += s + ( b ? `<b style="background:#f3dd9b">${n}</b>` : n)
                                s = '; '
                            }
                            tip += ')'
                        }
                    }
                    
                }
            }
    
            if (this._onTip){
                this._onTip(tip)
            }
        }
        doc.onkeydown = (event) => {
            if (event.keyCode == 9){
                event.preventDefault()
                return doc.execCommand('insertText', false, '    ')
            }
            
            this._updateCaret()
        }
        doc.onmousedown = () => {
            setTimeout(() => {
                this._updateCaret()
            }, 100)
        }
        doc.onpaste = (event) => {
            let text = event.clipboardData.getData("text/plain")
    
            event.preventDefault()
            doc.execCommand('insertText', false, text)
        }    
        doc.oninput = () => {
            this._updateCaret()
            this._renderBackground()
        }
    }

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

    _getParamDefinition(position){
        /** @type {*} */
        let token
        let positions = this._tokenizer.getPositions()
    
        while (position >= 0){
            token = positions[position]
            
            if (token){
                return token
            }
    
            position--
        }
    }

    _renderBackground(){
        let content = this._editor.contentDocument.body.firstChild.innerText
        let tokens = this._tokenizer.execute(content)
        let html = ''
    
        tokens.forEach(token => {
            if (token.type=='function'){
                token.validate = this._functions[token.value]
            } else if (token.type=='field'){
                token.validate = this._fields[token.value]
            }

            html += this._formatToken(token)
        })
    
        this._background.contentDocument.body.innerHTML = '<pre>' + html + '</pre>'
    }

    _formatToken(token){
        let r = token.value
        let cls = token.type + (token.validate ? ' validate' : ' unvalidate')
    
        r = `<span class="${cls}">${r}</span>`
    
        return r
    }

    setFunctions(functions){
        this._functions = functions
    }

    setFields(fields){
        this._fields = fields
    }
}
