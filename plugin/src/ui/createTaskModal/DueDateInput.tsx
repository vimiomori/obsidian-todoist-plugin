import { timezone } from "@/infra/time";
import * as chrono from 'chrono-node';
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
  const date = chrono.parseDate(input)
  if (date === null) {
    return {
      date: parseDate(""),
      time: undefined
    }
  }

  return {
    // date: parseDate(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`),
    date: parseDate(date.toISOString().split("T")[0]),
    time: undefined
  }
}
