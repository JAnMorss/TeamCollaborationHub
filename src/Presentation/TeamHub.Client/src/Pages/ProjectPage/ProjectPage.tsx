import React, { useEffect, useState } from "react";
import { FiFilter, FiPlus, FiChevronDown } from "react-icons/fi";
import { ProjectCard } from "../../components/common/Project/ProjectCard/ProjectCard";
import type { ProjectResponse } from "../../models/projects/ProjectResponse";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getAllMembersOfProject,
  addProjectMember,
  removeProjectMember,
} from "../../services/api/projectApiConnector";
import type { ProjectRequest } from "../../models/projects/ProjectRequest";
import type { ProjectMemberRequest } from "../../models/projects/ProjectMemberRequest";
import type { ProjectMemberResponse } from "../../models/projects/ProjectMemberResponse";
import { ProjectModal } from "../../components/common/Project/ProjectModal/ProjectModalProps";
import MembersModal from "../../components/common/Project/MembersModal/MembersModalProps";
import { getMyProfile } from "../../services/api/userApiConnector";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import KanbanBoard from "../KanbanBoard/KanbanBoard";

const sortOptions = [
  { label: "Name (A–Z)", sortBy: "name", descending: false },
  { label: "Name (Z–A)", sortBy: "name", descending: true },
];

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [currentView, setCurrentView] = useState<"projects" | "kanban">("projects");
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedProjectForMembers, setSelectedProjectForMembers] = useState<ProjectResponse | null>(null);
  const [members, setMembers] = useState<ProjectMemberResponse[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(sortOptions[0]);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setCurrentUserId(profile.id);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchProfile();
  }, []);

  const fetchProjects = async (sortBy?: string, descending?: boolean) => {
    try {
      const data = await getAllProjects({ sortBy, descending });
      setProjects(data.items);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects(selectedFilter.sortBy, selectedFilter.descending);
  }, []);

  const handleSave = async () => {
    await fetchProjects(selectedFilter.sortBy, selectedFilter.descending);
  };

  const saveProject = async (data: ProjectRequest, id?: string): Promise<ProjectResponse> => {
    if (id) return await updateProject(id, data);
    return await createProject(data);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      show: true,
      message: "Are you sure you want to delete this project?",
      onConfirm: async () => {
        try {
          await deleteProject(id);
          await fetchProjects(selectedFilter.sortBy, selectedFilter.descending);
        } catch (error) {
          console.error("Error deleting project:", error);
        } finally {
          setConfirmModal({ show: false, message: "", onConfirm: () => {} });
        }
      },
    });
  };

  const handleViewMembers = async (project: ProjectResponse) => {
    setSelectedProjectForMembers(project);
    try {
      const data = await getAllMembersOfProject(project.id);
      setMembers(data.items || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setShowMembersModal(true);
    }
  };

  const handleAddMember = async (request: ProjectMemberRequest) => {
    if (!selectedProjectForMembers) return;

    try {
      await addProjectMember(selectedProjectForMembers.id, request);
      const data = await getAllMembersOfProject(selectedProjectForMembers.id);
      setMembers(data.items);

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === selectedProjectForMembers.id ? { ...proj, members: data.items } : proj
        )
      );
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleRemoveMember = (request: ProjectMemberRequest) => {
    if (!selectedProjectForMembers) return;

    const member = members.find((m) => m.userId === request.userId);
    const isCurrentUser = member?.userId === currentUserId;
    const action = isCurrentUser ? "leave this project" : "remove this member";

    setConfirmModal({
      show: true,
      message: `Are you sure you want to ${action}?`,
      onConfirm: async () => {
        try {
          setMembers((prev) => prev.filter((m) => m.userId !== request.userId));
          setProjects((prev) =>
            prev.map((proj) =>
              proj.id === selectedProjectForMembers.id
                ? {
                    ...proj,
                    members: Array.isArray(proj.members)
                      ? proj.members.filter((m: ProjectMemberResponse) => m.userId !== request.userId)
                      : [],
                  }
                : proj
            )
          );

          await removeProjectMember(selectedProjectForMembers.id, request);

          const data = await getAllMembersOfProject(selectedProjectForMembers.id);

          setMembers(data.items);
        } catch (error) {
          console.error("Error removing member:", error);
        } finally {
          setConfirmModal({ show: false, message: "", onConfirm: () => {} });
        }
      },
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {currentView === "projects" && (
        <div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-3xl font-bold text-gray-900">Projects</h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">

              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setFilterOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <FiFilter className="w-4 h-4 mr-2" />
                  <span>{selectedFilter.label}</span>
                  <FiChevronDown className="w-4 h-4 ml-2" />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {sortOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => {
                          setSelectedFilter(option);
                          setFilterOpen(false);
                          fetchProjects(option.sortBy, option.descending);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          selectedFilter.label === option.label ? "bg-gray-50 font-medium" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setShowModal(true);
                }}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <KanbanBoard
          projectName={selectedProject.name}
          onBack={() => setCurrentView("projects")}
        />
      )}


      <ProjectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingProject={editingProject}
        saveProject={saveProject}
      />

      {currentUserId && (
        <MembersModal
          show={showMembersModal}
          onClose={() => setShowMembersModal(false)}
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          projectName={selectedProjectForMembers?.name}
          currentUserId={currentUserId}
        />
      )}

      <ConfirmModal
        show={confirmModal.show}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false, message: "", onConfirm: () => {} })}
      />
    </div>
  );
};

export default ProjectPage;
