import * as vscode from 'vscode';

export class CurrentSymbol {

    private _statusBarItem: vscode.StatusBarItem;
    private _symbols;

    constructor() {
        this.updateSymbols();
    }

    public setSymbols(symbols){
        this._symbols = symbols;
    }

    public updateSymbols(){
        var maxRetries = 10;
        var self = this;

        if (vscode && vscode.window && vscode.window.activeTextEditor &&
                    vscode.window.activeTextEditor.document &&
                    vscode.window.activeTextEditor.document.uri) {
                        var active = vscode.window.activeTextEditor.document.uri;
                        this._tryAtMost('',maxRetries,
                            vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', active)
                        );
        } else {
            console.log('No symbols found');
        }
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

    private _tryAtMost(otherArgs, maxRetries, promise) {
        var self = this;
        promise.then(function (resolve) {
            if (typeof resolve !== 'undefined' && resolve.length > 0){
                self.setSymbols(resolve);
            }else{
                if (maxRetries > 0) {
                    setTimeout(function() {
                        self._tryAtMost(otherArgs, maxRetries - 1, promise);
                    }, 500);
                }
            }
        }, function onRejected() {
            if (maxRetries > 0) {
                setTimeout(function() {
                    self._tryAtMost(otherArgs, maxRetries - 1, promise);
                }, 500);
            }
        });
    }
}