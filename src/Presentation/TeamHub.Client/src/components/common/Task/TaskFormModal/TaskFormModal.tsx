"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { TaskRequest } from "../../../../models/tasks/TaskRequest"
import type { TaskResponse } from "../../../../models/tasks/TaskResponse"

type TaskFormModalProps = {
  show: boolean
  projectId: string
  onClose: () => void
  onCreate?: (task: TaskRequest) => Promise<void>
  onUpdate?: (id: string, task: TaskRequest) => Promise<void>
  task?: TaskResponse | null 
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ show, onClose, onCreate, onUpdate, projectId, task }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium")
  const [status, setStatus] = useState<"Todo" | "InProgress" | "Review" | "Completed">("Todo")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority((task.priority as "Low" | "Medium" | "High") || "Medium")
      setStatus((task.status as "Todo" | "InProgress" | "Review" | "Completed") || "Todo")

      if (task.dueDate) {
        const date = new Date(task.dueDate)
        setDueDate(date.toISOString().split("T")[0])
      }
    } else {
      setTitle("")
      setDescription("")
      setPriority("Medium")
      setStatus("Todo")
      setDueDate("")
    }
  }, [task, show])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const priorityMap: Record<string, number> = { Low: 0, Medium: 1, High: 2 }
    const statusMap: Record<string, number> = {
      Todo: 0,
      InProgress: 1,
      Review: 2,
      Completed: 3,
    }

    const taskData: TaskRequest = {
      title,
      description,
      priority: priorityMap[priority],
      status: statusMap[status],
      projectId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    } as unknown as TaskRequest

    try {
      if (task && onUpdate) {
        await onUpdate(task.id, taskData)
      } else if (onCreate) {
        await onCreate(taskData)
      }

      setTitle("")
      setDescription("")
      setPriority("Medium")
      setStatus("Todo")
      setDueDate("")
      onClose()
    } catch (error) {
      console.error("Failed to save task:", error)
    }
  }

  if (!show) return null

  const isEditing = !!task

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Task" : "Create New Task"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-sm font-medium">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label text-sm font-medium">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label text-sm font-medium">Priority</label>
              <select
                className="select select-bordered w-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="label text-sm font-medium">Status</label>
              <select
                className="select select-bordered w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="Todo">Todo</option>
                <option value="InProgress">InProgress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label text-sm font-medium">Due Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="btn btn-ghost mr-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskFormModal
