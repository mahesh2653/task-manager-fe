"use client";
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "@/services/authContext";
import { toastError, toastInfo } from "@/utils/toast";

const taskSchema = Yup.object().shape({
  title: Yup.string().min(3, "Title must be at least 3 characters"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
});

interface intialTaskValues {
  title: string;
  description: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: intialTaskValues;
  taskId?: string;
}

interface HandleSubmitValues {
  title: string;
  description: string;
}

interface HandleSubmitActions {
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const url = process.env.BACKEND_URL;

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  initialTask = { title: "", description: "" },
  taskId,
}) => {
  const { user } = useAuth();
  const initialValues = {
    title: initialTask.title || "",
    description: initialTask.description || "",
  };

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    });

    return () => {
      window.removeEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      });
    };
  }, []);

  const handleSubmit = async (
    values: HandleSubmitValues,
    { setSubmitting, resetForm }: HandleSubmitActions
  ): Promise<void> => {
    try {
      let response;
      if (taskId) {
        response = await axios.put(`${url}/api/tasks/${taskId}`, {
          ...values,
          userId: user?.id,
        });
      } else {
        console.log(values);
        response = await axios.post(`${url}/api/tasks`, {
          ...values,
          userId: user?.id,
          status: false,
        });
      }
      toastInfo(response.data.message);

      // resetForm();
      setTimeout(() => onClose(), 500);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toastError(error.response.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur z-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-2xl">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
              {taskId ? "Update Task" : "Add Task"}
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={taskSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <Field
                      as="input"
                      id="title"
                      name="title"
                      className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your title.."
                      rows={4}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your description.."
                      rows={4}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-white bg-blue-500  cursor-pointer rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                    >
                      {isSubmitting
                        ? "Processing..."
                        : taskId
                        ? "Update Task"
                        : "Add Task"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModal;
