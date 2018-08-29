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
                if (_this._onTip) {
                    _this._onTip(_this._getActiveToken());
                }
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
    }, {
        key: '_getActiveToken',
        value: function _getActiveToken() {
            var tokens = this._tokens || [];
            var p = this._textarea.selectionStart - 1;
            var index = tokens.findIndex(function (tk) {
                return tk.cursor >= p;
            });
            var token = tokens[index];

            if (!token) {
                token = tokens[0];
            } else if (token.cursor > p && p >= 0) {
                token = tokens[index - 1];
            }

            return token;
        }
    }, {
        key: '_render',
        value: function _render() {
            var _this2 = this;

            var tokens = this._tokens = (0, _tokenizer2.default)(this._textarea.value);
            var html = '';

            console.log(tokens);

            tokens.forEach(function (token) {
                if (token.type == 'FUNCTION') {
                    token.validate = _this2._functions[token.value] ? true : false;
                } else if (token.type == 'FIELD') {
                    token.validate = _this2._fields[token.value] ? true : false;
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

            r = '<span class="' + cls + '">' + r + '</span>';

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
// https://gist.github.com/BonsaiDen/1810887

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

    // Regular Expressions --------------------------------------------------------
    // ----------------------------------------------------------------------------
};var opMatch = '^';
for (var i in OPERATORS) {
    if (opMatch !== '^') {
        opMatch += '|^';
    }

    opMatch += i.replace(/[?|^&(){}\[\]+\-*\/\.]/g, '\\$&');
}

var opRegExp = new RegExp(opMatch),
    wsRegExp = /^[\ \t]+/,
    strRegExp = /^'([^'\\]|\\.)*'|^"([^"\\]|\\.)*"/;

// Token Class ----------------------------------------------------------------
// ----------------------------------------------------------------------------
function newToken(line, col, cursor) {
    return {
        col: col,
        line: line,
        cursor: cursor,
        type: null,
        value: null,

        context: null,
        contextPos: null
    };
}

function tokenize(input) {
    var ch = void 0,
        token = void 0,
        lastIdentifier = void 0,
        activeContext = void 0,
        cursor = -1,
        line = 1,
        col = 0,
        list = [],
        context = [],
        contextPos = 0;

    function nextChar() {
        col++;
        return input[++cursor];
    }

    function nextContext() {
        if (activeContext) {
            activeContext.contextPosCache = contextPos;
        }

        activeContext = lastIdentifier;
        activeContext.type = 'FUNCTION';

        context.push(activeContext);
        contextPos = 0;
    }

    function previousContext() {
        context.pop();
        activeContext = context[context.length - 1];
        contextPos = activeContext ? activeContext.contextPosCache : null;
    }

    var is = {
        digit: function digit(ch) {
            return (/\d/.test(ch)
            );
        },
        letter: function letter(ch) {
            return (/[a-z]/i.test(ch)
            );
        },
        operator: function operator(ch) {
            return (/\=|\+|-|\*|\/|\^|\(|\)|\{|\}|\>|\<|;|,/.test(ch)
            );
        },
        blank: function blank(ch) {
            return ch == ' ' || ch == '\t' || ch.charCodeAt(0) == 160;
        }
    };

    var read = {
        number: function number(ch) {
            var value = ch;

            while (ch = nextChar()) {
                if (is.digit(ch) || ch == ".") {
                    value += ch;
                } else {
                    cursor--;
                    col--;
                    break;
                }
            }

            return value;
        },
        field: function field(ch) {
            var value = ch;

            while (ch = nextChar()) {
                value += ch;

                if (ch == '}') {
                    break;
                }
            }

            return value;
        },
        string: function string(ch) {
            var value = ch;
            var start = ch;

            while (ch = nextChar()) {
                value += ch;

                if (start == ch) {
                    break;
                }
            }

            return value;
        },
        identifier: function identifier(ch) {
            var value = ch;

            while (ch = nextChar()) {
                if (is.letter(ch) || is.digit(ch)) {
                    value += ch;
                } else {
                    cursor--;
                    col--;
                    break;
                }
            }

            return value;
        },
        operator: function operator(ch) {
            return ch;
        },
        whiteSpace: function whiteSpace() {
            var value = ' ';

            while (ch = nextChar()) {
                if (is.blank(ch)) {
                    value += ' ';
                } else {
                    cursor--;
                    col--;
                    break;
                }
            }

            return value;
        }
    };

    while (ch = nextChar()) {
        token = newToken(line, col, cursor);

        // Newlines
        if (ch === '\n') {
            token.type = 'NEWLINE';
            token.value = ch;
            col = 0;
            line++;

            // Multi line comments
            // don't ask how this regexp works just pray that it will never fail
        } else if (ch == '/' && input[cursor + 1] == '*') {
            token.type = 'MULTI_COMMENT';

            var lines = token.plain.split('\n');
            line += lines.length - 1;
            // col = lines[lines.length - 1].length - m[0].length + 1

            // Comment
        } else if (ch == '/' && input[cursor + 1] == '/') {
            token.type = 'COMMENT';
            token.value = ''; // m[0].substr(2)

            // Float
        } else if (is.digit(ch)) {
            token.type = 'NUMBER';
            token.value = read.number(ch);

            // String
        } else if (ch == '"') {
            token.type = 'STRING';
            token.value = read.string(ch);

            // Identifier
        } else if (is.letter(ch)) {
            token.value = read.identifier(ch);
            token.type = KEYWORDS.indexOf(token.value) !== -1 ? 'KEYWORD' : 'IDENTIFIER';
            if (token.type == 'IDENTIFIER') {
                lastIdentifier = token;
            }

            // Operator
        } else if (is.operator(ch)) {
            if (ch == '{') {
                token.type = 'FIELD';
                token.value = read.field(ch);
            } else {
                token.type = 'OPERATOR';
                token.value = read.operator(ch);
            }

            // Whitespace handling
        } else if (is.blank(ch)) {
            token.type = 'WHITESPACE';
            token.value = read.whiteSpace();

            // If we ever hit this... we suck
        } else {
            throw new Error('Unexpected: ' + ch + ' on :');
        }

        if (lastIdentifier) {
            if (token.value == '(') {
                nextContext();
            } else if (token.value == ')') {
                previousContext();
            } else if (token.value == ',') {
                if (activeContext) {
                    contextPos++;
                    // activeContext.contextPos = contextPos
                }
            }
        }

        if (activeContext) {
            token.context = activeContext.value;
            token.contextPos = contextPos;
        }

        list.push(token);
    }

    return list;
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
    onTip: function onTip(token) {
        generateTip(token);
    }
}); // @ts-check

function generateTip(token) {
    var i = void 0,
        o = void 0,
        n = void 0,
        s = void 0,
        b = void 0,
        e = void 0;
    var tip = '';

    if (token) {
        document.getElementById('console').innerHTML = '\ncursor     = ' + token.cursor + '\ncol        = ' + token.col + '\ncontext    = ' + token.context + '\ncontextPos = ' + token.contextPos + '\nvalue      = ' + token.value;
    } else {
        document.getElementById('console').innerHTML = '';
    }

    if (token) {
        if (token.type == 'FUNCTION' && !token.validate) {
            for (i in functions) {
                if (i.startsWith(token.value)) {
                    tip += '<p style="' + (i == token.value ? 'background:#00BCD4' : '') + '">' + i + '</p>';
                }
            }
        } else if (token.type == 'IDENTIFIER' && !token.validate) {
            for (i in fields) {
                n = i.substring(0, i.length - 1);
                if (i.startsWith(token.value)) {
                    tip += '<p style="' + (n == token.value ? 'background:#00BCD4' : '') + '">' + i + '</p>';
                }
            }
        } else if (token.context) {
            o = functions[token.context];
            if (o) {
                tip = token.context + '(';
                s = '';

                if (o.arguments) {
                    e = false;
                    for (i = 0; i < o.arguments.length; i++) {
                        n = o.arguments[i].name;
                        b = i == token.contextPos;

                        if (b) {
                            e = true;
                        }

                        tip += s + (b || i == o.arguments.length - 1 && !e && o.arguments[i].several ? '<b style="background:#f3dd9b">' + n + '</b>' : n);
                        s = '; ';
                    }

                    tip += ')';
                }
            }
        }
    }

    document.getElementById('tip').innerHTML = tip;
}

var functions = {
    'SUM': {
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
    'VALUE': {
        arguments: [{
            name: 'field',
            type: 'field',
            description: 'campo a definir o valor'
        }]
    },
    'VALUES': {
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
    'IF': {
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
    'VALUEX': true
};
var fields = {
    '{a}': 1,
    '{bb}': 1
};

editor.setFunctions(functions);
editor.setFields(fields);

/***/ })

/******/ });
//# sourceMappingURL=test.js.map