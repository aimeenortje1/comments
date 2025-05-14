import { useState } from "react";
import type { Comment as CommentType } from "../components/Comments/types.ts";
import { useDatabase } from "./useDatabase.ts";

export const useComments = (initialComments: CommentType[]) => {
    const [comments, setComments] = useState<CommentType[]>(initialComments);
    const [isDbReady, dbService] = useDatabase();

    const handleAddComment = async (newComment: CommentType) => {
        try {
            const savedComment = await dbService.add(newComment);
            setComments([...comments, savedComment]);
            return savedComment;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const handleDeleteComment = async (id: number ) => {
        try {
            await dbService.delete(id);
            return;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    return {
        comments,
        isDbReady,
        handleAddComment,
        handleDeleteComment
    };
};