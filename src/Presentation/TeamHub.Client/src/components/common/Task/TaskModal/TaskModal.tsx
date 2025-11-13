"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { TaskResponse } from "../../../../models/tasks/TaskResponse"
import type { TaskAttachmentResponse } from "../../../../models/tasks/TaskAttachmentResponse"
import { uploadAttachment, downloadAttachment, removeAttachment } from "../../../../services/api/taskApiConnector"

import { FiX, FiSend, FiUpload, FiDownload, FiTrash2 } from "react-icons/fi"

interface TaskModalProps {
  show: boolean
  task?: TaskResponse
  editingTask?: TaskResponse | null
  onClose: () => void
  onSave?: () => Promise<void>
}

const TaskModal: React.FC<TaskModalProps> = ({ show, task, editingTask, onClose, onSave }) => {
  const activeTask = editingTask || task

  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [attachments, setAttachments] = useState<TaskAttachmentResponse[]>([])
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (activeTask && Array.isArray(activeTask.attachments)) {
      setAttachments(activeTask.attachments)
    } else {
      setAttachments([])
    }
  }, [activeTask])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!show || !activeTask) return null

  const handleSend = () => {
    if (!newMessage.trim()) return
    setMessages([...messages, { sender: "You", message: newMessage }])
    setNewMessage("")
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    Array.from(e.target.files).forEach((file) => formData.append("files", file))

    try {
      const uploadedFiles = await uploadAttachment(activeTask.id, formData)
      setAttachments((prev) => [...prev, uploadedFiles])
    } catch (err) {
      console.error("Failed to upload attachment:", err)
      alert("Failed to upload file.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDownload = async (attachment: TaskAttachmentResponse) => {
    try {
      const blob = await downloadAttachment(attachment.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = attachment.fileName
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download attachment:", err)
      alert("Failed to download file.")
    }
  }

  const handleRemove = async (attachment: TaskAttachmentResponse) => {
    if (!confirm(`Are you sure you want to remove "${attachment.fileName}"?`)) return

    try {
      await removeAttachment(attachment.id)
      setAttachments((prev) => prev.filter((att) => att.id !== attachment.id))
    } catch (err) {
      console.error("Failed to remove attachment:", err)
      alert("Failed to remove file.")
    }
  }

  const handleClose = async () => {
    if (onSave) {
      await onSave()
    }
    onClose()
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{activeTask.title}</h3>
            <p className="py-2 text-sm text-gray-600">{activeTask.description}</p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="mb-4 flex-1 flex flex-col">
            <h4 className="font-semibold text-gray-700 mb-2">Messages</h4>
            <div className="bg-base-200 rounded-lg p-4 flex-1 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages yet...</p>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="chat chat-start">
                    <div className="chat-header text-xs font-semibold text-gray-700">{msg.sender}</div>
                    <div className="chat-bubble chat-bubble-primary text-sm">{msg.message}</div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="input input-bordered flex-1 text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="btn btn-primary btn-sm flex items-center">
              <FiSend size={16} />
              <span className="ml-1">Send</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <h4 className="font-semibold text-gray-700 mb-2">Attachments</h4>
            <label className="btn btn-outline btn-sm mb-4 flex items-center gap-1">
              <FiUpload size={16} />
              {uploading ? "Uploading..." : "Upload Attachment"}
              <input type="file" className="hidden" multiple onChange={handleUpload} />
            </label>
            <div className="overflow-y-auto max-h-32">
              {attachments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No attachments yet</p>
              ) : (
                <ul className="space-y-2">
                  {attachments.map((att) => (
                    <li
                      key={att.id}
                      className="flex items-center justify-between bg-base-200 hover:bg-base-300 px-3 py-2 rounded-lg transition-all duration-200 group"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">{att.fileName}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleDownload(att)}
                          className="btn btn-ghost btn-xs text-gray-600 hover:text-blue-600"
                          aria-label="Download file"
                        >
                          <FiDownload size={16} />
                        </button>
                        <button
                          onClick={() => handleRemove(att)}
                          className="btn btn-ghost btn-xs text-gray-600 hover:text-red-600"
                          aria-label="Delete file"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
