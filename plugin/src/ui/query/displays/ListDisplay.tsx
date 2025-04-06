import type { Refresh } from "@/data";
import type { Task } from "@/data/task";
import { type TaskTree, buildTaskTree } from "@/data/transformations/relationships";
import { sortTasks } from "@/data/transformations/sorting";
import type { SortingVariant } from "@/query/query";
import { QueryContext } from "@/ui/context";
import { TaskList } from "@/ui/query/task/TaskList";
import type React from "react";

type Props = {
  tasks: Task[];
  refresh: Refresh;
};

export const ListDisplay: React.FC<Props> = ({ tasks, refresh }) => {
  const query = QueryContext.use();
  const trees = getTaskTree(tasks, query.sorting);

  return <TaskList trees={trees} refresh={refresh} />;
};

const getTaskTree = (tasks: Task[], sorting: SortingVariant[]): TaskTree[] => {
  const copy = [...tasks];
  sortTasks(copy, sorting);
  return buildTaskTree(copy);
};
