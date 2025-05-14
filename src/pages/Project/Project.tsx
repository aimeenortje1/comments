import type {ProjectType} from './types.ts'
import {useEffect} from "react";
import {CommentForm} from "../../components/Comments/CommentForm.tsx";
import {CommentList} from "../../components/Comments/CommentList.tsx";
import {useComments} from "../../hooks/useComment.ts";


export const Project = ({project}: { project: ProjectType }) => {
    const {comments, isDbReady, handleAddComment, handleDeleteComment} = useComments(project.comments);

    useEffect(() => {
        console.log({isDbReady});
    }, [isDbReady]);

    return (
        <>
            <div className="text-xl font-bold">{project.name}</div>

            <div className="row justify-content-start">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <CommentForm projectId={project.id}
                                         onCommentAdded={handleAddComment}/>
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
                                    onCommentDeleted={handleDeleteComment}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}



