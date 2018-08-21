# formula-editor
Editor de formulas no estilo excel

Demo
Example: https://rawgit.com/fabionogueira/formula-editor/master/test/index.html
sum(
    if({a}  > 1;  values("xx"; "yy"));
    if({bb} > 10; values("zz"; "ww"))
)

Test
npm install
npm test
open in browser: file:///path/to/formula-editor/test/index.html
