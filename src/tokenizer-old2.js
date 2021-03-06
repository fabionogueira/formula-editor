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
    fpRegExp = /^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/,
    reRegExp = /^\/((?:\\.|\[(?:\\.|[^\]])*\]|[^\/])+)\/([gimy]*)/,
    intRegExp = /^0[xX][\da-fA-F]+|^0[0-7]*|^\d+/,
    multiCommentRegExp = /^\/\*(.|[\r\n])*?\*\//m,
    commentRegExp = /^\/\/.*/,
    identRegExp = /^[$_\w]+/,
    wsRegExp = /^[\ \t]+/,
    strRegExp = /^'([^'\\]|\\.)*'|^"([^"\\]|\\.)*"/

// Token Class ----------------------------------------------------------------
// ----------------------------------------------------------------------------
function Token() {
    this.col = 1
    this.line = 1
    this.ws = {
        indent: 0,
        before: 0,
        after: 0,
        trailing: 0
    }
    
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

Token.prototype.toString = function() {
    return '[' + (this.type + '        ').substr(0, 13) + ' ' +
            '[' + this.ws.indent + ':' + this.ws.before + ']' + this.line +
            ':' + this.col + '[' + this.ws.after + ':' + this.ws.trailing +
            ']' + ': ' + this.value + ']'
}

// Main Tokenizer function ----------------------------------------------------
// ----------------------------------------------------------------------------
function tokenize(input, tabWidth) {
    let cursor = 0,
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
        contextPosition = 0

    // Grab the inputs
    while (cursor < input.length) {

        // Save the last non-whitespace token
        if (token.type !== 'WHITESPACE') {
            lastToken = token
        }

        // Get the rest
        // We also grab the rest of the line here for regexps
        let sub = input.substring(cursor),
            subline = sub.substring(0, sub.indexOf('\n')),
            m = null

        // Create next token
        token = new Token()
        token.line = line
        token.col = col
        token.cursor = cursor
        token.ws.indent = indentation
        token.ws.before = lastToken.type === 'NEWLINE' ? 0 : spaceBefore

        // Reset whitespace
        spaceBefore = 0

        // Newlines
        if (sub[0] === '\n') {

            lastToken.ws.trailing = token.ws.before
            token.ws.before = 0

            token.type = 'NEWLINE'
            token.value = '\\n'
            token.plain = sub[0]
            col = 0
            line++

        // Multi line comments
        // don't ask how this regexp works just pray that it will never fail
        } else if ((m = sub.match(multiCommentRegExp))) {
            token.type = 'MULTI_COMMENT'
            token.plain = m[0]
            token.value = m[0].slice(2, -2)

            let lines = token.plain.split('\n')
            line += lines.length - 1
            col = lines[lines.length - 1].length - m[0].length + 1

        // Comment
        } else if ((m = subline.match(commentRegExp))) {
            token.type = 'COMMENT'
            token.plain = m[0]
            token.value = m[0].substr(2)

        // Float
        } else if ((m = sub.match(fpRegExp))) {
            token.type = 'FLOAT'
            token.plain = m[0]
            token.value = parseFloat(m[0])

        // Integer
        } else if ((m = sub.match(intRegExp))) {
            token.type = 'INTEGER'
            token.plain = m[0]
            token.value = parseInt(m[0])

        // String
        } else if ((m = sub.match(strRegExp))) {
            token.type = 'STRING'
            token.plain = m[0]
            token.value = eval(m[0]) // simpelst way to get the actual js string value, don't beat me, taken from narcissus!

        // Uncomplete String
        } else if (sub.startsWith('"')) {
            token.type = 'UNCOMPLETE_STRING'
            token.plain = sub
            token.value = sub.substring(1)
            cursor += sub.length

        // Identifier
        } else if ((m = sub.match(identRegExp))) {
            token.value = m[0]
            token.type = KEYWORDS.indexOf(token.value) !== -1 ? 'KEYWORD' : 'IDENTIFIER'
            if (token.type == 'IDENTIFIER'){
                lastIdentifier = token
            }

        // Regexp, matches online on the same line and only if we didn't encounter a identifier right before it
        } else if (lastToken.type !== 'IDENTIFIER' && (m = subline.match(reRegExp))) {
            token.type = 'REGEXP'
            token.plain = m[0]
            token.value = m[1]
            token.flags = m[2]

        // Operator
        } else if ((m = sub.match(opRegExp))) {

            // Check for assignments
            let op = OPERATORS[m[0]]
            if (op.substring(0, 6) === 'ASSIGN') {

                token.type = 'ASSIGN'
                if (op === 'ASSIGN') {
                    token.operator = null

                } else {
                    token.operator = op.substring(7)
                }

            } else {
                token.type = op
            }

            token.value = m[0]

        // Whitespace handling
        } else if ((m = sub.match(wsRegExp))) {

            token.type = 'WHITESPACE'
            token.value = m[0]

            // Provide meta information about whitespacing
            spaceBefore = m[0].replace(/\t/g, '    ').length
            if (col === 1) {
                indentation = spaceBefore

            } else {
                lastToken.ws.after = spaceBefore
            }

        // If we ever hit this... we suck
        } else {
            throw new Error('Unexpected: ' + sub[0] + ' on :')
        }

        // Add non-whitespace tokens to stream
        if (token.type !== 'WHITESPACExxx') {
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

        // Advance cursor by match length
        let len = 1
        if (m) {
            len = m[0].length + m.index
        }

        cursor += len
        col += len

    }

    return list

}

export default tokenize
