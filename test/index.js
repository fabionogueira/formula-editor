// @ts-check

import Editor from '../src/editor'

let editor = new Editor(document.getElementById('editor'), {
    onTip(token){
        generateTip(token)
    }
})

function generateTip(token){
    let i, o, n, s, b, e
    let tip = ''

    if (token){
        document.getElementById('console').innerHTML = 
        '\ncursor     = ' + token.cursor +
        '\ncol        = ' + token.col + 
        '\ncontext    = ' + token.context + 
        '\ncontextPos = ' + token.contextPos +
        '\nvalue      = ' + token.value
    } else {
        document.getElementById('console').innerHTML = ''
    }

    if (token){
        if (token.type=='FUNCTION' && !token.validate){
            for (i in functions){
                if (i.startsWith(token.value)){
                    tip += `<p style="${i==token.value ? 'background:#00BCD4' : ''}">${i}</p>`
                }
            }
        } else if (token.type=='IDENTIFIER' && !token.validate){
            for (i in fields){
                n = i.substring(0, i.length - 1)
                if (i.startsWith(token.value)){
                    tip += `<p style="${n==token.value ? 'background:#00BCD4' : ''}">${i}</p>`
                }
            }
        } else if (token.context){
            o = functions[token.context]
            if (o){
                tip = token.context + '('
                s = ''
                
                if (o.arguments){
                    e = false
                    for (i=0; i<o.arguments.length; i++){
                        n = o.arguments[i].name
                        b = (i == token.contextPos)
                        
                        if (b){
                            e = true
                        }
                        
                        tip += s + ( b || (i==o.arguments.length-1 && !e && o.arguments[i].several) ? `<b style="background:#f3dd9b">${n}</b>` : n)
                        s = '; '
                    }

                    tip += ')'
                }
            }
        }
    }

    document.getElementById('tip').innerHTML = tip
}

let functions = {
    'SUM': {
        arguments: [
            {
                name: 'start', 
                type: 'text',
                description: 'a primeira {context} do intervalo de soma'
            },
            {
                name: 'end', 
                type: 'text',
                description: 'a última {context} do intervalo de soma'
            }
        ]
    },
    'VALUE': {
        arguments: [
            {
                name: 'field', 
                type: 'field',
                description: 'campo a definir o valor'
            }
        ]
    },
    'VALUES': {
        arguments: [
            {
                name: 'field1', 
                type: 'field',
                description: 'campo a definir o valor'
            },
            {
                name: 'field2', 
                type: 'field',
                description: 'campo a definir o valor'
            },
            {
                name: '[optional ...]', 
                type: 'field',
                several: true,
                description: 'campo a definir o valor'
            }
        ]
    },
    'IF': {
        arguments: [
            {
                name: 'condition', 
                type: 'boolean',
                description: 'expressão a ser avaliada'
            },
            {
                name: 'valueIfTrue', 
                type: 'field',
                description: 'campo a definir o valor'
            },
            {
                name: 'valueIfFalse', 
                type: 'field',
                description: 'campo a definir o valor'
            }
        ]
    },
    'VALUEX': true
}
let fields = {
    '{a}':1,
    '{bb}':1
}

editor.setFunctions(functions)
editor.setFields(fields)
