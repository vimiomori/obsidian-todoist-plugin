import { timezone } from "@/infra/time";
import { useState } from "react";
import {
  today,
  parseDate,
} from "@internationalized/date";
import classNames from "classnames";
import type React from "react";
import { TextField } from "react-aria-components";
import TextareaAutosize from "react-textarea-autosize";
import { type DueDate } from "./DueDateSelector";

type Props =
  {
    className: string;
    placeholder: string;
    onChange: (dueDate: DueDate) => void;
    autofocus?: boolean;
    onEnterKey?: () => Promise<void>;
  };

export const DueDateInput: React.FC<Props> = ({
  className,
  placeholder,
  onChange,
  onEnterKey,
  autofocus,
}) => {
  const onInputChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(getDate(ev.target.value));
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


const getDate = (input: string) => {
  if (input === "today") {
    return {
      date: today(timezone()),
      time: undefined
    }
  } else if (input === "tomorrow") {
    return {
      date: today(timezone()).add({ days: 1 }),
      time: undefined
    }
  }
  return {
    date: parseDate(input),
    time: undefined
  }
}
