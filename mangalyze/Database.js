import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('users.db');

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
      );`
    );
  });
};

export const loginUser = (email, senha, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM usuarios WHERE email = ? AND senha = ?;',
      [email, senha],
      (_, { rows }) => {
        if (rows.length > 0) {
          callback(true, rows._array[0]);
        } else {
          callback(false, null);
        }
      },
      (_, error) => {
        console.error(error);
        callback(false, null);
      }
    );
  });
};

export const insertDummyUser = () => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT OR IGNORE INTO usuarios (nome, email, senha) VALUES (?, ?, ?);',
      ['João', 'joao@email.com', '123456']
    );
  });
};
