// @ts-check

// https://gist.github.com/BonsaiDen/1810887

/**
  * Simple JavaScript tokenizer (not a full parser!!!)
  *
  * Portions taken from Narcissus by Brendan Eich <brendan@mozilla.org>.
  */

/* jshint evil: true, regexdash: false, regexp: false */

let KEYWORDS = [
    'break',
    'case', 'catch', 'const', 'continue',
    'debugger', 'default', 'delete', 'do',
    'else', 'enum',
    'false', 'finally', 'for', 'function',
    'if', 'in', 'instanceof',
    'new', 'null',
    'return',
    'switch',
    'this', 'throw', 'true', 'try', 'typeof',
    'var', 'void',
    'while', 'with'
]

let OPERATORS = {
    '>>>=': 'ASSIGN_URSH',
    '>>=':  'ASSIGN_RSH',
    '<<=':  'ASSIGN_LSH',
    '|=':   'ASSIGN_BITWISE_OR',
    '^=':   'ASSIGN_BITWISE_XOR',
    '&=':   'ASSIGN_BITWISE_AND',
    '+=':   'ASSIGN_PLUS',
    '-=':   'ASSIGN_MINUS',
    '*=':   'ASSIGN_MUL',
    '/=':   'ASSIGN_DIV',
    '%=':   'ASSIGN_MOD',
    ';':    'SEMICOLON',
    ',':    'COMMA',
    '?':    'HOOK',
    ':':    'COLON',
    '||':   'OR',
    '&&':   'AND',
    '|':    'BITWISE_OR',
    '^':    'BITWISE_XOR',
    '&':    'BITWISE_AND',
    '===':  'STRICT_EQ',
    '==':   'EQ',
    '=':    'ASSIGN',
    '!==':  'STRICT_NE',
    '!=':   'NE',
    '<<':   'LSH',
    '<=':   'LE',
    '<':    'LT',
    '>>>':  'URSH',
    '>>':   'RSH',
    '>=':   'GE',
    '>':    'GT',
    '++':   'INCREMENT',
    '--':   'DECREMENT',
    '+':    'PLUS',
    '-':    'MINUS',
    '*':    'MUL',
    '/':    'DIV',
    '%':    'MOD',
    '!':    'NOT',
    '~':    'BITWISE_NOT',
    '.':    'DOT',
    '[':    'LEFT_BRACKET',
    ']':    'RIGHT_BRACKET',
    '{':    'LEFT_CURLY',
    '}':    'RIGHT_CURLY',
    '(':    'LEFT_PAREN',
    ')':    'RIGHT_PAREN'
}

// Regular Expressions --------------------------------------------------------
// ----------------------------------------------------------------------------
let opMatch = '^'
for (let i in OPERATORS) {
    if (opMatch !== '^') {
        opMatch += '|^'
    }

    opMatch += i.replace(/[?|^&(){}\[\]+\-*\/\.]/g, '\\$&')
}

let opRegExp = new RegExp(opMatch),
    wsRegExp = /^[\ \t]+/,
    strRegExp = /^'([^'\\]|\\.)*'|^"([^"\\]|\\.)*"/

// Token Class ----------------------------------------------------------------
// ----------------------------------------------------------------------------
function Token() {
    this.col = 1
    this.line = 1
    this.context = null
    this.contextPos = null
    this.argumentCount = null
    this.cursor = null
    this.flags = null
    this.operator = null
    this.type = null
    this.value = null
    this.plain = null
    this.validate = null
}

// Main Tokenizer function ----------------------------------------------------
// ----------------------------------------------------------------------------
function tokenize(input, tabWidth) {
    let cursor = -1,
        line = 1,
        col = 0,
        spaceBefore = 0,
        indentation = 0,
        // tabExpand = new Array((tabWidth || 4)).join(' '),
        token = new Token(),
        lastToken = null,
        lastIdentifier = null,
        activeContext = null,
        list = [],
        context = [],
        contextPosition = 0,
        ch,
        length = input.length

    function nextChar(){
        col++
        return input[++cursor]
    }

    function isDigit(ch) {
        return /\d/.test(ch);
    }

    function isLetter(ch) {
        return /[a-z]/i.test(ch);
    }

    function isOperator(ch){
        return /\=|\+|-|\*|\/|\^|\(|\)/.test(ch);
    }

    function isBlank(ch){
        return (ch==' ' || ch=='\t' || ch.charCodeAt(0)==160)
    }

    function readNumber(ch){
        let value = ch
        
        while (ch = nextChar()){
            if (isDigit(ch) || ch==".") {
                value += ch
            } else {
                cursor--
                col--
                break
            }
        }
    
        return value
    }

    function readString(ch){
        let value = ch
        let start = ch
    
        while (ch = nextChar()){
            value += ch
            
            if (start==ch) {
                break
            }
        }
        
        return value
    }

    function readIdentifier(ch){
        let value = ch

        while (ch = nextChar()){
            if(isLetter(ch) || isDigit(ch)) {
                value += ch
            } else {
                cursor--
                col--
                break
            }
        }

        return value
    }

    function readOperator(ch){
        return ch
    }

    function readWhiteSpace(){
        let value = ' '

        while (ch = nextChar()){
            if(isBlank(ch)) {
                value += ' '
            } else {
                cursor--
                col--
                break
            }
        }

        return value
    }

    while (ch = nextChar()) {

        // Save the last non-whitespace token
        if (token.type !== 'WHITESPACE') {
            lastToken = token
        }

        // Create next token
        token = new Token()
        token.line = line
        token.col = col
        token.cursor = cursor

        // Newlines
        if (ch === '\n') {
            token.type = 'NEWLINE'
            token.value = '\\n'
            col = 0
            line++

        // Multi line comments
        // don't ask how this regexp works just pray that it will never fail
        } else if (ch == '/' && input[cursor+1] == '*') {
            token.type = 'MULTI_COMMENT'
            
            let lines = token.plain.split('\n')
            line += lines.length - 1
            // col = lines[lines.length - 1].length - m[0].length + 1

        // Comment
        } else if (ch == '/' && input[cursor+1] == '/') {
            token.type = 'COMMENT'
            token.value = '' // m[0].substr(2)

        // Float
        } else if (isDigit(ch)) {
            token.type = 'NUMBER'
            token.value = readNumber(ch)

        // String
        } else if (ch == '"') {
            token.type = 'STRING'
            token.value = readString(ch)

        // Identifier
        } else if (isLetter(ch)) {
            token.value = readIdentifier(ch)
            token.type = KEYWORDS.indexOf(token.value) !== -1 ? 'KEYWORD' : 'IDENTIFIER'
            if (token.type == 'IDENTIFIER'){
                lastIdentifier = token
            }

        // Operator
        } else if (isOperator(ch)) {
            token.type = 'OPERATOR'
            token.value = readOperator(ch)

        // Whitespace handling
        } else if (isBlank(ch)) {
            token.type = 'WHITESPACE'
            token.value = readWhiteSpace()

        // If we ever hit this... we suck
        } else {
            throw new Error('Unexpected: ' + ch + ' on :')
        }

        if (lastIdentifier){
            if (token.value == '('){
                activeContext = lastIdentifier
                lastIdentifier.type = 'FUNCTION'
                context.push(lastIdentifier)

                contextPosition = 0
                activeContext.argumentCount = 1

            } else if (token.value == ')'){
                context.pop()
                activeContext = context[context.length - 1]

            } else if (token.value == ','){
                if (activeContext){
                    contextPosition++
                    activeContext.argumentCount = contextPosition + 1
                }

            }
        }

        token.context = activeContext ? activeContext.value : null
        token.contextPos = token.context ? contextPosition : null
        
        list.push(token)
    }

    return list

}

export default tokenize
