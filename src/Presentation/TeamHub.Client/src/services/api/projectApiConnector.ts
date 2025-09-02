import type { ProjectDTO } from "../../models/projects/ProjectDTO";

const dummyProjects: ProjectDTO[] = [
  {
    id: "1",
    name: "Design System",
    description: "Create a unified design language for our app",
    color: "bg-blue-500",
    members: 8,
    tasks: 20,
    completed: 12,
  },
  {
    id: "2",
    name: "Marketing Website",
    description: "Redesign the company website for better conversion",
    color: "bg-green-500",
    members: 5,
    tasks: 15,
    completed: 9,
  },
  {
    id: "3",
    name: "Mobile App",
    description: "Develop the iOS and Android app",
    color: "bg-purple-500",
    members: 12,
    tasks: 40,
    completed: 28,
  },
  {
    id: "4",
    name: "Internal Tools",
    description: "Build tools for HR and finance teams",
    color: "bg-yellow-500",
    members: 6,
    tasks: 10,
    completed: 7,
  },
];

export function fetchProjects(): Promise<ProjectDTO[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyProjects);
    }, 500); 
  });
}
