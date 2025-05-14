import React from 'react';
import {Comment} from './Comment';
import type {Comment as CommentType} from './types';

interface CommentListProps {
    comments: CommentType[];
    onCommentAdded: (comment: Omit<CommentType, 'id' | 'timestamp' | 'pendingSync'>) => Promise<CommentType>;
    onCommentDeleted: (id: number) => Promise<boolean>;
}

export const CommentList: React.FC<CommentListProps> = ({comments, onCommentAdded, onCommentDeleted}) => {
    const rootComments = comments.filter(comment => !comment.parentId);

    return (
        <div className="comment-list">
            {rootComments.length === 0 ? (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
            ) : (
                rootComments.map(comment => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        comments={comments}
                        onCommentAdded={onCommentAdded}
                        onCommentDeleted={onCommentDeleted}
                    />
                ))
            )}
        </div>
    );
};