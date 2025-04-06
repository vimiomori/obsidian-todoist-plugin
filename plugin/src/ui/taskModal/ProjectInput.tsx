import { PluginContext } from "@/ui/context";
import classNames from "classnames";
import type React from "react";
import { TextField } from "react-aria-components";
import TextareaAutosize from "react-textarea-autosize";
import { type ProjectIdentifier } from "./ProjectSelector";
import { type DataAccessor } from "@/data";

type Props =
  {
    className: string;
    placeholder: string;
    onChange: (selected: ProjectIdentifier) => void;
    autofocus?: boolean;
    onEnterKey?: () => Promise<void>;
  };

export const ProjectInput: React.FC<Props> = ({
  className,
  placeholder,
  onChange,
  onEnterKey,
  autofocus,
}) => {
  const plugin = PluginContext.use();
  const todoistData = plugin.services.todoist.data();
  const onInputChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const project = getProject(ev.target.value, todoistData)
    if (project !== undefined) {
      onChange(project)
    }
  };

  const onKeyDown = async (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onEnterKey === undefined) {
      return;
    }

    if (ev.key === "Enter") {
      ev.preventDefault();
      await onEnterKey();
    }
  };

  const classes = classNames("task-content-input", className);
  return (
    <TextField className={classes} aria-label={placeholder}>
      <TextareaAutosize
        className={classes}
        placeholder={placeholder}
        onChange={onInputChange}
        aria-label={placeholder}
        autoFocus={autofocus}
        onKeyDown={onKeyDown}
      />
    </TextField>
  );
};


// TODO: what to do when nothing matches
const getProject = (input: string, data: DataAccessor) => {
  let matched = undefined
  for (const project of data.projects.iter()) {
    if (project.name.toLowerCase().includes(input.toLowerCase())) {
      matched = project
    }
  }

  if (matched !== undefined) {
    return { projectId: matched.id }
  }
  return undefined
}
