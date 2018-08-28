/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/editor.js":
/*!***********************!*\
  !*** ./src/editor.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // @ts-check

var _tokenizer = __webpack_require__(/*! ./tokenizer */ "./src/tokenizer.js");

var _tokenizer2 = _interopRequireDefault(_tokenizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Editor = function () {
    function Editor(element) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Editor);

        this._config(config);

        element.innerHTML = '<div class="formula-editor">\n                <pre class="formula-editor-pre"> </pre>\n                <textarea class="formula-editor-textarea" spellcheck="false"></textarea>\n            </div>';

        this._pre = element.querySelector('pre');
        this._textarea = element.querySelector('textarea');

        this._functions = {};
        this._fields = {};

        this._onTip = config.onTip;
        this._onChange = config.onChange;

        this.onchange = null;
        this.onblur = null;

        this._initEvents();
    }

    _createClass(Editor, [{
        key: '_config',
        value: function _config(config) {}
    }, {
        key: '_initEvents',
        value: function _initEvents() {
            var _this = this;

            var textarea = this._textarea;
            var pre = this._pre;

            textarea.onscroll = function () {
                pre.style.top = -textarea.scrollTop + 'px';
                pre.style.left = textarea.scrollLeft + 'px';
            };
            textarea.onkeydown = function (event) {
                var value1 = void 0,
                    value2 = void 0,
                    position = void 0;

                if (event.keyCode == 9) {
                    event.preventDefault();

                    position = textarea.selectionStart + 4;
                    value1 = textarea.value.substring(0, textarea.selectionStart);
                    value2 = textarea.value.substring(textarea.selectionEnd, textarea.value.length);

                    textarea.value = value1 + '    ' + value2;
                    textarea.selectionStart = position;
                    textarea.selectionEnd = position;
                    textarea.focus();

                    _this._render();

                    return false;
                }
            };
            textarea.onkeyup = function () {
                // this._generateTip()
            };
            textarea.onmouseup = function () {
                // this._generateTip()
            };
            textarea.oninput = function () {
                _this._render();

                if (_this._onChange) {
                    _this._onChange(_this._textarea.value);
                }

                if (_this.onchange) _this.onchange(_this._textarea.value);
            };
            textarea.onblur = function () {
                if (_this.onblur) _this.onblur();
            };
        }

        // _generateTip(){
        //     let t, i, o, n, s, b, e
        //     let tip = ''

        //     t = this._getParamDefinition(this._textarea.selectionStart -1)

        //     if (t){
        //         if (t.type=='function' && !t.validate){
        //             for (i in this._functions){
        //                 if (i.startsWith(t.value)){
        //                     tip += `<p style="${i==t.value ? 'background:#00BCD4' : ''}">${i}</p>`
        //                 }
        //             }
        //         } else if (t.type=='field' && !t.validate){
        //             for (i in this._fields){
        //                 n = i.substring(0, i.length - 1)
        //                 if (i.startsWith(t.value)){
        //                     tip += `<p style="${n==t.value ? 'background:#00BCD4' : ''}">${i}</p>`
        //                 }
        //             }
        //         } else if (t.context){
        //             o = this._functions[t.context]
        //             if (o){
        //                 tip = t.context + '('
        //                 s = ''

        //                 if (o.arguments){
        //                     e = false
        //                     for (i=0; i<o.arguments.length; i++){
        //                         n = o.arguments[i].name
        //                         b = (i == t.argumentIndex)

        //                         if (b){
        //                             e = true
        //                         }

        //                         tip += s + ( b || (i==o.arguments.length-1 && !e && o.arguments[i].several) ? `<b style="background:#f3dd9b">${n}</b>` : n)
        //                         s = '; '
        //                     }

        //                     tip += ')'
        //                 }
        //             }

        //         }
        //     }

        //     if (this._onTip){
        //         this._onTip(tip)
        //     }
        // }

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

    }, {
        key: '_render',
        value: function _render() {
            var _this2 = this;

            var tokens = (0, _tokenizer2.default)(this._textarea.value).all();
            var html = '';

            tokens.forEach(function (token) {
                if (token.type == 'FUNCTION') {
                    token.validate = _this2._functions[token.value] ? true : false;
                } else if (token.type == 'IDENTIFIER') {
                    token.validate = _this2._fields[token.value] ? true : false;
                } else if (token.type == 'STRING') {
                    token.value = '"' + token.value + '"';
                } else if (token.type == 'UNCOMPLETE_STRING') {
                    token.value = '"' + token.value;
                }

                html += _this2._formatToken(token);
            });

            this._pre.innerHTML = html + ' \n';
            this._textarea.style.height = this._pre.offsetHeight + 'px';
        }
    }, {
        key: '_formatToken',
        value: function _formatToken(token) {
            var r = token.value;
            var cls = token.type + (token.validate === false ? ' UNVALIDATE' : '');
            var space = '                                    ';

            r = '<span class="' + cls + '">' + (space.substring(0, token.ws.before) + r) + '</span>';

            return r;
        }
    }, {
        key: 'setFunctions',
        value: function setFunctions(functions) {
            this._functions = functions;
        }
    }, {
        key: 'setFields',
        value: function setFields(fields) {
            this._fields = fields;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this._textarea.value;
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            this._textarea.value = value;
            this._render();
        }
    }, {
        key: 'setDisabled',
        value: function setDisabled(value) {
            this._textarea.disabled = value;
            value ? this._pre.setAttribute('disabled', '') : this._pre.removeAttribute('disabled');
        }
    }]);

    return Editor;
}();

exports.default = Editor;

/***/ }),

/***/ "./src/tokenizer.js":
/*!**************************!*\
  !*** ./src/tokenizer.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
  * Simple JavaScript tokenizer (not a full parser!!!)
  *
  * Portions taken from Narcissus by Brendan Eich <brendan@mozilla.org>.
  */

/* jshint evil: true, regexdash: false, regexp: false */

var KEYWORDS = ['break', 'case', 'catch', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'false', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'null', 'return', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with'];

var OPERATORS = {
    '>>>=': 'ASSIGN_URSH',
    '>>=': 'ASSIGN_RSH',
    '<<=': 'ASSIGN_LSH',
    '|=': 'ASSIGN_BITWISE_OR',
    '^=': 'ASSIGN_BITWISE_XOR',
    '&=': 'ASSIGN_BITWISE_AND',
    '+=': 'ASSIGN_PLUS',
    '-=': 'ASSIGN_MINUS',
    '*=': 'ASSIGN_MUL',
    '/=': 'ASSIGN_DIV',
    '%=': 'ASSIGN_MOD',
    ';': 'SEMICOLON',
    ',': 'COMMA',
    '?': 'HOOK',
    ':': 'COLON',
    '||': 'OR',
    '&&': 'AND',
    '|': 'BITWISE_OR',
    '^': 'BITWISE_XOR',
    '&': 'BITWISE_AND',
    '===': 'STRICT_EQ',
    '==': 'EQ',
    '=': 'ASSIGN',
    '!==': 'STRICT_NE',
    '!=': 'NE',
    '<<': 'LSH',
    '<=': 'LE',
    '<': 'LT',
    '>>>': 'URSH',
    '>>': 'RSH',
    '>=': 'GE',
    '>': 'GT',
    '++': 'INCREMENT',
    '--': 'DECREMENT',
    '+': 'PLUS',
    '-': 'MINUS',
    '*': 'MUL',
    '/': 'DIV',
    '%': 'MOD',
    '!': 'NOT',
    '~': 'BITWISE_NOT',
    '.': 'DOT',
    '[': 'LEFT_BRACKET',
    ']': 'RIGHT_BRACKET',
    '{': 'LEFT_CURLY',
    '}': 'RIGHT_CURLY',
    '(': 'LEFT_PAREN',
    ')': 'RIGHT_PAREN'
};

// Regular Expressions --------------------------------------------------------
// ----------------------------------------------------------------------------
var opMatch = '^';
for (var i in OPERATORS) {

    if (opMatch !== '^') {
        opMatch += '|^';
    }

    opMatch += i.replace(/[?|^&(){}\[\]+\-*\/\.]/g, '\\$&');
}

var opRegExp = new RegExp(opMatch),
    fpRegExp = /^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/,
    reRegExp = /^\/((?:\\.|\[(?:\\.|[^\]])*\]|[^\/])+)\/([gimy]*)/,
    intRegExp = /^0[xX][\da-fA-F]+|^0[0-7]*|^\d+/,
    multiCommentRegExp = /^\/\*(.|[\r\n])*?\*\//m,
    commentRegExp = /^\/\/.*/,
    identRegExp = /^[$_\w]+/,
    wsRegExp = /^[\ \t]+/,
    strRegExp = /^'([^'\\]|\\.)*'|^"([^"\\]|\\.)*"/;

// Token Class ----------------------------------------------------------------
// ----------------------------------------------------------------------------
function Token() {

    this.col = 1;
    this.line = 1;
    this.ws = {
        indent: 0,
        before: 0,
        after: 0,
        trailing: 0
    };

    this.type = null;
    this.value = null;
    this.plain = null;
}

Token.prototype.toString = function () {
    return '[' + (this.type + '        ').substr(0, 13) + ' ' + '[' + this.ws.indent + ':' + this.ws.before + ']' + this.line + ':' + this.col + '[' + this.ws.after + ':' + this.ws.trailing + ']' + ': ' + this.value + ']';
};

// Main Tokenizer function ----------------------------------------------------
// ----------------------------------------------------------------------------
function tokenize(input, tabWidth) {
    var cursor = 0,
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
        contextPosition = 0;

    // Grab the inputs
    while (cursor < input.length) {

        // Save the last non-whitespace token
        if (token.type !== 'WHITESPACE') {
            lastToken = token;
        }

        // Get the rest
        // We also grab the rest of the line here for regexps
        var sub = input.substring(cursor),
            subline = sub.substring(0, sub.indexOf('\n')),
            m = null;

        // Create next token
        token = new Token();
        token.line = line;
        token.col = col;
        token.ws.indent = indentation;
        token.ws.before = lastToken.type === 'NEWLINE' ? 0 : spaceBefore;

        // Reset whitespace
        spaceBefore = 0;

        // Newlines
        if (sub[0] === '\n') {

            lastToken.ws.trailing = token.ws.before;
            token.ws.before = 0;

            token.type = 'NEWLINE';
            token.value = '\\n';
            token.plain = sub[0];
            col = 0;
            line++;

            // Multi line comments
            // don't ask how this regexp works just pray that it will never fail
        } else if (m = sub.match(multiCommentRegExp)) {
            token.type = 'MULTI_COMMENT';
            token.plain = m[0];
            token.value = m[0].slice(2, -2);

            var lines = token.plain.split('\n');
            line += lines.length - 1;
            col = lines[lines.length - 1].length - m[0].length + 1;

            // Comment
        } else if (m = subline.match(commentRegExp)) {
            token.type = 'COMMENT';
            token.plain = m[0];
            token.value = m[0].substr(2);

            // Float
        } else if (m = sub.match(fpRegExp)) {
            token.type = 'FLOAT';
            token.plain = m[0];
            token.value = parseFloat(m[0]);

            // Integer
        } else if (m = sub.match(intRegExp)) {
            token.type = 'INTEGER';
            token.plain = m[0];
            token.value = parseInt(m[0]);

            // String
        } else if (m = sub.match(strRegExp)) {
            token.type = 'STRING';
            token.plain = m[0];
            token.value = eval(m[0]); // simpelst way to get the actual js string value, don't beat me, taken from narcissus!

            // Uncomplete String
        } else if (sub.startsWith('"')) {
            token.type = 'UNCOMPLETE_STRING';
            token.plain = sub;
            token.value = sub.substring(1);
            cursor += sub.length;

            // Identifier
        } else if (m = sub.match(identRegExp)) {
            token.value = m[0];
            token.type = KEYWORDS.indexOf(token.value) !== -1 ? 'KEYWORD' : 'IDENTIFIER';
            if (token.type == 'IDENTIFIER') {
                lastIdentifier = token;
            }

            // Regexp, matches online on the same line and only if we didn't encounter a identifier right before it
        } else if (lastToken.type !== 'IDENTIFIER' && (m = subline.match(reRegExp))) {
            token.type = 'REGEXP';
            token.plain = m[0];
            token.value = m[1];
            token.flags = m[2];

            // Operator
        } else if (m = sub.match(opRegExp)) {

            // Check for assignments
            var op = OPERATORS[m[0]];
            if (op.substring(0, 6) === 'ASSIGN') {

                token.type = 'ASSIGN';
                if (op === 'ASSIGN') {
                    token.operator = null;
                } else {
                    token.operator = op.substring(7);
                }
            } else {
                token.type = op;
            }

            token.value = m[0];

            // Whitespace handling
        } else if (m = sub.match(wsRegExp)) {

            token.type = 'WHITESPACE';

            // Provide meta information about whitespacing
            spaceBefore = m[0].replace(/\t/g, '    ').length;
            if (col === 1) {
                indentation = spaceBefore;
            } else {
                lastToken.ws.after = spaceBefore;
            }

            // If we ever hit this... we suck
        } else {
            throw new Error('Unexpected: ' + sub[0] + ' on :');
        }

        // Add non-whitespace tokens to stream
        if (token.type !== 'WHITESPACE') {
            if (lastIdentifier) {
                if (token.value == '(') {
                    activeContext = lastIdentifier;
                    lastIdentifier.type = 'FUNCTION';
                    context.push(lastIdentifier);

                    contextPosition = 0;
                    activeContext.argumentCount = 1;
                } else if (token.value == ')') {
                    context.pop();
                    activeContext = context[context.length - 1];
                } else if (token.value == ',') {
                    if (activeContext) {
                        contextPosition++;
                        activeContext.argumentCount = contextPosition + 1;
                    }
                }
            }

            token.context = activeContext ? activeContext.value : null;
            token.contextPos = token.context ? contextPosition : null;

            list.push(token);
        }

        // Advance cursor by match length
        var len = 1;
        if (m) {
            len = m[0].length + m.index;
        }

        cursor += len;
        col += len;
    }

    // Return some API for ya
    var tokenPos = -1;
    return {
        peek: function peek() {
            return list[tokenPos + 1];
        },

        next: function next() {
            return list[++tokenPos];
        },

        get: function get() {
            return list[tokenPos];
        },

        all: function all() {
            return list;
        },

        at: function at(pos) {
            return list[pos];
        },

        reset: function reset() {
            tokenPos = 0;
        }

    };
}

exports.default = tokenize;

/***/ }),

/***/ "./test/index.js":
/*!***********************!*\
  !*** ./test/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _editor = __webpack_require__(/*! ../src/editor */ "./src/editor.js");

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var editor = new _editor2.default(document.getElementById('editor'), {
    onTip: function onTip(tip) {
        document.getElementById('tip').innerHTML = tip;
    }
}); // @ts-check

editor.setFunctions({
    'sum': {
        arguments: [{
            name: 'start',
            type: 'text',
            description: 'a primeira {context} do intervalo de soma'
        }, {
            name: 'end',
            type: 'text',
            description: 'a última {context} do intervalo de soma'
        }]
    },
    'value': {
        arguments: [{
            name: 'field',
            type: 'field',
            description: 'campo a definir o valor'
        }]
    },
    'values': {
        arguments: [{
            name: 'field1',
            type: 'field',
            description: 'campo a definir o valor'
        }, {
            name: 'field2',
            type: 'field',
            description: 'campo a definir o valor'
        }, {
            name: '[optional ...]',
            type: 'field',
            several: true,
            description: 'campo a definir o valor'
        }]
    },
    'if': {
        arguments: [{
            name: 'condition',
            type: 'boolean',
            description: 'expressão a ser avaliada'
        }, {
            name: 'valueIfTrue',
            type: 'field',
            description: 'campo a definir o valor'
        }, {
            name: 'valueIfFalse',
            type: 'field',
            description: 'campo a definir o valor'
        }]
    },
    'valuex': true
});

editor.setFields({
    'a': 1,
    'bb': 1
});

/***/ })

/******/ });
//# sourceMappingURL=test.js.map