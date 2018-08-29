// @ts-check

import tokenizer from './tokenizer'

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
            // this._generateTip()
            if (this._onTip){
                this._onTip(this._getActiveToken())
            }
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

    _getActiveToken(){
        let tokens = this._tokens || []
        let p = this._textarea.selectionStart -1
        let index = tokens.findIndex((tk) => {return tk.cursor >= p})
        let token = tokens[index]

        if (!token){
            token = tokens[0]
        }else if (token.cursor > p && p >= 0){
            token = tokens[index - 1]
        }

        return token
    }

    _render(){
        let tokens = this._tokens = tokenizer(this._textarea.value)
        let html = ''
        
        console.log(tokens)
        
        tokens.forEach(token => {
            if (token.type == 'FUNCTION'){
                token.validate = this._functions[token.value] ? true : false
            } else if (token.type == 'FIELD'){
                token.validate = this._fields[token.value] ? true : false
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
