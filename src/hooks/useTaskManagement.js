import { useRef, useCallback, useState } from "react";
import { apiClient } from "../utils/api";

export const useTaskManagement = () => {
  const [tasksCache, setTasksCache] = useState({});
  const loadingRef = useRef(new Set()); // prevent duplicate active requests

  const fetchTasks = useCallback(async (dateKey) => {
    // ✔ already cached → do NOT request
    if (tasksCache[dateKey]) return tasksCache[dateKey];

    // ✔ prevent parallel duplicate fetch calls
    if (loadingRef.current.has(dateKey)) return;

    loadingRef.current.add(dateKey);

    const tasks = await apiClient.fetchTasks(dateKey);

    setTasksCache(prev => ({ ...prev, [dateKey]: tasks }));
    loadingRef.current.delete(dateKey);

    return tasks;
  }, [tasksCache]);

  const saveTasks = useCallback(async (dateKey, tasks) => {
    setTasksCache(prev => ({ ...prev, [dateKey]: tasks }));
    await apiClient.saveTasks(dateKey, tasks);
  }, []);

  return { fetchTasks, saveTasks, tasksCache };
};
