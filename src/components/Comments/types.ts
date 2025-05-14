export interface Comment {
    id?: number,
    content: string,
    author: string,
    parentId: number | null,
    projectId: number,
    timestamp?: number,
    pendingSync?: boolean,
    createdAt: string
}