// @ts-check

export default class Tokenizer{
    constructor(){
        this._text = ''
        this._tokenIndex = 0
        this._tokens = null
        this._tokensPos = {}
    }

    isArgumentSeparator(ch) {
        return /;/.test(ch);
    }
    
    isDigit(ch) {
        return /\d/.test(ch);
    }
    
    isLetter(ch) {
        return /[a-z]/i.test(ch);
    }
    
    isOperator(ch) {
        return /\=|\+|-|\*|\/|\^/.test(ch);
    }
    
    isQuotes(ch){
        return ch == '"'
    }

    isBlank(ch){
        return (ch==' ' || ch=='\t' || ch=='\n' || ch.charCodeAt(0)==160)
    }

    validateNumber(value){
        return !isNaN(Number(value))
    }

    validateContextVar(name){
        let context_vars = {
            '$INDEX': true
        }
    
        return context_vars[name]
    }

    nextChar(){
        return this._text[this._tokenIndex++]
    }

    createToken(position,token){
        this._tokens.push(token)
        this._tokensPos[position] = token
    }

    readNumber(context, ch, argumentIndex){
        let value = ch
        let position = this._tokenIndex - 1
    
        while (ch = this.nextChar()){
            if (this.isDigit(ch) || ch==".") {
                value += ch
            } else {
                break
            }
        }
    
        this._tokenIndex--

        this.createToken(position, {
            value,
            context,
            argumentIndex,
            type: 'number',
            validate: this.validateNumber(value)
        })
    }

    readString(context, ch, argumentIndex){
        let value = ch
        let start = ch
        let position = this._tokenIndex - 1
    
        while (ch = this.nextChar()){
            value += ch
            
            if (start==ch) {
                break
            }
        }
        
        this.createToken(position, {
            value,
            context,
            argumentIndex,
            type: 'string'
        })
    }

    readFunction(context, ch, argumentIndex){
        let value = ch
        let position = this._tokenIndex - 1
        
        // nome da função
        while (ch = this.nextChar()){
            if(this.isLetter(ch) || this.isDigit(ch)) {
                value += ch
            } else {
                break
            }
        }
    
        this._tokenIndex--

        this.createToken(position, {
            value,
            context,
            argumentIndex,
            type: 'function'
        })

        while (ch = this.nextChar()){
            if (ch == '('){
                this.charAnalize(value, ch, 0)
            } else if (ch == ')'){
                this.charAnalize(context, ch, argumentIndex)
                break
            } else {
                this.charAnalize(value, ch, 0)
            }

        }
    }

    readField(context, ch, argumentIndex){
        let value = ''
        let position = this._tokenIndex - 1
        
        this.createToken(position, {
            value: '{',
            context,
            argumentIndex,
            type: 'field-start',
        })

        while (ch = this.nextChar()){
            if(ch == '}') {
                break
            }
    
            value += ch
        }

        if (value){
            this.createToken(position + 1, {
                value,
                context,
                argumentIndex,
                type: 'field'
            })
        }

        if (ch == '}'){
            position = this._tokenIndex - 1
            this.createToken(position, {
                value: '}',
                context,
                argumentIndex,
                type: 'field-end',
            })
        }
    }

    readContextVar(context, ch, argumentIndex){
        let value = ch
        let position = this._tokenIndex - 1
    
        while (ch = this.nextChar()){
            if(this.isLetter(ch) || this.isDigit(ch)) {
                value += ch
            } else {
                break
            }
        }
    
        this._tokenIndex--
        
        this.createToken(position, {
            value,
            context,
            argumentIndex,
            type: 'context_var'
        })
    }

    readOperator(context, ch, argumentIndex){
        let value = ch
        let position = this._tokenIndex - 1
        let n = this._text[this._tokenIndex]

        if ( n == '='){
            ch += n 
        }

        this.createToken(position, {
            value,
            context,
            argumentIndex,
            type: 'operator'
        })
    }

    readArgumentSeparator(context, ch, argumentIndex){
        let position = this._tokenIndex - 1

        argumentIndex++

        this.createToken(position, {
            value: ch,
            context,
            argumentIndex,
            type: 'argument-separator'
        })

        while (ch = this.nextChar()){
            
            if (ch == ')'){
                this._tokenIndex--
                return
            }
            
            this.charAnalize(context, ch, argumentIndex)
        }
    }

    readArgumentStart(context, ch, argumentIndex){
        let position = this._tokenIndex - 1
            
        this.createToken(position, {
            value: ch,
            context,
            argumentIndex,
            type: 'argument-start'
        })

        return 'argument-start'
    }

    readArgumentEnd(context, ch, argumentIndex){
        let position = this._tokenIndex - 1
            
        this.createToken(position, {
            value: ch,
            context,
            argumentIndex,
            type: 'argument-end'
        })

        return 'argument-end'
    }

    readBlank(context, ch, argumentIndex){
        let value = ch
        let position = this._tokenIndex - 1
        
        while (ch = this.nextChar()){
            if(this.isBlank(ch)) {
                value += ch
            } else {
                break
            }
        }
        
        this._tokenIndex--

        this.createToken(position, {
            value,
            context,
            argumentIndex,
            type: 'blank'
        })
    }

    readOther(context, ch, argumentIndex){
        let value = ch
        let position = this._tokenIndex - 1
        
        this.createToken(position, {
            value,
            context,
            argumentIndex,
            type: 'other'
        })
    }

    charAnalize(context, ch, argumentIndex){
        // number      
        if(this.isDigit(ch)) {
            this.readNumber(context, ch, argumentIndex)
        }
        
        // string
        else if (this.isQuotes(ch)){
            this.readString(context, ch, argumentIndex)
        }

        // função
        else if (this.isLetter(ch)) {
            this.readFunction(context, ch, argumentIndex)
        }

        // campo
        else if (ch=='{') {
            this.readField(context, ch, argumentIndex)
        }

        // variável de contexto
        else if (ch=='$') {
            this.readContextVar(context, ch, argumentIndex)
        }
        
        // operador
        else if (this.isOperator(ch)){
            this.readOperator(context, ch, argumentIndex)
        }

        // separado de argumentos de função
        else if (this.isArgumentSeparator(ch)){
            this.readArgumentSeparator(context, ch, argumentIndex)
        }
        
        // início de argumentos de função
        else if (ch == '('){
            return this.readArgumentStart(context, ch, argumentIndex)
        }

        // fim de argumentos de função
        else if (ch == ')'){
            return this.readArgumentEnd(context, ch, argumentIndex)
        }

        else if (this.isBlank(ch)){
            this.readBlank(context, ch, argumentIndex)
        }

        else {
            this.readOther(context, ch, argumentIndex)
        }
    }

    execute(text){
        let ch

        this._text = text
        this._tokens = []
        this._tokenIndex = 0
        this._tokensPos = {}

        while (ch = this.nextChar()){
            this.charAnalize(null, ch, 0)
        }

        return this._tokens;

    }

    getPositions(){
        return this._tokensPos
    }
}



