import type { Refresh } from "@/data";
import type { TaskTree } from "@/data/transformations/relationships";
import { Task } from "@/ui/query/task/Task";
import { AnimatePresence } from "framer-motion";
import type React from "react";

type Props = {
  trees: TaskTree[];
  refresh: Refresh;
};

export const TaskList: React.FC<Props> = ({ trees, refresh }) => {
  return (
    <div className="todoist-tasks-list">
      <AnimatePresence>
        {trees.map((tree) => (
          <Task key={tree.id} tree={tree} refresh={refresh} />
        ))}
      </AnimatePresence>
    </div>
  );
};
