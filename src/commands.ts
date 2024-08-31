import * as vscode from 'vscode';
import * as api from './api';

export async function Search() {
    console.debug("Searching for package");
    const searchInput = await vscode.window.showInputBox({
        placeHolder: "Pkg-go-dev: Search", 
        prompt:"Search packages or symbols",
    });
    if (!searchInput) {
        return;
    }
    
    const searchResults = await api.searchPackages(searchInput);
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = searchResults.map(r => ({
        label: r.name, description: r.import, detail: r.synopsis 
    }));
    let selection = searchResults[0];
    quickPick.onDidChangeActive(e => {
        let filteredResults = searchResults.filter(r => r.import === e[0].description);
        if (filteredResults.length > 0) {
            selection = filteredResults[0];
        }
    })
    quickPick.onDidAccept(() => {
        vscode.commands.executeCommand("pkg-go-dev.show", selection.link);
        quickPick.hide();
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
}

export async function ShowDetails(pkgLink : URL) {
    console.debug(`Showing details of page ${pkgLink}`);
    try {
        const details = await api.getPackageDetail(pkgLink.href);

        const webview = vscode.window.createWebviewPanel("pkg-go-dev.detailView", `Detail of ${details.name}`, vscode.ViewColumn.Active, {
            enableScripts: true,
            enableFindWidget: true,
        });

        // TODO Create a dedicated viewobject for this panel with only relevant information
        webview.webview.html = `
            <h1>${details.name}</h1>
        `;
        webview.reveal();
    } catch (e: any) {
        vscode.window.showErrorMessage(`Error while retrieving detail of api ${e.message}`)
    }
}