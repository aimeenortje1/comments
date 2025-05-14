import { describe, it, expect, vi, beforeEach } from 'vitest';
import {render, fireEvent, getAllByText} from '@testing-library/react';
import { Comment } from './Comment';
import type { Comment as CommentType } from './types';

describe('Comment', () => {
    const mockOnCommentAdded = vi.fn().mockResolvedValue({
        id: 999,
        content: 'New reply',
        author: 'Anonymous',
        parentId: 1,
        projectId: 1,
        createdAt: '2023-01-04T00:00:00.000Z',
        pendingSync: false
    });

    const mockOnCommentDeleted = vi.fn().mockResolvedValue(true);

    const mockComment: CommentType = {
        id: 1,
        content: 'Test comment',
        author: 'Anonymous',
        parentId: null,
        projectId: 1,
        createdAt: '2023-01-01T00:00:00.000Z',
        pendingSync: false
    };

    const mockReplies: CommentType[] = [
        {
            id: 2,
            content: 'Test reply',
            author: 'Anonymous',
            parentId: 1,
            projectId: 1,
            createdAt: '2023-01-02T00:00:00.000Z',
            pendingSync: false
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the comment correctly', () => {
        const { getByText } = render(
            <Comment
                comment={mockComment}
                comments={[mockComment]}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        expect(getByText('Test comment')).toBeTruthy();
        expect(getByText('Anonymous')).toBeTruthy();

        const date = new Date(mockComment.createdAt).toLocaleString();
        expect(getByText(date)).toBeTruthy();
    });

    it('shows reply form when Reply button is clicked', () => {
        const { getByText, queryByPlaceholderText } = render(
            <Comment
                comment={mockComment}
                comments={[mockComment]}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        const replyButton = getByText('Reply');
        fireEvent.click(replyButton);

        expect(queryByPlaceholderText('Write a comment...')).toBeTruthy();

        expect(getByText('Cancel')).toBeTruthy();
    });

    it('hides reply form when Cancel button is clicked', () => {
        const { getByText, queryByPlaceholderText } = render(
            <Comment
                comment={mockComment}
                comments={[mockComment]}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        // Show form first
        const replyButton = getByText('Reply');
        fireEvent.click(replyButton);

        // Form should be visible
        expect(queryByPlaceholderText('Write a comment...')).toBeTruthy();

        // Click Cancel (same button, different text)
        const cancelButton = getByText('Cancel');
        fireEvent.click(cancelButton);

        // Form should be hidden
        expect(queryByPlaceholderText('Write a comment...')).toBeFalsy();
    });

    it('calls onCommentDeleted when Delete button is clicked', () => {
        const { getByText } = render(
            <Comment
                comment={mockComment}
                comments={[mockComment]}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        const deleteButton = getByText('Delete');
        fireEvent.click(deleteButton);

        expect(mockOnCommentDeleted).toHaveBeenCalledWith(mockComment.id);
    });

    it('renders nested replies correctly', () => {
        const allComments = [mockComment, ...mockReplies];

        const { getByText } = render(
            <Comment
                comment={mockComment}
                comments={allComments}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        // Both the main comment and reply should be visible
        expect(getByText('Test comment')).toBeTruthy();
        expect(getByText('Test reply')).toBeTruthy();
    });

    it('increases margin for nested comments', () => {
        const allComments = [mockComment, ...mockReplies];

        const { container } = render(
            <Comment
                comment={mockComment}
                comments={allComments}
                onCommentAdded={mockOnCommentAdded}
                onCommentDeleted={mockOnCommentDeleted}
            />
        );

        // The replies will be wrapped in a div with increased margin
        const nestedCommentDivs = container.querySelectorAll('div.block');
        expect(nestedCommentDivs.length).toBeGreaterThan(1);

        // Check if the second div has a style attribute containing margin-left
        const nestedCommentStyle = nestedCommentDivs[1].getAttribute('style');
        expect(nestedCommentStyle).toContain('margin-left: 20px');
    });
});