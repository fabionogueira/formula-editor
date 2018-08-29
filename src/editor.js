// @ts-check

import tokenizer from './tokenizer2'

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
        
        this._functions = {}
        this._fields = {}
        
        this._onTip = config.onTip
        this._onChange = config.onChange

        this.onchange = null
        this.onblur = null
        
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
            // this._generateTip()
        }   
        textarea.oninput = () => {
            this._render()
            
            if (this._onChange){
                this._onChange(this._textarea.value)
            }
            
            if (this.onchange) this.onchange(this._textarea.value)
        }
        textarea.onblur = () => {
            if (this.onblur) this.onblur()
        }
    }

    _generateTip(){
        let i, o, n, s, b, e
        let tip = ''

        let tokens = this._tokens || []
        let p = this._textarea.selectionStart -1
        let index = tokens.findIndex((tk) => {return tk.cursor >= p})
        let token = tokens[index]

        if (!token){
            token = tokens[0]
        }else if (token.cursor > p && p >= 0){
            token = tokens[index - 1]
        }
        
        if (token){
            document.getElementById('console').innerHTML = p + ',' + 
            '\ncursor     = ' + token.cursor +
            '\ncol        = ' + token.col + 
            '\ncontext    = ' + token.context + 
            '\ncontextPos = ' + token.contextPos +
            '\nvalue      = ' + token.value
        } else {
            document.getElementById('console').innerHTML = ''
        }

        if (token){
            if (token.type=='FUNCTION' && !token.validate){
                for (i in this._functions){
                    if (i.startsWith(token.value)){
                        tip += `<p style="${i==token.value ? 'background:#00BCD4' : ''}">${i}</p>`
                    }
                }
            } else if (token.type=='IDENTIFIER' && !token.validate){
                for (i in this._fields){
                    n = i.substring(0, i.length - 1)
                    if (i.startsWith(token.value)){
                        tip += `<p style="${n==token.value ? 'background:#00BCD4' : ''}">${i}</p>`
                    }
                }
            } else if (token.context){
                o = this._functions[token.context]
                if (o){
                    tip = token.context + '('
                    s = ''
                    
                    if (o.arguments){
                        e = false
                        for (i=0; i<o.arguments.length; i++){
                            n = o.arguments[i].name
                            b = (i == token.contextPos)
                            
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

        document.getElementById('tip').innerHTML = tip

        // if (this._onTip){
        //     this._onTip(tip)
        // }
    }

    // _getParamDefinition(position){
    //     let token
    //     let positions = this._tokenizer.getPositions()
    
    //     while (position >= 0){
    //         token = positions[position]
            
    //         if (token && token.type != 'blank'){
    //             this._validateToken(token)
    //             return token
    //         }
    
    //         position--
    //     }
    // }

    // _validateToken(token){
    //     let tokens = this._tokenizer.getTokens()
    //     let j = token.index + 1
    //     let i, tk

    //     token.validate = false

    //     if (token.type=='function'){
    //         for (i=j; i<tokens.length; i++){
    //             tk = tokens[i]
                
    //             if (tk.value == '('){
    //                 return token.validate = this._functions[token.value] ? true : false
    //             } else if (tk.type != 'blank'){
    //                 return token.validate = false
    //             }
    //         }
    //     } else if (token.type=='field'){
    //         token.validate = this._fields[token.value] ? true : false
    //     }
    // }

    _render(){
        let tokens = this._tokens = tokenizer(this._textarea.value)
        let html = ''
        
        console.log(tokens)
        
        tokens.forEach(token => {
            if (token.type == 'FUNCTION'){
                token.validate = this._functions[token.value] ? true : false
            } else if (token.type == 'IDENTIFIER'){
                token.validate = this._fields[token.value] ? true : false
            } else if (token.type == 'STRING'){
                token.value = `"${token.value}"`
            } else if (token.type == 'UNCOMPLETE_STRING'){
                token.value = `"${token.value}`
            } else if (token.type == 'NEWLINE'){
                token.value = '\n'
            }

            html += this._formatToken(token)
        })
        
        this._pre.innerHTML = html + ' \n'
        this._textarea.style.height = this._pre.offsetHeight + 'px'
    }

    _formatToken(token){
        let r = token.value
        let cls = token.type + (token.validate===false ? ' UNVALIDATE' : '')

        r = `<span class="${cls}">${r}</span>`
    
        return r
    }

    setFunctions(functions){
        this._functions = functions
    }

    setFields(fields){
        this._fields = fields
    }

    getValue(){
        return this._textarea.value
    }

    setValue(value){
        this._textarea.value = value
        this._render()
    }

    setDisabled(value){
        this._textarea.disabled = value
        value ? this._pre.setAttribute('disabled', '') : this._pre.removeAttribute('disabled')
    }
}
