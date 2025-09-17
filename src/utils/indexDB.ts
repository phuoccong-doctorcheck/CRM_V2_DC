/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import { openDB } from 'idb';

export const ConnectDB = async<T>(nameDB: string, storeName: string) => {
  const db = await openDB<T>(nameDB, 1, {
    upgrade(db: any) {
      db.createObjectStore(storeName);
    },
  });
  return db;
};

const handleSaveDataToIndexDB = async<T>(nameDB: string, nameTable: string, version: number, key: string[]) => {
  // const db = await ConnectDB<T>(nameDB, nameTable, version);
  // db.add(nameTable,);
};
