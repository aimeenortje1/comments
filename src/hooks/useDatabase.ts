import {useState} from "react";
import indexedDBService from "../services/indexedDBService.ts";


// TODO: fix service type
export const useDatabase = (): [boolean, indexedDBService] => {
    const [isReady, setIsReady] = useState(false);
    const databaseService = indexedDBService.getInstance();

    databaseService.getDB()
        .then(() => {
            setIsReady(true);
        })
        .catch(err => {
            setIsReady(false);
            console.error('Database couldn\'t be retrieved', err);
        })

    return [
        isReady, databaseService
    ]
}
