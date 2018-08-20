let activeCaretRange = 0

let functions = {
    'sum': {
        arguments: [
            {
                group: 'g1',
                name: 'start', 
                type: 'text',
                description: 'a primeira {context} do intervalo de soma'
            },
            {
                group: 'g1',
                name: 'end', 
                type: 'text',
                description: 'a última {context} do intervalo de soma'
            },
            {
                group: 'g2',
                name: 'array', 
                type: 'array',
                description: 'lista de valores a serem somados'
            },
            {
                group: 'g3',
                name: 'none', 
                type: 'null',
                description: 'sem argumento, assume a primeira e a última {context} como intervalo de soma'
            }
        ]
    },
    'value': true,
    'values': true,
    'if': true,
    'valuex': true
}

let fields = {
    'government2013': true,
    'government2014': true,
    'gover_accum_2014': true,
    'accum_france': true,
    'francesale price': true
}

function setCaretCharacterOffsetWithin(element) {
    let doc = element.ownerDocument || element.document
    let win = doc.defaultView || doc.parentWindow
    let sel, range
    let rect

    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        range = doc.selection.createRange();
    }

    activeCaretRange = range
    rect = range.getBoundingClientRect()

    if (doc.body.innerText==''){
        rect = {x:6, y:6}
    } else if (rect.x==0 && rect.y==0){
        rect = range.startContainer.getBoundingClientRect()
    }

    if (rect.x==0 && rect.y==0){
        rect = {x:6, y:6}
    }

    caret.style.top = (rect.y-2) + 'px'
    caret.style.left = rect.x + 'px'
}

function getParamDefinition(position){
    let token

    while (position >= 0){
        token = tokensPos[position]
        
        if (token){
            return token
        }

        position--
    }
}

function format(iframeBg, content){
    // content = hljs.highlight('javascript', '\n' + content)
    // iframeBg.contentDocument.body.innerHTML = '<pre>' + content.value + '</pre>'

    content = highlight(content)
    iframeBg.contentDocument.body.innerHTML = '<pre>' + content + '</pre>'
}

function initIframe(frameElement, styles){
    let doc = frameElement.contentDocument;
    let style = doc.createElement('style')
    
    style.type = 'text/css';
    style.innerHTML = `* {font-family: monospace; }\n${styles ? styles : ''}`;
    
    frameElement.contentDocument.body.style.overflow = 'hidden'
    frameElement.contentDocument.head.appendChild(style)
}

function showCaret(flag){
    caret.style.display = flag ? 'block' : 'none'
}

var caret
let iframeEditor

window.onload = function(){
    let iframeBg = document.getElementById("bg")
    iframeEditor = document.getElementById("editor")

    initIframe(iframeBg, css + '\npre{padding:0;margin:0}\nbody{padding:6px;margin:0}')
    initIframe(iframeEditor, cssCaret + '\n*{color:transparent}')
    
    iframeEditor.contentDocument.body.innerHTML = 
        `<pre style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:1;margin:0;padding:6px;overflow:auto" spellcheck="false" contenteditable="true"></pre>
         <div class="caret" style="left:6px;top:4px"></div>`

    caret = iframeEditor.contentDocument.body.children[1]
    showCaret(false)
    
    // iframeEditor.contentDocument.body.contentEditable = true;
    iframeEditor.contentDocument.body.children[0].onscroll = function(){
        iframeBg.contentDocument.body.scrollTop = iframeEditor.contentDocument.body.children[0].scrollTop
        iframeBg.contentDocument.body.scrollLeft = iframeEditor.contentDocument.body.children[0].scrollLeft
        updateCaret()
    }

    iframeEditor.contentDocument.body.children[0].onblur = function(){
        showCaret(false)
    }
    iframeEditor.contentDocument.body.children[0].onfocus = function(){
        showCaret(true)
    }
    iframeEditor.contentDocument.onkeyup = function() {
        let t, i, o
        let tip = ''

        updateCaret()

        t = getParamDefinition(activeCaretRange.startOffset-1)
        console.log(t)
        if (t){
            if (t.type=='function'){
                for (i in functions){
                    tip += `<p>${i}</p>`
                }
            } else if (t.type=='field-start' || t.type=='field'){
                for (i in fields){
                    tip += `<p>${i}</p>`
                }
            } else if (t.func){ // if (t.type=='argument-start' || t.type=='argument-separator'){
                o = functions[t.func]
                if (o){
                    i = t.type=='argument-start' ? 0 : t.argumentIndex+1
                    tip = `${t.func}(${i}`
                }
                
            }
        }

        document.getElementById('dica').innerHTML = tip
    }
    iframeEditor.contentDocument.onkeydown =  function(event){
        if (event.keyCode==9){
            event.preventDefault()
            return iframeEditor.contentDocument.execCommand('insertText', false, '    ')
        }
        
        updateCaret()
    }
    iframeEditor.contentDocument.onmousedown = function(){
        setTimeout(updateCaret, 100)
    }
    iframeEditor.contentDocument.onpaste = function(event){
        let text = event.clipboardData.getData("text/plain")

        event.preventDefault()
        iframeEditor.contentDocument.execCommand('insertText', false, text)
    }

    iframeEditor.contentDocument.oninput = function(){
        let body = iframeEditor.contentDocument.body
        let content = body.firstChild.innerText

        updateCaret()
        
        format(iframeBg, content)
    }

    function updateCaret(){
        let body = iframeEditor.contentDocument.body
        setCaretCharacterOffsetWithin(body.firstChild)
    }
}

/*
 = SUM(VALUES({Government2013}, "Government2014"))
 = IF({Government2013} - {Government2014} > 0, 1, 0)
 = {Government2014} + VALUEX("Gover_Accum_2014", $INDEX - 1)

*/

