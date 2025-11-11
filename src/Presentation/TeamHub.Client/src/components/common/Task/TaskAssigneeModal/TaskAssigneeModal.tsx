import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import type { TaskResponse } from "../../../../models/tasks/TaskResponse";
import { searchUsers } from "../../../../services/api/userApiConnector";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";

interface TaskAssigneeModalProps {
  show: boolean;
  onClose: () => void;
  task: TaskResponse;
  onAssign: (userId: string) => void;
  onUnassign: () => void;
  errorMessage?: string;  // Optional error message
  successMessage?: string; // Optional success message
}

const TaskAssigneeModal: React.FC<TaskAssigneeModalProps> = ({
  show,
  onClose,
  task,
  onAssign,
  onUnassign,
  errorMessage,
  successMessage,
}) => {
  const [selectedUser, setSelectedUser] = useState<{ label: string; value: string } | null>(null);
  const [confirmUnassign, setConfirmUnassign] = useState(false);

  const loadUserOptions = async (inputValue: string) => {
    if (!inputValue.trim()) return [];
    try {
      const data = await searchUsers(inputValue);
      return (data.items || []).map((user) => ({
        label: user.fullName || user.email,
        value: user.id,
      }));
    } catch (err) {
      console.error("Error loading users:", err);
      return [];
    }
  };

  const handleAssign = () => {
    if (!selectedUser) return;
    onAssign(selectedUser.value);
    setSelectedUser(null);
  };

  const handleUnassignClick = () => setConfirmUnassign(true);

  const handleConfirmUnassign = () => {
    onUnassign();
    setConfirmUnassign(false);
    onClose();
  };

  const handleCancelUnassign = () => setConfirmUnassign(false);

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Assign Task: {task.title}</h2>

          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="mb-4">
            <AsyncSelect
              cacheOptions
              loadOptions={loadUserOptions}
              defaultOptions
              placeholder="Search for a user..."
              value={selectedUser}
              onChange={(option) => setSelectedUser(option)}
              className="text-sm"
            />
            <button
              onClick={handleAssign}
              disabled={!selectedUser}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-3 disabled:bg-gray-400"
            >
              Assign
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Current Assignee</h3>
            {task.assignedTo ? (
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span>{task.assignedTo}</span>
                  <button
                    onClick={handleUnassignClick}
                    className="text-red-500 hover:text-red-700"
                  >
                    Unassign
                  </button>
                </li>
              </ul>
            ) : (
              <p className="text-gray-500">No one is assigned.</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {confirmUnassign && (
        <ConfirmModal
          show={confirmUnassign}
          title="Unassign Task"
          message="Are you sure you want to unassign this task?"
          onConfirm={handleConfirmUnassign}
          onCancel={handleCancelUnassign}
        />
      )}
    </>
  );
};

export default TaskAssigneeModal;
