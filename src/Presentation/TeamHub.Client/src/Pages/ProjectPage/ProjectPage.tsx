// src/pages/ProjectPage.tsx (or wherever it's located)
import React, { useEffect, useState } from "react";
import { ProjectCard } from "../../components/common/Project/ProjectCard/ProjectCard";
import type { ProjectResponse } from "../../models/projects/ProjectResponse";
import { getAllProjects, createProject, updateProject, deleteProject, getAllMembersOfProject, addProjectMember, removeProjectMember } from "../../services/api/projectApiConnector";
import { FiFilter, FiPlus } from "react-icons/fi";
import type { ProjectRequest } from "../../models/projects/ProjectRequest";
import type { ProjectMemberRequest } from "../../models/projects/ProjectMemberRequest";
import type { ProjectMemberResponse } from "../../models/projects/ProjectMemberResponse";
import { ProjectModal } from "../../components/common/Project/ProjectModal/ProjectModalProps";
import MembersModal from "../../components/common/Project/MembersModal/MembersModalProps";

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [currentView, setCurrentView] = useState<"projects" | "kanban">("projects");
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedProjectForMembers, setSelectedProjectForMembers] = useState<ProjectResponse | null>(null);
  const [members, setMembers] = useState<ProjectMemberResponse[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data.items);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleSave = async (savedProject: ProjectResponse) => {
    try {
      const data = await getAllProjects();
      setProjects(data.items);
    } catch (error) {
      console.error("Error refetching projects after save:", error);
    }
  };

  const saveProject = async (data: ProjectRequest, id?: string): Promise<ProjectResponse> => {
    if (id) {
      return await updateProject(id, data);
    } else {
      return await createProject(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        const data = await getAllProjects();
        setProjects(data.items);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleViewMembers = async (project: ProjectResponse) => {
    setSelectedProjectForMembers(project);
    try {
      const data = await getAllMembersOfProject(project.id);
      setMembers(data.items);
      setShowMembersModal(true);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleAddMember = async (request: ProjectMemberRequest) => {
    if (selectedProjectForMembers) {
      try {
        await addProjectMember(selectedProjectForMembers.id, request);
        const data = await getAllMembersOfProject(selectedProjectForMembers.id);
        setMembers(data.items);
      } catch (error) {
        console.error("Error adding member:", error);
      }
    }
  };

  const handleRemoveMember = async (request: ProjectMemberRequest) => {
    if (selectedProjectForMembers) {
      try {
        await removeProjectMember(selectedProjectForMembers.id, request);
        const data = await getAllMembersOfProject(selectedProjectForMembers.id);
        setMembers(data.items);
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  return (
    <div>
      {currentView === "projects" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <FiFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null); 
                  setShowModal(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{ ...project, completed: 0, tasks: 0 }}
                onViewBoard={(proj) => {
                  setSelectedProject(proj);
                  setCurrentView("kanban");
                }}
                onEdit={(proj) => {
                  setEditingProject(proj);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
                onManageMembers={handleViewMembers}
              />
            ))}
          </div>
        </div>
      )}

      {currentView === "kanban" && selectedProject && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProject.name} - Board</h2>

          <button
            onClick={() => setCurrentView("projects")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Projects
          </button>
        </div>
      )}

      <ProjectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingProject={editingProject}
        saveProject={saveProject}
      />

      <MembersModal
        show={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={members}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        projectName={selectedProjectForMembers?.name}
      />
    </div>
  );
};

export default ProjectPage;