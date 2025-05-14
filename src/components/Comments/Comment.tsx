import React, {useState} from 'react';
import {CommentForm} from './CommentForm';
import type {Comment as CommentType} from './types';

interface CommentProps {
    comment: CommentType;
    comments: CommentType[];
    onCommentAdded: (comment: Omit<CommentType, 'id' | 'timestamp' | 'pendingSync'>) => Promise<CommentType>;
    onCommentDeleted: (id: number) => Promise<boolean>,
    level?: number;
}

export const Comment: React.FC<CommentProps> = ({comment, comments, onCommentAdded, onCommentDeleted, level = 0}) => {
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const replies = comments.filter(c => c.parentId === comment.id);

    const handleReply = async (comment: Omit<CommentType, 'id' | 'timestamp' | 'pendingSync'>) => {
        await onCommentAdded(comment);
        setShowReplyForm(false);
    };

    const handleDelete = async (id: number) => {
        await onCommentDeleted(id);
    }

    const formattedDate = new Date(comment.createdAt).toLocaleString();

    return (
        <div className="block" style={{marginLeft: `${level * 20}px`}}>
            <div className="p-3 mb-2 border rounded">
                <div className="flex justify-content-between mb-2">
                    <strong>{comment.author}</strong>
                    <small className="m-1 text-muted">{formattedDate}</small>
                </div>
                <p className="mb-2">{comment.content}</p>
                <div>
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </button>
                    <button className="ml-2 bg-amber-800" onClick={handleDelete}>
                        Delete
                    </button>
                </div>


                {showReplyForm && (
                    <div className="mt-3">
                        <CommentForm
                            parentId={comment.id}
                            projectId={comment.projectId}
                            onCommentAdded={handleReply}
                        />
                    </div>
                )}
            </div>

            {replies.length > 0 && (
                <div className="mt-2">
                    {replies.map(reply => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            comments={comments}
                            onCommentAdded={onCommentAdded}
                            onCommentDeleted={onCommentDeleted}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};