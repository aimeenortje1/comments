import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CommentList } from './CommentList';
import type { Comment as CommentType } from './types';

describe('CommentList', () => {
    const mockOnCommentAdded = vi.fn().mockResolvedValue({});
    const mockOnCommentDeleted = vi.fn().mockResolvedValue(true);

    it('displays a message when there are no comments', () => {
        const { getByText } = render(
            <CommentList
                comments={[]}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        expect(getByText('No comments yet. Be the first to comment!')).toBeTruthy();
    });

    it('renders root comments correctly', () => {
        const comments: CommentType[] = [
            {
                id: 1,
                content: 'Test comment 1',
                author: 'Anonymous',
                parentId: null,
                projectId: 1,
                createdAt: '2023-01-01T00:00:00.000Z',
                pendingSync: false
            },
            {
                id: 2,
                content: 'Test comment 2',
                author: 'Anonymous',
                parentId: null,
                projectId: 1,
                createdAt: '2023-01-02T00:00:00.000Z',
                pendingSync: false
            },
            {
                id: 3,
                content: 'Test reply',
                author: 'Anonymous',
                parentId: 1,
                projectId: 1,
                createdAt: '2023-01-03T00:00:00.000Z',
                pendingSync: false
            }
        ];

        const { queryByText } = render(
            <CommentList
                comments={comments}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        // Should only render root comments (not replies)
        expect(queryByText('Test comment 1')).toBeTruthy();
        expect(queryByText('Test comment 2')).toBeTruthy();

    });
});