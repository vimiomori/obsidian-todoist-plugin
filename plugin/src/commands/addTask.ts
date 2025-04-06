import type { Refresh } from "@/data";
import type { MakeCommand } from "@/commands";
import type { Translations } from "@/i18n/translation";
import type TodoistPlugin from "@/index";
import type { TaskTree } from "@/data/transformations/relationships";
import type { TaskCreationOptions } from "@/ui/taskModal";
import { MarkdownView, type TFile } from "obsidian";
import type { Query } from "@/query/query";

export const addTask: MakeCommand = (plugin: TodoistPlugin, i18n: Translations["commands"]) => {
  return {
    name: i18n.addTask,
    callback: makeCallback(plugin),
  };
};

export const addTaskWithPageInContent: MakeCommand = (plugin: TodoistPlugin, i18n: Translations["commands"]) => {
  return {
    id: "add-task-page-content",
    name: i18n.addTaskPageContent,
    callback: makeCallback(plugin, { appendLinkToContent: true }),
  };
};

export const addTaskWithPageInDescription: MakeCommand = (plugin: TodoistPlugin, i18n: Translations["commands"]) => {
  return {
    id: "add-task-page-description",
    name: i18n.addTaskPageDescription,
    callback: makeCallback(plugin, { appendLinkToDescription: true }),
  };
};

export const editTask: MakeCommand = (plugin: TodoistPlugin, i18n: Translations["commands"], task?: TaskTree, refresh?: Refresh) => {
  return {
    id: "edit-task",
    name: i18n.editTask,
    callback: makeEditCallback(plugin, undefined, task, refresh),
  };
};

const makeCallback = (plugin: TodoistPlugin, opts?: Partial<TaskCreationOptions>) => {
  return () => {
    plugin.services.modals.taskCreation({
      initialContent: grabSelection(plugin),
      fileContext: getFileContext(plugin),
      options: {
        appendLinkToContent: false,
        appendLinkToDescription: false,
        ...(opts ?? {}),
      },
    });
  };
};

const makeEditCallback = (plugin: TodoistPlugin, opts?: Partial<TaskCreationOptions>, task?: TaskTree, refresh?: Refresh) => {
  if (task === undefined) {
    return makeCallback(plugin, opts)
  }
  if (refresh === undefined) {
    return makeCallback(plugin, opts)
  }
  return () => {
    plugin.services.modals.taskUpdate({
      task: task,
      fileContext: getFileContext(plugin),
      refresh: refresh,
      options: {
        appendLinkToContent: false,
        appendLinkToDescription: false,
        ...(opts ?? {}),
      },
    });
  };
};

const grabSelection = (plugin: TodoistPlugin): string => {
  const editorView = plugin.app.workspace.getActiveViewOfType(MarkdownView)?.editor;

  if (editorView !== undefined) {
    return editorView.getSelection();
  }

  return window.getSelection()?.toString() ?? "";
};

const getFileContext = (plugin: TodoistPlugin): TFile | undefined => {
  return plugin.app.workspace.getActiveFile() ?? undefined;
};
