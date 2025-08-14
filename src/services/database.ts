import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import DatabaseConstructor from "better-sqlite3";

class DatabaseService {
    private db: DatabaseConstructor.Database;
    private tableName = "usage_stats";
    private dbPath: string;

    constructor(private context: vscode.ExtensionContext) {
        
        this.dbPath = path.join(this.context.globalStorageUri.fsPath, 'usage.db');
        
        const storageDir = path.dirname(this.dbPath);
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
        
        this.db = new DatabaseConstructor(this.dbPath);
        this.init();
    }
    private init() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                total_seconds INTEGER DEFAULT 0
            );
            INSERT OR IGNORE INTO ${this.tableName} (id, total_seconds) VALUES (1, 0);
        `);
    }

    addTime(seconds: number) {
        const stmt = this.db.prepare(
            `UPDATE ${this.tableName} SET total_seconds = total_seconds + ? WHERE id = 1`
        );
        stmt.run(seconds);
    }

    getTotalSeconds(): number {
        
        const stmt = this.db.prepare(
            `SELECT total_seconds FROM ${this.tableName} WHERE id = 1`
        );
        const t = stmt.get() as { total_seconds: number };

        return t.total_seconds;
    }

    close() {
        this.db.close();
    }
}

export default DatabaseService;