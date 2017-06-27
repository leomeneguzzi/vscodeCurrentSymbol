import * as vscode from 'vscode';

export class CurrentSymbol {

    private _statusBarItem: vscode.StatusBarItem;
    private _symbols;

    constructor() {
        this.updateSymbols;
    }

    public setSymbols(symbols){
        if (!symbols[0] || !symbols[0][0]) return 'No symbols found';
        else symbols = symbols[0];
        this._symbols = symbols;
    }

    public updateSymbols(){
        var self = this;
        let symbols = new Promise ((resolve, reject) => {
             if (vscode && vscode.window && vscode.window.activeTextEditor &&
                    vscode.window.activeTextEditor.document &&
                    vscode.window.activeTextEditor.document.uri) {
                        var active = vscode.window.activeTextEditor.document.uri;
                        vscode.commands
                            .executeCommand('vscode.executeDocumentSymbolProvider', active)
                            .then(function() {
                                resolve(arguments);
                            });
            } else {
                reject('No symbols found');
            }    
        });
        symbols.then(function (resolve) {
             self.setSymbols(resolve);
        }, function onRejected() {
             console.log('No symbols found');
        });
    }

    public updateCurrentSymbol() {

        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }

        // Get the current text editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document;

        if(this._symbols){
            var position = editor.selection.active;
            this._symbols.forEach(symbol => {
                if(symbol.kind != 'Class'){
                    if(symbol.location.range.start.line<=position.line &&
                    symbol.location.range.end.line>=position.line){
                        this._statusBarItem.text = symbol.name;
                        return false;
                    }
                }
            });
        }
        this._statusBarItem.show();
    }
    
    dispose() {
        this._statusBarItem.dispose();
    }
}