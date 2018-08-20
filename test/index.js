// @ts-check

import Editor from '../src/editor'

let editor = new Editor(document.getElementById('editor'), {
    onTip(tip){
        document.getElementById('tip').innerHTML = tip
    }
})

editor.setFunctions({
    'sum': {
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
    'value': {
        arguments: [
            {
                name: 'field', 
                type: 'field',
                description: 'campo a definir o valor'
            }
        ]
    },
    'values': {
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
                name: '...', 
                type: 'field',
                description: 'campo a definir o valor'
            }
        ]
    },
    'if': {
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
    'valuex': true
})

editor.setFields({
    a:1,
    bb:1
})
