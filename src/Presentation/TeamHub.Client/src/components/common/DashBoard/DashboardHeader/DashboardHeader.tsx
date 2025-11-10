import { useState } from "react";
import { GoPlus } from "react-icons/go";
import type { ProjectRequest } from "../../../../models/projects/ProjectRequest";
import type { ProjectResponse } from "../../../../models/projects/ProjectResponse";
import { updateProject, createProject } from "../../../../services/api/projectApiConnector";
import { ProjectModal } from "../../Project/ProjectModal/ProjectModalProps";

interface DashboardHeaderProps {
  onProjectCreated?: () => void; 
}

export default function DashboardHeader({ onProjectCreated }: DashboardHeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

  const saveProject = async (data: ProjectRequest, id?: string): Promise<ProjectResponse> => {
    if (id) return await updateProject(id, data);
    return await createProject(data);
  };

  const handleSave = async () => {
    setShowModal(false);
    if (onProjectCreated) {
      await onProjectCreated(); 
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h2>

      <button
        onClick={() => {
          setEditingProject(null);
          setShowModal(true);
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base shadow-md"
      >
        <GoPlus className="w-4 h-4" />
        <span>New Project</span>
      </button>

      <ProjectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingProject={editingProject}
        saveProject={saveProject}
      />
    </div>
  );
}
