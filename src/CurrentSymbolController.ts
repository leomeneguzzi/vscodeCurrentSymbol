import {CurrentSymbol} from "./CurrentSymbol";
import * as vscode from 'vscode';

export class CurrentSymbolController {

    private _currentSymbol: CurrentSymbol;
    private _disposable: vscode.Disposable;

    constructor(currentSymbol: CurrentSymbol) {
        this._currentSymbol = currentSymbol;

        // subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEventChangeTextEditor, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEventChangeActiveEditor, this, subscriptions);
        
        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEventChangeTextEditor() {
        this._currentSymbol.updateCurrentSymbol();
    }

    private _onEventChangeActiveEditor() {
        this._currentSymbol.updateSymbols();
    }
}