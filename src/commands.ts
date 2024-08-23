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