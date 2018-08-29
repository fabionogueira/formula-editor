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
function newToken(line, col, cursor) {
    return {
        col,
        line,
        cursor,
        type: null,
        value: null,

        context: null,
        contextPos: null
    }
}

function tokenize(input) {
    let ch, token, lastIdentifier, activeContext,
        cursor = -1,
        line = 1,
        col = 0,
        list = [],
        context = [],
        contextPos = 0

    function nextChar(){
        col++
        return input[++cursor]
    }

    function nextContext(){
        if (activeContext){
            activeContext.contextPosCache = contextPos
        }

        activeContext = lastIdentifier
        activeContext.type = 'FUNCTION'

        context.push(activeContext)
        contextPos = 0
    }

    function previousContext(){
        context.pop()
        activeContext = context[context.length - 1]
        contextPos = activeContext ? activeContext.contextPosCache : null
    }

    const is = {
        digit(ch) {
            return /\d/.test(ch);
        },
        letter(ch) {
            return /[a-z]/i.test(ch);
        },
        operator(ch){
            return /\=|\+|-|\*|\/|\^|\(|\)|\{|\}|\>|\<|;|,/.test(ch);
        },
        blank(ch){
            return (ch==' ' || ch=='\t' || ch.charCodeAt(0)==160)
        }
    }

    const read = {
        number(ch){
            let value = ch
            
            while (ch = nextChar()){
                if (is.digit(ch) || ch==".") {
                    value += ch
                } else {
                    cursor--
                    col--
                    break
                }
            }
        
            return value
        },

        field(ch){
            let value = ch
        
            while (ch = nextChar()){
                value += ch
                
                if (ch == '}') {
                    break
                }
            }
            
            return value
        },

        string(ch){
            let value = ch
            let start = ch
        
            while (ch = nextChar()){
                value += ch
                
                if (start==ch) {
                    break
                }
            }
            
            return value
        },

        identifier(ch){
            let value = ch

            while (ch = nextChar()){
                if(is.letter(ch) || is.digit(ch)) {
                    value += ch
                } else {
                    cursor--
                    col--
                    break
                }
            }

            return value
        },
        
        operator(ch){
            return ch
        },
        
        whiteSpace(){
            let value = ' '

            while (ch = nextChar()){
                if(is.blank(ch)) {
                    value += ' '
                } else {
                    cursor--
                    col--
                    break
                }
            }

            return value
        }
    }

    while (ch = nextChar()) {
        token = newToken(line, col, cursor)
        
        // Newlines
        if (ch === '\n') {
            token.type = 'NEWLINE'
            token.value = ch
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
        } else if (is.digit(ch)) {
            token.type = 'NUMBER'
            token.value = read.number(ch)

        // String
        } else if (ch == '"') {
            token.type = 'STRING'
            token.value = read.string(ch)

        // Identifier
        } else if (is.letter(ch)) {
            token.value = read.identifier(ch)
            token.type = KEYWORDS.indexOf(token.value) !== -1 ? 'KEYWORD' : 'IDENTIFIER'
            if (token.type == 'IDENTIFIER'){
                lastIdentifier = token
            }

        // Operator
        } else if (is.operator(ch)) {
            if (ch == '{'){
                token.type = 'FIELD'
                token.value = read.field(ch)
            } else {
                token.type = 'OPERATOR'
                token.value = read.operator(ch)
            }

        // Whitespace handling
        } else if (is.blank(ch)) {
            token.type = 'WHITESPACE'
            token.value = read.whiteSpace()

        // If we ever hit this... we suck
        } else {
            throw new Error('Unexpected: ' + ch + ' on :')
        }

        if (lastIdentifier){
            if (token.value == '('){
                nextContext()

            } else if (token.value == ')'){
                previousContext()

            } else if (token.value == ','){
                if (activeContext){
                    contextPos++
                    // activeContext.contextPos = contextPos
                }

            }
        }

        if (activeContext){
            token.context = activeContext.value
            token.contextPos = contextPos
        }
        
        list.push(token)
    }

    return list

}

export default tokenize
