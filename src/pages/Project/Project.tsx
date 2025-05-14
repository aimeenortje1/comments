import type {ProjectType} from './types.ts'
import type {Comment as CommentType} from "../../components/Comments/types.ts";
import {useEffect, useState} from "react";
import {CommentForm} from "../../components/Comments/CommentForm.tsx";
import {useDatabase} from "../../hooks/useDatabase.ts";
import {CommentList} from "../../components/Comments/CommentList.tsx";


export const Project = ({project}: { project: ProjectType }) => {

    const [comments, setComments] = useState<CommentType[]>(project.comments);
    const [isDbReady, dbService] = useDatabase();

    useEffect(() => {
        console.log({isDbReady});
    }, [isDbReady, dbService]);

    //TODO: move to hook
    const handleAddComment = async (newComment) => {
        try {
            const savedComment = await dbService.create(newComment);
            setComments([...comments, savedComment]);

            // TODO: add online sync
            // if (isOnline) {
            //     syncComment(savedComment);
            // }

            return savedComment;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    return (
        <>
            <div className="text-xl font-bold">{project.name}</div>

            <div className="row justify-content-start">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <CommentForm projectId={project.id} onCommentAdded={handleAddComment}/>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Comments</h4>
                        </div>
                        <div className="card-body">
                            {!isDbReady ? (
                                <p className="text-center">Loading comments...</p>
                            ) : (
                                <CommentList
                                    comments={comments}
                                    onCommentAdded={handleAddComment}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}



