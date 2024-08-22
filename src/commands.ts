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
    let selection = quickPick.items[0];
    quickPick.onDidChangeActive(e => selection = e[0]);
    quickPick.onDidAccept(() => {
        console.debug(`Selected ${selection.label}`);
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
}