import type { Refresh } from "@/data";
import {
  addTask,
  addTaskWithPageInContent,
  addTaskWithPageInDescription,
  editTask,
} from "@/commands/addTask";
import { t } from "@/i18n";
import type { Translations } from "@/i18n/translation";
import type TodoistPlugin from "@/index";
import type { TaskTree } from "@/data/transformations/relationships";
import debug from "@/log";
import type { Command as ObsidianCommand } from "obsidian";
import type { Query } from "@/query/query";

export type MakeCommand = (
  plugin: TodoistPlugin,
  i18n: Translations["commands"],
  task?: TaskTree,
  refresh?: Refresh,
) => Omit<ObsidianCommand, "id">;

const syncCommand: MakeCommand = (plugin: TodoistPlugin, i18n: Translations["commands"]) => {
  return {
    name: i18n.sync,
    callback: async () => {
      debug("Syncing with Todoist API");
      plugin.services.todoist.sync();
    },
  };
};

const commands = {
  "todoist-sync": syncCommand,
  "add-task": addTask,
  "add-task-page-content": addTaskWithPageInContent,
  "add-task-page-description": addTaskWithPageInDescription,
  "edit-task": editTask,
};

export type CommandId = keyof typeof commands;

export const registerCommands = (plugin: TodoistPlugin) => {
  const i18n = t().commands;
  for (const [id, make] of Object.entries(commands)) {
    plugin.addCommand({ id, ...make(plugin, i18n) });
  }
};

export const fireCommand = <K extends CommandId>(id: K, plugin: TodoistPlugin, task?: TaskTree, refresh?: Refresh) => {
  const i18n = t().commands;
  const make = commands[id];
  make(plugin, i18n, task, refresh).callback?.();
};
