import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CommentForm } from './CommentForm';
import type { Comment } from './types';

describe('CommentForm', () => {
    const mockOnCommentAdded = vi.fn().mockResolvedValue({});

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form correctly', () => {
        const { getByPlaceholderText, getByRole } = render(
            <CommentForm
                projectId={1}
                onCommentAdded={mockOnCommentAdded}
            />
        );

        expect(getByPlaceholderText('Write a comment...')).toBeTruthy();
        expect(getByRole('button')).toBeTruthy();
        expect(getByRole('button').textContent).toContain('Post Comment');
    });

    it('shows Reply button when parentId is provided', () => {
        const { getByRole } = render(
            <CommentForm
                projectId={1}
                parentId={123}
                onCommentAdded={mockOnCommentAdded}
            />
        );

        const button = getByRole('button');
        expect(button.textContent).toContain('Reply');
    });

});