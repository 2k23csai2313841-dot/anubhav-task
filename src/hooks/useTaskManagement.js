import { useState, useCallback } from "react";
import {
  apiClient,
  apiClient_extended,
  getSharedDefaultTasksKey,
} from "../utils/api";

export const useTaskManagement = () => {
  const [tasksCache, setTasksCache] = useState({});
  const [sharedDefaultTasks, setSharedDefaultTasks] = useState([]);

  const fetchSharedDefaultTasks = useCallback(async () => {
    const tasks = await apiClient_extended.fetchSharedDefaultTasks();
    setSharedDefaultTasks(tasks);
    return tasks;
  }, []);

  const saveSharedDefaultTasks = useCallback(async (tasks) => {
    setSharedDefaultTasks(tasks);
    await apiClient_extended.saveSharedDefaultTasks(tasks);
    // Invalidate all cached date-specific tasks to force refresh
    setTasksCache({});
  }, []);

  const fetchTasks = useCallback(
    async (dateKey) => {
      if (tasksCache[dateKey]) {
        return tasksCache[dateKey];
      }

      const tasks = await apiClient.fetchTasks(dateKey);
      setTasksCache((prev) => ({ ...prev, [dateKey]: tasks }));
      return tasks;
    },
    [tasksCache]
  );

  const saveTasks = useCallback(
    async (dateKey, tasks) => {
      // Separate date-specific and shared default tasks
      const dateSpecificTasks = tasks.filter(
        (t) => !sharedDefaultTasks.some((sd) => sd.text === t.text)
      );

      setTasksCache((prev) => ({ ...prev, [dateKey]: tasks }));
      await apiClient.saveTasks(dateKey, dateSpecificTasks);
    },
    [sharedDefaultTasks]
  );

  const updateTasksCache = useCallback((dateKey, tasks) => {
    setTasksCache((prev) => ({ ...prev, [dateKey]: tasks }));
  }, []);

  return {
    fetchTasks,
    saveTasks,
    updateTasksCache,
    tasksCache,
    fetchSharedDefaultTasks,
    saveSharedDefaultTasks,
    sharedDefaultTasks,
  };
};
