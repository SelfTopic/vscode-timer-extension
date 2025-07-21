import * as vscode from 'vscode';
import { User } from './types/user';
import UserService from './services/user';
import * as dotenv from "dotenv";

process.env.API_URL = "http://localhost:3040/vscode-timer";

dotenv.config();
async function sendTime(
    userId: number, 
    name: string, 
    totalSeconds: number,
    bool: boolean
) {

    if (!bool) {
        return undefined;
    }

    const response = await fetch(process.env.API_URL!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: userId,
            name: name,
            totalSeconds: totalSeconds
        })
    });

    if (response.status !== 200) {
        return undefined;
    }  


}


export function activate(context: vscode.ExtensionContext) {
	console.log("Extensions initialize");

    let totalSeconds = 0; 
    let isActive = vscode.window.state.focused; 
    let interval: NodeJS.Timeout | undefined;
    const userService = new UserService();

    function formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (isActive && !interval) {
            interval = setInterval(() => {
                totalSeconds++;
                vscode.window.setStatusBarMessage(`Время в VS Code: ${formatTime(totalSeconds)}`, 5000);
            }, 1000); 
        }
    }

    function stopTimer() {
        if (interval) {
            clearInterval(interval);
            interval = undefined;

        }
    }

    const telemetryEnabled = vscode.workspace
        .getConfiguration('vscode-timer')
        .get('enableTelemetry', false);

    if (!telemetryEnabled) {
        vscode.window.showInformationMessage(
            'Разрешить отправку данных о времени использования VS Code?',
            'Да',
            'Нет'
        ).then(selection => {
            console.log(`Выбранный ответ: ${selection}`);
            if (selection === 'Да') {
                console.log(`Обновление данных телеметрии`);
                vscode.workspace
                    .getConfiguration('vscode-timer')
                    .update('enableTelemetry', true, vscode.ConfigurationTarget.Global)
                    .then((v) => {
                        console.log("Успешное изменение данных.");
                    });

                    const conf = vscode.workspace.getConfiguration('vscode-time');
                    const inspection = conf.inspect('enableTelemetry');
                    console.log("Global value:", inspection?.globalValue);
                    console.log("Workspace value:", inspection?.workspaceValue);
                    console.log("WorkspaceFolder value:", inspection?.workspaceFolderValue);
            }
        });
    }

    if (!telemetryEnabled) {
        return;
    };
    
    let userId = userService.getId();
    let name = userService.getName();

    console.log(`name: ${name}`);

    async function register(name: string): Promise<User | undefined> {

        console.log(`Вызвана функция register`);
        const response = await fetch(process.env.API_URL! + "-register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name
            })
        });


        if (response.status !== 200) {
            console.log(`Функция register вернет: undefiend потому что status code equal ${response.status}`);
            return undefined;
        }

        const data = await response.json();
        console.log(`Функция register вернет: ok: ${data.ok}, user: ${data.user}`);
        return data.user;
    }

    async function getUserData() {
        console.log(`Вызвана функция getUserData`);
        if (!userId || userId === -1) {
            if (!name || name === "") {
                name = await vscode.window.showInputBox({
                    prompt: "Введите ваше имя",
                    placeHolder: "тут пиши свое имя крч",
                    validateInput: (value: string) => {
                        return value.trim().length > 0 ? null : "Имя не может быть пустым";
                    }
                });

                if (!name) {
                    console.log(`Функция getUserData вернет false потому что не найдено имя после ввода`);
                    return false;
                }

                userService.setName(name);

                const data = await register(name);

                if (!data) {
                    console.log(`Функция getUserData вернет false потому что функция register вернула undefiend`);
                    return false;
                }

                userId = data.id;
                name = data.name;

                console.log(`name: ${name}, id: ${userId}`);

                userService.setId(userId);
                console.log(`Функция getUserData вернет true ведь и имя и айди успешно назначены`);
                return true;
            }

            const data = await register(name);

            if (!data) {
                return false;
            }

            userId = data.id;
            name = data.name;

            return true;
        }

        return true;

    }


    getUserData();


    const windowStateListener = vscode.window.onDidChangeWindowState((state) => {
        isActive = state.focused;
        if (isActive) {
            startTimer();
        } else {
            stopTimer();
            sendTime(
                userId!,
                name!,
                totalSeconds,
                true
            );
        }
    });

    if (isActive) {
        startTimer();
    }

    let disposable = vscode.commands.registerCommand('testytest.helloworld', () => {
        vscode.window.showInformationMessage(`Время в VS Code: ${formatTime(totalSeconds)}. Your id: ${userId}. Your name: ${name}`);
    });

    context.subscriptions.push(disposable, windowStateListener);

    context.subscriptions.push({
        dispose: () => {
            stopTimer();
        }
    });

}


export function deactivate() {

}