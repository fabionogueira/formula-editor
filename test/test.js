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
        this._tokenizer = new _tokenizer2.default();

        this._functions = {};
        this._fields = {};

        this._onTip = config.onTip;

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
                _this._generateTip();
            };
            textarea.onmouseup = function () {
                _this._generateTip();
            };
            textarea.oninput = function () {
                _this._render();
            };
        }
    }, {
        key: '_generateTip',
        value: function _generateTip() {
            var t = void 0,
                i = void 0,
                o = void 0,
                n = void 0,
                s = void 0,
                b = void 0,
                e = void 0;
            var tip = '';

            t = this._getParamDefinition(this._textarea.selectionStart - 1);

            if (t) {
                if (t.type == 'function' && !t.validate) {
                    for (i in this._functions) {
                        if (i.startsWith(t.value)) {
                            tip += '<p style="' + (i == t.value ? 'background:#00BCD4' : '') + '">' + i + '</p>';
                        }
                    }
                } else if (t.type == 'field' && !t.validate) {
                    for (i in this._fields) {
                        n = i.substring(0, i.length - 1);
                        if (i.startsWith(t.value)) {
                            tip += '<p style="' + (n == t.value ? 'background:#00BCD4' : '') + '">' + i + '</p>';
                        }
                    }
                } else if (t.context) {
                    o = this._functions[t.context];
                    if (o) {
                        tip = t.context + '(';
                        s = '';

                        if (o.arguments) {
                            e = false;
                            for (i = 0; i < o.arguments.length; i++) {
                                n = o.arguments[i].name;
                                b = i == t.argumentIndex;

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

            if (this._onTip) {
                this._onTip(tip);
            }
        }
    }, {
        key: '_getParamDefinition',
        value: function _getParamDefinition(position) {
            var token = void 0;
            var positions = this._tokenizer.getPositions();

            while (position >= 0) {
                token = positions[position];

                if (token && token.type != 'blank') {
                    this._validateToken(token);
                    return token;
                }

                position--;
            }
        }
    }, {
        key: '_validateToken',
        value: function _validateToken(token) {
            var tokens = this._tokenizer.getTokens();
            var j = token.index + 1;
            var i = void 0,
                tk = void 0;

            token.validate = false;

            if (token.type == 'function') {
                for (i = j; i < tokens.length; i++) {
                    tk = tokens[i];

                    if (tk.value == '(') {
                        return token.validate = this._functions[token.value] ? true : false;
                    } else if (tk.type != 'blank') {
                        return token.validate = false;
                    }
                }
            } else if (token.type == 'field') {
                token.validate = this._fields[token.value] ? true : false;
            }
        }
    }, {
        key: '_render',
        value: function _render() {
            var _this2 = this;

            var tokens = this._tokenizer.execute(this._textarea.value);
            var html = '';

            tokens.forEach(function (token) {
                if (token.type == 'function') {
                    token.validate = _this2._functions[token.value] ? true : false;
                } else if (token.type == 'field') {
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
            var cls = token.type + (token.validate ? ' validate' : ' unvalidate');

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
    }]);

    return Editor;
}();

exports.default = Editor;

window['xx'] = 0;

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @ts-check

var Tokenizer = function () {
    function Tokenizer() {
        _classCallCheck(this, Tokenizer);

        this._text = '';
        this._tokenIndex = 0;
        this._tokens = null;
        this._tokensPos = {};
    }

    _createClass(Tokenizer, [{
        key: 'isArgumentSeparator',
        value: function isArgumentSeparator(ch) {
            return (/;/.test(ch)
            );
        }
    }, {
        key: 'isDigit',
        value: function isDigit(ch) {
            return (/\d/.test(ch)
            );
        }
    }, {
        key: 'isLetter',
        value: function isLetter(ch) {
            return (/[a-z]/i.test(ch)
            );
        }
    }, {
        key: 'isOperator',
        value: function isOperator(ch) {
            return (/\=|\+|-|\*|\/|\^/.test(ch)
            );
        }
    }, {
        key: 'isQuotes',
        value: function isQuotes(ch) {
            return ch == '"';
        }
    }, {
        key: 'isBlank',
        value: function isBlank(ch) {
            return ch == ' ' || ch == '\t' || ch == '\n' || ch.charCodeAt(0) == 160;
        }
    }, {
        key: 'validateNumber',
        value: function validateNumber(value) {
            return !isNaN(Number(value));
        }
    }, {
        key: 'validateContextVar',
        value: function validateContextVar(name) {
            var context_vars = {
                '$INDEX': true
            };

            return context_vars[name];
        }
    }, {
        key: 'nextChar',
        value: function nextChar() {
            return this._text[this._tokenIndex++];
        }
    }, {
        key: 'createToken',
        value: function createToken(position, token) {
            token.index = this._tokens.length;

            this._tokens.push(token);
            this._tokensPos[position] = token;
        }
    }, {
        key: 'readNumber',
        value: function readNumber(context, ch, argumentIndex) {
            var value = ch;
            var position = this._tokenIndex - 1;

            while (ch = this.nextChar()) {
                if (this.isDigit(ch) || ch == ".") {
                    value += ch;
                } else {
                    break;
                }
            }

            this._tokenIndex--;

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'number',
                validate: this.validateNumber(value)
            });
        }
    }, {
        key: 'readString',
        value: function readString(context, ch, argumentIndex) {
            var value = ch;
            var start = ch;
            var position = this._tokenIndex - 1;

            while (ch = this.nextChar()) {
                value += ch;

                if (start == ch) {
                    break;
                }
            }

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'string'
            });
        }
    }, {
        key: 'readFunction',
        value: function readFunction(context, ch, argumentIndex) {
            var value = ch;
            var position = this._tokenIndex - 1;

            // nome da função
            while (ch = this.nextChar()) {
                if (this.isLetter(ch) || this.isDigit(ch)) {
                    value += ch;
                } else {
                    break;
                }
            }

            this._tokenIndex--;

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'function'
            });

            while (ch = this.nextChar()) {
                if (ch == '(') {
                    this.charAnalize(value, ch, 0);
                } else if (ch == ')') {
                    this.charAnalize(context, ch, argumentIndex);
                    break;
                } else {
                    this.charAnalize(value, ch, 0);
                }
            }
        }
    }, {
        key: 'readField',
        value: function readField(context, ch, argumentIndex) {
            var value = ch;
            var position = this._tokenIndex - 1;

            while (ch = this.nextChar()) {
                value += ch;

                if (ch == '}') {
                    break;
                }
            }

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'field'
            });
        }
    }, {
        key: 'readContextVar',
        value: function readContextVar(context, ch, argumentIndex) {
            var value = ch;
            var position = this._tokenIndex - 1;

            while (ch = this.nextChar()) {
                if (this.isLetter(ch) || this.isDigit(ch)) {
                    value += ch;
                } else {
                    break;
                }
            }

            this._tokenIndex--;

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'context_var'
            });
        }
    }, {
        key: 'readOperator',
        value: function readOperator(context, ch, argumentIndex) {
            var value = ch;
            var position = this._tokenIndex - 1;
            var n = this._text[this._tokenIndex];

            if (n == '=') {
                ch += n;
            }

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'operator'
            });
        }
    }, {
        key: 'readArgumentSeparator',
        value: function readArgumentSeparator(context, ch, argumentIndex) {
            var position = this._tokenIndex - 1;

            argumentIndex++;

            this.createToken(position, {
                value: ch,
                context: context,
                argumentIndex: argumentIndex,
                type: 'argument-separator'
            });

            while (ch = this.nextChar()) {

                if (ch == ')') {
                    this._tokenIndex--;
                    return;
                }

                this.charAnalize(context, ch, argumentIndex);
            }
        }
    }, {
        key: 'readArgumentStart',
        value: function readArgumentStart(context, ch, argumentIndex) {
            var position = this._tokenIndex - 1;

            this.createToken(position, {
                value: ch,
                context: context,
                argumentIndex: argumentIndex,
                type: 'argument-start'
            });

            return 'argument-start';
        }
    }, {
        key: 'readArgumentEnd',
        value: function readArgumentEnd(context, ch, argumentIndex) {
            var position = this._tokenIndex - 1;

            this.createToken(position, {
                value: ch,
                context: context,
                argumentIndex: argumentIndex,
                type: 'argument-end'
            });

            return 'argument-end';
        }
    }, {
        key: 'readBlank',
        value: function readBlank(context, ch, argumentIndex) {
            var value = ch;
            var position = this._tokenIndex - 1;

            while (ch = this.nextChar()) {
                if (this.isBlank(ch)) {
                    value += ch;
                } else {
                    break;
                }
            }

            this._tokenIndex--;

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'blank'
            });
        }
    }, {
        key: 'readOther',
        value: function readOther(context, ch, argumentIndex) {
            var value = ch;
            var position = this._tokenIndex - 1;

            this.createToken(position, {
                value: value,
                context: context,
                argumentIndex: argumentIndex,
                type: 'other'
            });
        }
    }, {
        key: 'charAnalize',
        value: function charAnalize(context, ch, argumentIndex) {
            // number      
            if (this.isDigit(ch)) {
                this.readNumber(context, ch, argumentIndex);
            }

            // string
            else if (this.isQuotes(ch)) {
                    this.readString(context, ch, argumentIndex);
                }

                // função
                else if (this.isLetter(ch)) {
                        this.readFunction(context, ch, argumentIndex);
                    }

                    // campo
                    else if (ch == '{') {
                            this.readField(context, ch, argumentIndex);
                        }

                        // variável de contexto
                        else if (ch == '$') {
                                this.readContextVar(context, ch, argumentIndex);
                            }

                            // operador
                            else if (this.isOperator(ch)) {
                                    this.readOperator(context, ch, argumentIndex);
                                }

                                // separado de argumentos de função
                                else if (this.isArgumentSeparator(ch)) {
                                        this.readArgumentSeparator(context, ch, argumentIndex);
                                    }

                                    // início de argumentos de função
                                    else if (ch == '(') {
                                            return this.readArgumentStart(context, ch, argumentIndex);
                                        }

                                        // fim de argumentos de função
                                        else if (ch == ')') {
                                                return this.readArgumentEnd(context, ch, argumentIndex);
                                            } else if (this.isBlank(ch)) {
                                                this.readBlank(context, ch, argumentIndex);
                                            } else {
                                                this.readOther(context, ch, argumentIndex);
                                            }
        }
    }, {
        key: 'execute',
        value: function execute(text) {
            var ch = void 0;

            this._text = text;
            this._tokens = [];
            this._tokenIndex = 0;
            this._tokensPos = {};

            while (ch = this.nextChar()) {
                this.charAnalize(null, ch, 0);
            }

            return this._tokens;
        }
    }, {
        key: 'getPositions',
        value: function getPositions() {
            return this._tokensPos;
        }
    }, {
        key: 'getTokens',
        value: function getTokens() {
            return this._tokens;
        }
    }]);

    return Tokenizer;
}();

exports.default = Tokenizer;

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
    '{a}': 1,
    '{bb}': 1
});

/***/ })

/******/ });
//# sourceMappingURL=test.js.map