// Create a new hook: useComments.ts
import { useState } from "react";
import type { Comment as CommentType } from "../components/Comments/types.ts";
import { useDatabase } from "./useDatabase.ts";

export const useComments = (initialComments: CommentType[]) => {
    const [comments, setComments] = useState<CommentType[]>(initialComments);
    const [isDbReady, dbService] = useDatabase();

    const handleAddComment = async (newComment) => {
        try {
            const savedComment = await dbService.create(newComment);
            setComments([...comments, savedComment]);

            // TODO: add online sync
            // if (isOnline) {
            //   syncComment(savedComment);
            // }

            return savedComment;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    return {
        comments,
        isDbReady,
        handleAddComment
    };
};