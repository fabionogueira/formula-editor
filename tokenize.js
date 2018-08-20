let text, tokenIndex, tokens
let tokensPos = {}

function isArgumentSeparator(ch) {
	return /;/.test(ch);
}

function isDigit(ch) {
	return /\d/.test(ch);
}

function isLetter(ch) {
	return /[a-z]/i.test(ch);
}

function isOperator(ch) {
	return /\=|\+|-|\*|\/|\^/.test(ch);
}

function isQuotes(ch){
    return ch == '"'
}

function validateNumber(value){
    return !isNaN(Number(value))
}

function validateFunction(name){
    return functions[name.toLowerCase()]
}

function validateField(name){
    return fields[name.toLowerCase()]
}

function validateContextVar(name){
    let context_vars = {
        '$INDEX': true
    }

    return context_vars[name]
}

function nextChar(){
    return text[tokenIndex++]
}

function isBlank(ch){
    return (ch==' ' || ch=='\t' || ch=='\n' || ch.charCodeAt(0)==160)
}

function readNumber(ch){
    let number = ch

    while (ch=nextChar()){
        if(isDigit(ch) || ch==".") {
            number += ch
        } else {
            break
        }
    }

    tokenIndex--

    return number
}

function readString(ch){
    let string = ch
    let start = ch

    while (ch=nextChar()){
        string += ch
        
        if(start==ch) {
            break
        }
    }

    return string
}

function readField(ch){
    let field = ''
    
    while (ch=nextChar()){
        if(ch=='}') {
            break
        }

        field += ch
    }

    return field
}

function readFunction(ch){
    let func = ch

    while (ch=nextChar()){
        if(isLetter(ch) || isDigit(ch)) {
            func += ch
        } else {
            break
        }
    }

    tokenIndex--

    return func
}

function readContextVar(ch){
    let cv = ch

    while (ch=nextChar()){
        if(isLetter(ch) || isDigit(ch)) {
            cv += ch
        } else {
            break
        }
    }

    tokenIndex--

    return cv
}

function tokenize(str){
    let ch, token, o, tki, func
    let argumentIndex = 0

    text = str
    tokens = []
    tokenIndex = 0
    tokensPos = {}

    while (ch=nextChar()){
        // number      
        if(isDigit(ch)) {
            tki = tokenIndex-1
            token = readNumber(ch)
            o = {
                value: token,
                type: 'number',
                validate: validateNumber(token)
            }
            tokens.push(o)
            tokensPos[tki] = o
        }
        
        // string
        else if (isQuotes(ch)){
            tki = tokenIndex-1
            o = {
                value: readString(ch),
                type: 'string',
                validate: true
            }
            tokens.push(o)
            tokensPos[tki] = o
        }

        // função
        else if (isLetter(ch)) {
            tki = tokenIndex-1
            token = func = readFunction(ch)
            argumentIndex = 0
            o = {
                value: token,
                type: 'function',
                validate: validateFunction(token)
            }
            tokens.push(o)
            tokensPos[tki] = o
        }

        // campo
        else if (ch=='{') {
            o = {
                value: '{',
                type: 'field-start',
                func,
                argumentIndex
            }
            tokens.push(o)
            tokensPos[tokenIndex-1] = o
            
            tki = tokenIndex
            token = readField(ch)

            if (token){
                o = {
                    value: token,
                    type: 'field',
                    func,
                    argumentIndex
                }
                tokens.push(o)
                tokensPos[tki] = o
            }

            if (text[tokenIndex-1] == '}'){
                o = {
                    value: '}',
                    type: 'field-end',
                    func,
                    argumentIndex
                }
                tokens.push(o)
                tokensPos[tokenIndex-1] = o
            }
        }

        // variável de contexto
        else if (ch=='$') {
            tki = tokenIndex-1
            token = readContextVar(ch)
            o = {
                value: token,
                type: 'context_var',
                validate: validateContextVar(token)
            }
            tokens.push(o)
            tokensPos[tki] = o
        }
        
        // operador
        else if (isOperator(ch)){
            tki = tokenIndex-1
            token = ch
            ch = nextChar()
            
            if (ch && ch=='='){
                token += ch 
            } else {
                tokenIndex--
            }

            o = {
                value: token,
                type: 'operator',
                validate: true
            }
            tokens.push(o)
            tokensPos[tki] = o
        }

        // separado de argumentos de função
        else if (isArgumentSeparator(ch)){
            tki = tokenIndex-1
            o = {
                value: ch,
                type: 'argument-separator',
                validate: true,
                func: func,
                argumentIndex
            }
            tokens.push(o)
            tokensPos[tki] = o

            argumentIndex++
        }

        // início/fim de argumentos de função
        else if (ch == '(' || ch == ')'){
            tki = tokenIndex-1
            o = {
                value: ch,
                type: `argument-${ch=='(' ? 'start' : 'end'}`,
                validate: true,
                func: func
            }
            tokens.push(o)
            tokensPos[tki] = o

            if (ch==')'){
                func = null
                argumentIndex = 0
            }
        }

        else if (isBlank(ch)){
            tki = tokenIndex-1
            o ={
                value: ch,
                type: 'blank',
                validate: true
            }
            tokens.push(o)
            tokensPos[tki] = o
        }

        else {
            tki = tokenIndex-1
            o = {
                value: ch,
                type: 'char',
                validate: true
            }
            tokens.push(o)
            tokensPos[tki] = o
        }
    }
    
    return tokens
}

function highlight(txt){
    let tks = tokenize(txt)
    let html = ''

    tks.forEach(token => {
        html += formatToken(token)
    })
    
    return html
}

function formatToken(token){
    let r = token.value
    let cls = token.type + (token.validate ? ' validate' : ' unvalidate')

    // switch (token.type){
    //     case 'identifier':
    //         if (r=='SUM') {
    //             r = `<span style="color:blue">${r}</span>`
    //         } else {
    //             r = `<span style="color:#c0c0c0" class="spell_error">${r}</span>`
    //         }
    //     break

    //     case 'string':
    //         r = `<span style="color:#FF9800;">${r}</span>`

    //     break

    // }

    r = `<span class="${cls}">${r}</span>`

    return r
}
