"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomTable from "./customTable";
import TaskModal from "./taskModel";
import { toastInfo } from "@/utils/toast";

interface UserDashboardProps {
  id: string;
}

const url = process.env.BACKEND_URL;

const UserDashboard: React.FC<UserDashboardProps> = ({ id }) => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [initialTask, setInitialTask] = useState({
    title: "",
    description: "",
  });

  const coloumns = [
    {
      accessorKey: "_id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },

    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: any) => {
        const date = new Date(row.original.createdAt);
        return date.toDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        return (
          <div className="font-semibold ">
            {Boolean(row.original.status) ? (
              <span className="text-green-500">Completed</span>
            ) : (
              <span className="text-red-500">Pending</span>
            )}
          </div>
        );
      },
    },
    {
      id: "select",
      header: () => <div>Actions</div>,
      cell: ({ row }: any) => (
        <div className="flex  gap-2">
          <button
            onClick={async () => {
              const response = await axios.put(
                `${url}/api/tasks/${row.original._id}`,
                {
                  status: !row.original.status,
                }
              );
              toastInfo(response.data.message);
              getTaskData();
            }}
            className={`px-3 py-1 cursor-pointer ${
              !row.original.status
                ? "bg-green-500 hover:bg-green-400"
                : "bg-amber-500 hover:bg-amber-400"
            } text-white rounded  transition-colors`}
          >
            {row.original.status ? "Undo" : "Done"}
          </button>
          <button
            onClick={() => {
              setTaskId(row.original._id);
              setInitialTask({
                title: row.original.title,
                description: row.original.description,
              });

              setIsModalOpen(true);
            }}
            className="px-3 py-1 bg-blue-500 cursor-pointer text-white rounded hover:bg-blue-600 transition-colors"
            disabled={Boolean(row.original.status)}
          >
            Edit
          </button>

          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete this task?")) {
                const response = await axios.delete(
                  `${url}/api/tasks/${row.original._id}`
                );
                toastInfo(response.data.message);
                getTaskData();
              }
            }}
            className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const getTaskData = async () => {
    try {
      const response = await axios.get(`${url}/api/tasks/user/${id}`);
      console.log(response.data.data);
      setTasks(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (isModalOpen) return;
    getTaskData();
  }, [isModalOpen]);
  return (
    <div>
      <CustomTable
        data={tasks}
        columns={coloumns}
        title="Task Management Dashboard"
        addData={() => {
          setInitialTask({ description: "", title: "" });
          setTaskId("");
          setIsModalOpen(true);
        }}
        buttonName="Add Task"
      />
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          taskId={taskId}
          initialTask={initialTask}
        />
      )}
    </div>
  );
};

export default UserDashboard;
