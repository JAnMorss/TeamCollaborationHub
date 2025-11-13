"use client"

import type React from "react"
import TaskFormModal from "../TaskFormModal/TaskFormModal"
import type { TaskRequest } from "../../../../models/tasks/TaskRequest"
import type { TaskResponse } from "../../../../models/tasks/TaskResponse"

type UpdateTaskModalProps = {
  show: boolean
  task: TaskResponse | null
  projectId: string
  onClose: () => void
  onUpdate: (id: string, task: TaskRequest) => Promise<void>
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({ show, task, projectId, onClose, onUpdate }) => {
  return <TaskFormModal show={show} task={task} projectId={projectId} onClose={onClose} onUpdate={onUpdate} />
}

export default UpdateTaskModal
