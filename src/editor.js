// @ts-check


import Tokenizer from './tokenizer'

export default class Editor{
    constructor(element, config = {}){
        this._config(config)

        element.innerHTML = 
            `<div class="formula-editor" style="position:relative;width:100%;height:100%">
                <pre class="formula-editor-pre"></pre>
                <textarea class="formula-editor-textarea" spellcheck="false"></textarea>
                <div class="caret" style="left:6px;top:4px"></div>
            </div>`

        this._onTip = config.onTip
        this._functions = {}
        this._fields = {}
        this._tokenizer = new Tokenizer()
        this._activeCaretRange = null
        this._pre = element.querySelector('pre')
        this._textarea = element.querySelector('textarea')
        this._caret = element.querySelector('.caret')
        
        this._showCaret(false)
        this._initEvents()
    }

    _config(config){
        
    }

    _showCaret(show){
        this._caret.style.display = show ? 'block' : 'none'
    }

    _initEvents(){
        let textarea = this._textarea
        let pre = this._pre

        textarea.onscroll = () => {
            pre.scrollTop = textarea.scrollTop
            pre.scrollLeft = textarea.scrollLeft

            this._updateCaret()
        }
        textarea.onblur = () => {
            this._showCaret(false)
        }
        textarea.onfocus = () => {
            this._showCaret(true)
        }
        textarea._onkeyup = () => {
            let t, i, o, n, s, b, e
            let tip = ''
    
            this._updateCaret()
    
            t = this._getParamDefinition(this._activeCaretRange.caretPos - 1)
            
            if (t){
                if (t.type=='function' && !t.validate){
                    for (i in this._functions){
                        if (i.startsWith(t.value)){
                            tip += `<p style="${i==t.value ? 'background:#00BCD4' : ''}">${i}</p>`
                        }
                    }
                } else if (t.type=='field' && !t.validate){
                    for (i in this._fields){
                        n = i.substring(0, i.length - 1)
                        if (i.startsWith(t.value)){
                            tip += `<p style="${n==t.value ? 'background:#00BCD4' : ''}">${i}</p>`
                        }
                    }
                } else if (t.context){
                    o = this._functions[t.context]
                    if (o){
                        tip = t.context + '('
                        s = ''
                        
                        if (o.arguments){
                            e = false
                            for (i=0; i<o.arguments.length; i++){
                                n = o.arguments[i].name
                                b = (i == t.argumentIndex)
                                
                                if (b){
                                    e = true
                                }
                                
                                tip += s + ( b || (i==o.arguments.length-1 && !e && o.arguments[i].several) ? `<b style="background:#f3dd9b">${n}</b>` : n)
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
        textarea._onkeydown = (event) => {
            if (event.keyCode == 9){
                event.preventDefault()
                return document.execCommand('insertText', false, '    ')
            }
            
            this._updateCaret()
        }
        textarea._onmousedown = () => {
            setTimeout(() => {
                this._updateCaret()
            }, 100)
        }
        textarea._onpaste = (event) => {
            let text = event.clipboardData.getData("text/plain")
    
            event.preventDefault()
            document.execCommand('insertText', false, text)
        }    
        textarea._oninput = () => {
            this._updateCaret()
            this._renderBackground()
        }
    }

    _updateCaret() {
        // let rect
        // let range = getCursorPos(this._textarea)
        
        // rect = range.getBoundingClientRect()
        
        // this._caret.style.top = (rect.y-2) + 'px'
        // this._caret.style.left = rect.x + 'px'
    }

    _getParamDefinition(position){
        /** @type {*} */
        let token
        let positions = this._tokenizer.getPositions()
    
        while (position >= 0){
            token = positions[position]
            
            if (token){
                this._validateToken(token)
                return token
            }
    
            position--
        }
    }

    _validateToken(token){
        let tokens = this._tokenizer.getTokens()
        let j = token.index + 1
        let i, tk

        token.validate = false

        if (token.type=='function'){
            for (i=j; i<tokens.length; i++){
                tk = tokens[i]
                
                if (tk.value == '('){
                    return token.validate = true
                } else if (tk.type != 'blank'){
                    return token.validate = false
                }
            }
        } else if (token.type=='field'){
            token.validate = this._fields[token.value] ? true : false
        }
    }

    _renderBackground(){
        let content = this._textarea.contentDocument.body.firstChild.innerText
        let tokens = this._tokenizer.execute(content)
        let html = ''
    
        tokens.forEach(token => {
            if (token.type=='function'){
                token.validate = this._functions[token.value] ? true : false
            } else if (token.type=='field'){
                token.validate = this._fields[token.value] ? true : false
            }

            html += this._formatToken(token)
        })
    
        this._pre.contentDocument.body.innerHTML = '<pre>' + html + '</pre>'
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

function getCursorPos(input) {
    let len, sel, caretPos, range

    sel = document['selection'].createRange();
    
    if (sel.parentElement() === input) {
        range = input.createTextRange();
        range.moveToBookmark(sel.getBookmark());
        for (len = 0;
                    range.compareEndPoints("EndToStart", range) > 0;
                    range.moveEnd("character", -1)) {
            len++;
        }

        range.setEndPoint("StartToStart", input.createTextRange());
        
        for (caretPos = { start: 0, end: len };
                    range.compareEndPoints("EndToStart", range) > 0;
                    range.moveEnd("character", -1)) {
            caretPos.start++;
            caretPos.end++;
        }
        
        range.caretPos = {
            start: input.selectionStart,
            end: input.selectionEnd
        }

        return range
    }


    return null;
}