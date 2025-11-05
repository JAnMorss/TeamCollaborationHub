import React, { useState } from "react";
import type { ProjectMemberRequest } from "../../../../models/projects/ProjectMemberRequest";
import type { ProjectMemberResponse } from "../../../../models/projects/ProjectMemberResponse";

interface MembersModalProps {
  show: boolean;
  onClose: () => void;
  members: ProjectMemberResponse[];
  onAddMember: (request: ProjectMemberRequest) => void;
  onRemoveMember: (request: ProjectMemberRequest) => void;
  projectName?: string; 
}

const MembersModal: React.FC<MembersModalProps> = ({
  show,
  onClose,
  members,
  onAddMember,
  onRemoveMember,
  projectName,
}) => {
  const [newMemberUserId, setNewMemberUserId] = useState("");

  const handleAdd = () => {
    if (newMemberUserId.trim()) {
      const request: ProjectMemberRequest = {
        userId: newMemberUserId
      };
      onAddMember(request);
      setNewMemberUserId("");
    }
  };

  const handleRemove = (member: ProjectMemberResponse) => {
    const request: ProjectMemberRequest = {
      userId: member.userId, 
    };
    onRemoveMember(request);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Manage Members {projectName ? `for ${projectName}` : ""}
        </h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Add Member</h3>
          <input
            type="text"
            placeholder="User ID"
            value={newMemberUserId}
            onChange={(e) => setNewMemberUserId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />

          <button
            onClick={handleAdd}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Add Member
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Current Members</h3>
          {members.length === 0 ? (
            <p>No members yet.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <span>
                    {member.fullName || member.userId} - {member.role}
                  </span>
                  <button
                    onClick={() => handleRemove(member)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
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
  );
};

export default MembersModal;