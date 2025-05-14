import './App.css'
import {Project} from "./pages/Project/Project.tsx";
import {useEffect, useState} from "react";
import {useDatabase} from "./hooks/useDatabase.ts";
import type {ProjectType} from "./pages/Project/types.ts";

const projectsSeed = [
    {
        id: 1,
        name: "Invalidenstr 37 Heat Pump Installation",
        description: "Corporate office heat pump installation",
        comments: []
    },
    {
        id: 2,
        name: "Kleistpark Office Block Heat Pump Installation",
        description: "Corporate office heat pump installation",
        comments: []
    }]

export const App = () => {

    const [isDbReady, dbService] = useDatabase();
    const [projects, setProjects] = useState<ProjectType[]>(projectsSeed);
    const [openProjectId, setOpenProjectId] = useState<number | null>(null);
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const handleOnline = () => {
            console.log('App is online');
            // TODO: sync data when online again
            setIsOnline(true);
        };

        const handleOffline = () => {
            console.log('App is offline');
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (isDbReady && dbService) {
            loadComments();
        }
    }, [isDbReady, dbService]);

    const loadComments = async () => {
        if (!dbService) return;

        setIsLoading(true);
        try {
            const updatedProjects = [...projects];

            for (let i = 0; i < updatedProjects.length; i++) {
                const project = updatedProjects[i];
                const projectComments = await dbService.getByProjectId(project.id);

                updatedProjects[i] = {
                    ...project,
                    comments: projectComments || []
                };
            }

            setProjects(updatedProjects);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="text-center mb-3">
              <span className={`${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {isLoading ? (
                <div>Loading comments...</div>
            ) : (
                projects.map((project) => (
                    <Project key={project.id} project={project}/>
                ))
            )}
        </>
    )
}

