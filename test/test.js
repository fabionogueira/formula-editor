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
        var _this = this;

        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Editor);

        element.init = function () {
            var body = void 0;

            delete element.init;

            _this._background = element.children[0].children[0];
            _this._editor = element.children[0].children[1];

            _this._initIframe(_this._background, _this._backgroundStyle);
            _this._initIframe(_this._editor, _this._editorStyle);

            body = _this._editor.contentDocument.body;
            body.innerHTML = '<pre style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:1;margin:0;padding:6px;overflow:auto" spellcheck="false" contenteditable="true"></pre>\n                 <div class="caret" style="left:6px;top:4px"></div>';

            _this._caret = body.children[1];

            _this._showCaret(false);
            _this._initEvents();
        };

        this._config(config);

        element.innerHTML = '<div class="formula-editor" style="position:relative;width:100%;height:100%">\n            <iframe frameborder="0" class="formula-1"></iframe>\n            <iframe frameborder="0" class="formula-2" onload="this.parentNode.parentNode.init();"></iframe>\n        </div>';

        this._onTip = config.onTip;
        this._functions = {};
        this._fields = {};
        this._tokenizer = new _tokenizer2.default();
        this._activeCaretRange = null;
    }

    _createClass(Editor, [{
        key: '_initIframe',
        value: function _initIframe(frameElement, styles) {
            var doc = frameElement.contentDocument;
            var style = doc.createElement('style');

            style.type = 'text/css';
            style.innerHTML = '* {font-family: monospace; }\n' + (styles ? styles : '');

            frameElement.contentDocument.body.style.overflow = 'hidden';
            frameElement.contentDocument.head.appendChild(style);
        }
    }, {
        key: '_config',
        value: function _config(config) {
            this._backgroundStyle = '\n            .string{\n                color: #FFC107\n            }\n            .function, .field, .context_var{\n                color: #c0c0c0\n            }\n            .function.validate{\n                color:blue\n            }\n            .field-start, .field-end, .field.validate{\n                color:#009688\n            }\n            .context_var.validate{\n                font-weight: bold;\n                color: #000;\n            }\n            .operator{\n                color: #9C27B0;\n            }\n            .number.unvalidate {\n                color: red;\n                /* background-image: url(wiggle.png);\n                background-repeat: repeat-x;\n                background-position: bottom; */\n            }\n            pre{\n                padding:0;margin:0\n            }\n            body{\n                padding:6px;margin:0\n            }\n            ';
            this._editorStyle = '\n            .caret {\n                position:absolute;\n                height:19px;\n                width:1px;\n                background: black;\n                /*animation: 1s blink step-end infinite;\n                -webkit-animation: 1s blink step-end infinite;*/\n            }\n            @keyframes "blink" {\n              from, to { background: transparent; }\n              50% {background: black; }\n            }\n            @-webkit-keyframes "blink" {\n              from, to { background: transparent; }\n              50% {background: black; }\n            }\n            * {\n                color:transparent\n            }\n            ';
        }
    }, {
        key: '_showCaret',
        value: function _showCaret(show) {
            this._caret.style.display = show ? 'block' : 'none';
        }
    }, {
        key: '_initEvents',
        value: function _initEvents() {
            var _this2 = this;

            var doc = this._editor.contentDocument;
            var body = doc.body;

            body.children[0].onscroll = function () {
                _this2._background.contentDocument.body.scrollTop = body.children[0].scrollTop;
                _this2._background.contentDocument.body.scrollLeft = body.children[0].scrollLeft;

                _this2._updateCaret();
            };
            body.children[0].onblur = function () {
                _this2._showCaret(false);
            };
            body.children[0].onfocus = function () {
                _this2._showCaret(true);
            };

            doc.onkeyup = function () {
                var t = void 0,
                    i = void 0,
                    o = void 0,
                    n = void 0,
                    s = void 0,
                    b = void 0;
                var tip = '';

                _this2._updateCaret();

                t = _this2._getParamDefinition(_this2._activeCaretRange.startOffset - 1);

                if (t) {
                    if (t.type == 'function') {
                        for (i in _this2._functions) {
                            tip += '<p>' + i + '</p>';
                        }
                    } else if (t.type == 'field-start' || t.type == 'field') {
                        for (i in _this2._fields) {
                            tip += '<p>' + i + '</p>';
                        }
                    } else if (t.context) {
                        o = _this2._functions[t.context];
                        if (o) {
                            tip = t.context + '(';
                            s = '';

                            if (o.arguments) {
                                for (i = 0; i < o.arguments.length; i++) {
                                    n = o.arguments[i].name;
                                    b = i == t.argumentIndex;
                                    if (!b && n == '...') {
                                        b = true;
                                    }
                                    tip += s + (b ? '<b style="background:#f3dd9b">' + n + '</b>' : n);
                                    s = '; ';
                                }
                                tip += ')';
                            }
                        }
                    }
                }

                if (_this2._onTip) {
                    _this2._onTip(tip);
                }
            };
            doc.onkeydown = function (event) {
                if (event.keyCode == 9) {
                    event.preventDefault();
                    return doc.execCommand('insertText', false, '    ');
                }

                _this2._updateCaret();
            };
            doc.onmousedown = function () {
                setTimeout(function () {
                    _this2._updateCaret();
                }, 100);
            };
            doc.onpaste = function (event) {
                var text = event.clipboardData.getData("text/plain");

                event.preventDefault();
                doc.execCommand('insertText', false, text);
            };
            doc.oninput = function () {
                _this2._updateCaret();
                _this2._renderBackground();
            };
        }
    }, {
        key: '_updateCaret',
        value: function _updateCaret() {
            var doc = this._editor.contentDocument.body.ownerDocument || this._editor.contentDocument.body.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel = void 0,
                range = void 0;
            var rect = void 0;

            if (typeof win.getSelection != "undefined") {
                sel = win.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                }
            } else if ((sel = doc.selection) && sel.type != "Control") {
                range = doc.selection.createRange();
            }

            this._activeCaretRange = range;
            rect = range.getBoundingClientRect();

            if (doc.body.innerText == '') {
                rect = { x: 6, y: 6 };
            } else if (rect.x == 0 && rect.y == 0) {
                rect = range.startContainer.getBoundingClientRect();
            }

            if (rect.x == 0 && rect.y == 0) {
                rect = { x: 6, y: 6 };
            }

            this._caret.style.top = rect.y - 2 + 'px';
            this._caret.style.left = rect.x + 'px';
        }
    }, {
        key: '_getParamDefinition',
        value: function _getParamDefinition(position) {
            /** @type {*} */
            var token = void 0;
            var positions = this._tokenizer.getPositions();

            while (position >= 0) {
                token = positions[position];

                if (token) {
                    return token;
                }

                position--;
            }
        }
    }, {
        key: '_renderBackground',
        value: function _renderBackground() {
            var _this3 = this;

            var content = this._editor.contentDocument.body.firstChild.innerText;
            var tokens = this._tokenizer.execute(content);
            var html = '';

            tokens.forEach(function (token) {
                if (token.type == 'function') {
                    token.validate = _this3._functions[token.value];
                } else if (token.type == 'field') {
                    token.validate = _this3._fields[token.value];
                }

                html += _this3._formatToken(token);
            });

            this._background.contentDocument.body.innerHTML = '<pre>' + html + '</pre>';
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
            var value = '';
            var position = this._tokenIndex - 1;

            this.createToken(position, {
                value: '{',
                context: context,
                argumentIndex: argumentIndex,
                type: 'field-start'
            });

            while (ch = this.nextChar()) {
                if (ch == '}') {
                    break;
                }

                value += ch;
            }

            if (value) {
                this.createToken(position + 1, {
                    value: value,
                    context: context,
                    argumentIndex: argumentIndex,
                    type: 'field'
                });
            }

            if (ch == '}') {
                position = this._tokenIndex - 1;
                this.createToken(position, {
                    value: '}',
                    context: context,
                    argumentIndex: argumentIndex,
                    type: 'field-end'
                });
            }
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
            name: '...',
            type: 'field',
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
    a: 1,
    bb: 1
});

/***/ })

/******/ });
//# sourceMappingURL=test.js.map