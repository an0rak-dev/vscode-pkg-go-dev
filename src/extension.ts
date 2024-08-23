import * as vscode from 'vscode';
import * as commands from './commands';

export class PkgDocDocument implements vscode.CustomDocument {
	public readonly uri : vscode.Uri;

	constructor(uri : vscode.Uri) {
		this.uri = uri;
	}
	
	public dispose(): void {
		// Do nothing, it's just a virtual document.
	}

}

export class PkgDocViewer implements vscode.CustomReadonlyEditorProvider<PkgDocDocument> {
	private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent>();
	
	openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): vscode.CustomDocument | Thenable<vscode.CustomDocument> {
		return new PkgDocDocument(uri);
	}
	resolveCustomEditor(document: vscode.CustomDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Thenable<void> | void {
		webviewPanel.webview.html = `
			<html>
				<head>
					<meta charset="utf-8">
				</head>
				<body>
					<h1>Hello World</h1>
				</body>
			</html>
		`;
	}
}

export function activate(context: vscode.ExtensionContext) { 
	console.log("Activating extension pkg-go-dev");

	const searchCommand = vscode.commands.registerCommand('pkg-go-dev.search', commands.Search);
	const showCommand = vscode.commands.registerCommand('pkg-go-dev.show', (packageDocUrl) => {
		vscode.commands.executeCommand("vscode.openWith", vscode.Uri.parse(packageDocUrl), "pkg-go-dev.pkgview");
	});
	const pkgDetailView = vscode.window.registerCustomEditorProvider("pkg-go-dev.pkgview", new PkgDocViewer(), { supportsMultipleEditorsPerDocument: false});
	
	context.subscriptions.push(searchCommand);
	context.subscriptions.push(showCommand);
	context.subscriptions.push(pkgDetailView);
}

export function deactivate() {}
