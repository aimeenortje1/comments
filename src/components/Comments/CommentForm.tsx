import {type FormEvent, useState} from "react";
import type {Comment} from './types.ts';

export interface CommentFormProps {
    parentId?: number,
    projectId: number,
    onCommentAdded: (comment: Omit<Comment, 'id' | 'timestamp' | 'pendingSync'>) => Promise<void>
}

export const CommentForm: React.FC<CommentFormProps> = ({parentId = null, projectId, onCommentAdded}) => {
    const [content, setContent] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);

        const newComment: Omit<Comment, 'id' | 'timestamp' | 'pendingSync'> = {
            content,
            author: 'Anonymous', //TODO: ability to comment as the logged in user
            parentId,
            projectId,
            createdAt: new Date().toISOString()
        };

        onCommentAdded(newComment)
            .then(() => {
                setContent('');
                setIsSubmitting(false);
            })
            .catch(error => {
                console.error('Error adding comment:', error);
                setIsSubmitting(false);
            });
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded-lg border-gray-300 mb-4 p-2">
            <div className="mb-3">
        <textarea
            className="px-5 mt-2 focus-visible:outline-0 "
            rows={3}
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
        ></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
            >
                {isSubmitting ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
            </button>
        </form>
    );
};