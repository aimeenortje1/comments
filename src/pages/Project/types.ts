import type {Comment} from '../../components/Comments/types'

export interface ProjectType {
    id: number,
    name: string,
    description: string,
    comments: Comment[]
}