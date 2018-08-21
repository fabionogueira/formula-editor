// @ts-check


import Tokenizer from './tokenizer'

export default class Editor{
    constructor(element, config = {}){
        this._config(config)

        element.innerHTML = 
            `<div class="formula-editor">
                <pre class="formula-editor-pre"> </pre>
                <textarea class="formula-editor-textarea" spellcheck="false"></textarea>
            </div>`

        this._pre = element.querySelector('pre')
        this._textarea = element.querySelector('textarea')
        this._tokenizer = new Tokenizer()

        this._functions = {}
        this._fields = {}
        
        this._onTip = config.onTip
        
        this._initEvents()
    }

    _config(config){
        
    }

    _initEvents(){
        let textarea = this._textarea
        let pre = this._pre

        textarea.onscroll = () => {
            pre.style.top = -textarea.scrollTop + 'px'
            pre.style.left = textarea.scrollLeft + 'px'
        }
        textarea.onkeydown = (event) => {
            let value1, value2, position

            if (event.keyCode == 9){
                event.preventDefault()

                position = textarea.selectionStart + 4
                value1 = textarea.value.substring(0, textarea.selectionStart)
                value2 = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

                textarea.value = `${value1}    ${value2}`
                textarea.selectionStart = position
                textarea.selectionEnd = position
                textarea.focus()

                this._render()

                return false
            }
        }
        textarea.onkeyup = () => {
            this._generateTip()
        }
        textarea.onmouseup = () => {
            this._generateTip()
        }   
        textarea.oninput = () => {
            this._render()
        }
    }

    _generateTip(){
        let t, i, o, n, s, b, e
        let tip = ''

        t = this._getParamDefinition(this._textarea.selectionStart -1)
        
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

    _getParamDefinition(position){
        let token
        let positions = this._tokenizer.getPositions()
    
        while (position >= 0){
            token = positions[position]
            
            if (token && token.type != 'blank'){
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
                    return token.validate = this._functions[token.value] ? true : false
                } else if (tk.type != 'blank'){
                    return token.validate = false
                }
            }
        } else if (token.type=='field'){
            token.validate = this._fields[token.value] ? true : false
        }
    }

    _render(){
        let tokens = this._tokenizer.execute(this._textarea.value)
        let html = ''
    
        tokens.forEach(token => {
            if (token.type=='function'){
                token.validate = this._functions[token.value] ? true : false
            } else if (token.type=='field'){
                token.validate = this._fields[token.value] ? true : false
            }

            html += this._formatToken(token)
        })
        
        this._pre.innerHTML = html + ' \n'
        this._textarea.style.height = this._pre.offsetHeight + 'px'
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
 window['xx'] = 0