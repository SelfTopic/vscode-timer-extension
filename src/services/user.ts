import * as vscode from "vscode";

class UserService {

    private section = "vscode-timer";

    getName() {
        console.log(`Запрос на получение имени`);
        const name = vscode.workspace
            .getConfiguration(this.section)
            .get<string | undefined>("name");

        return name;
    }

    setName(newName: string) {
        console.log(`Запрос на изменение имени. Новое имя: ${newName}`);
        vscode.workspace   
            .getConfiguration(this.section)
            .update("name", newName, vscode.ConfigurationTarget.Global);
        
            console.log(`Имя изменено на ${newName}`);
    }

    getId() {
        const id = vscode.workspace
            .getConfiguration(this.section)
            .get<string | undefined>("id");

        if (typeof id === "number") {
            return parseInt(id);
        }

        return undefined;
    }

    setId(newId: number) {
        vscode.workspace   
            .getConfiguration(this.section)
            .update("id", newId, vscode.ConfigurationTarget.Global);
    }

}

export default UserService;