import React, { useState, useEffect } from "react";
import type { ProjectRequest } from "../../../../models/projects/ProjectRequest";
import type { ProjectResponse } from "../../../../models/projects/ProjectResponse";

interface ProjectModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (project: ProjectResponse) => void;
  editingProject?: ProjectResponse | null;
  saveProject: (data: ProjectRequest, id?: string) => Promise<ProjectResponse>;
}

const colorOptions = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
]; // Updated color options

export const ProjectModal: React.FC<ProjectModalProps> = ({
  show,
  onClose,
  onSave,
  editingProject,
  saveProject,
}) => {
  const [formData, setFormData] = useState<ProjectRequest>({
    name: "",
    description: "",
    color: colorOptions[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name,
        description: editingProject.description || "",
        color: editingProject.color || colorOptions[0],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        color: colorOptions[0],
      });
    }
  }, [editingProject]);

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const savedProject = await saveProject(formData, editingProject?.id);
      onSave(savedProject);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> 
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingProject ? "Edit Project" : "Create New Project"}
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-xl transition-all ${
                    formData.color === color
                      ? "ring-2 ring-gray-400 ring-offset-2 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !formData.name.trim()}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : editingProject ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
