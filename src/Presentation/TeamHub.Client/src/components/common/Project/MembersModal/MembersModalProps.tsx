import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import type { ProjectMemberRequest } from "../../../../models/projects/ProjectMemberRequest";
import type { ProjectMemberResponse } from "../../../../models/projects/ProjectMemberResponse";
import { searchUsers } from "../../../../services/api/userApiConnector";
import type { UserProfileDTO } from "../../../../models/users/UserProfileDTO";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";

interface MembersModalProps {
  show: boolean;
  onClose: () => void;
  members: ProjectMemberResponse[];
  onAddMember: (request: ProjectMemberRequest) => void;
  onRemoveMember: (request: ProjectMemberRequest) => void;
  projectName?: string;
  currentUserId?: string | null;
}

const MembersModal: React.FC<MembersModalProps> = ({
  show,
  onClose,
  members,
  onAddMember,
  onRemoveMember,
  projectName,
  currentUserId,
  }) => {
    const [selectedUser, setSelectedUser] = useState<{ label: string; value: string } | null>(null);
    const [confirmMember, setConfirmMember] = useState<ProjectMemberResponse | null>(null);

    const loadUserOptions = async (inputValue: string) => {
      if (!inputValue.trim()) return [];
      try {
        const data = await searchUsers(inputValue);
        if (!data.items || data.items.length === 0) return [];

        return data.items.map((user: UserProfileDTO) => ({
          label: user.fullName || user.email,
          value: user.id,
        }));
      } catch (error) {
        console.error("Error loading users:", error);
        return [];
      }
    };

  const handleAdd = () => {
    if (!selectedUser) return;

    const alreadyMember = members.some((m) => m.userId === selectedUser.value);
    if (alreadyMember) {
      alert("This user is already a member of the project.");
      return;
    }

    const request: ProjectMemberRequest = { userId: selectedUser.value };
    onAddMember(request);
    setSelectedUser(null);
  };

  const handleRemoveClick = (member: ProjectMemberResponse) => {
    setConfirmMember(member);
  };

  const handleConfirmRemove = () => {
    if (!confirmMember) return;
    const request: ProjectMemberRequest = { userId: confirmMember.userId };
    onRemoveMember(request);
    setConfirmMember(null);
  };

  const handleCancelRemove = () => setConfirmMember(null);

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            Manage Members {projectName ? `for ${projectName}` : ""}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Add Member</h3>

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
              onClick={handleAdd}
              disabled={!selectedUser}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-3 disabled:bg-gray-400"
            >
              Add Member
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Current Members</h3>

            {members.length === 0 ? (
              <p className="text-gray-500">No members yet.</p>
            ) : (
              <ul className="space-y-2">
                {members.map((member) => {
                  const isCurrentUser = member.userId === currentUserId;
                  return (
                    <li
                      key={member.id}
                      className="flex items-center justify-between p-2 border border-gray-200 rounded"
                    >
                      <span>
                        {member.fullName || member.userId} - {member.role}
                      </span>
                      <button
                        onClick={() => handleRemoveClick(member)}
                        className={`${
                          isCurrentUser
                            ? "text-orange-500 hover:text-orange-700"
                            : "text-red-500 hover:text-red-700"
                        }`}
                      >
                        {isCurrentUser ? "Leave" : "Remove"}
                      </button>
                    </li>
                  );
                })}
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

      {confirmMember && (
        <ConfirmModal
          show={!!confirmMember}
          title={
            confirmMember.userId === currentUserId
              ? "Leave Project"
              : "Remove Member"
          }
          message={
            confirmMember.userId === currentUserId
              ? "Are you sure you want to leave this project?"
              : "Are you sure you want to remove this member from the project?"
          }
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}
    </>
  );
};

export default MembersModal;
