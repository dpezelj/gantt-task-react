import React, { useCallback } from "react";

import cx from "classnames";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarRelationHandle } from "./bar-relation-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";
import { useProvideChipColors } from "../../task-list/useProvideChipColors";
import {
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import stylesRelationHandle from "./bar-relation-handle.module.css";

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: "#666",
    background: "#fff",
    padding: "1rem",
    borderRadius: "1rem",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
}));

export const Bar: React.FC<TaskItemProps> = ({
  task,
  taskHalfHeight,
  relationCircleOffset,
  relationCircleRadius,
  isProgressChangeable,
  isDateChangeable,
  isRelationChangeable,
  isRelationDrawMode,
  rtl,
  onEventStart,
  onRelationStart,
  isSelected,
}) => {
  const { resolveChipColor, resolveChipLabelColor } = useProvideChipColors();

  const onLeftRelationTriggerMouseDown = useCallback(() => {
    onRelationStart(rtl ? "endOfTask" : "startOfTask", task);
  }, [onRelationStart, rtl, task]);

  const onRightRelationTriggerMouseDown = useCallback(() => {
    onRelationStart(rtl ? "startOfTask" : "endOfTask", task);
  }, [onRelationStart, rtl, task]);

  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;
  const taskStyle = {
    ...task.styles,
    backgroundColor: resolveChipLabelColor(task.color, "test") || "#ededed",
    backgroundSelectedColor: resolveChipColor(task.color, "test") || "#ededed",
  };
  return (
    <HtmlTooltip
      placement="bottom-start"
      title={
        <React.Fragment>
          <Typography
            style={{ textAlign: "center", color: "black", fontSize: "14px" }}
          >
            <div style={{ margin: "auto" }}>{task.name}</div>
          </Typography>
          <pre
            className={styles.tooltipDefaultContainerParagraph}
          >{`${task.start.getDate()}.${
            task.start.getMonth() + 1
          }.${task.start.getFullYear()} - ${task.end.getDate()}.${
            task.end.getMonth() + 1
          }.${task.end.getFullYear()}`}</pre>
          {task.end.getTime() - task.start.getTime() !== 0 && (
            <p
              className={styles.tooltipDefaultContainerParagraph}
            >{`Duration: ${~~(
              (task.end.getTime() - task.start.getTime()) /
              (1000 * 60 * 60 * 24)
            )} day(s)`}</p>
          )}

          <p className={styles.tooltipDefaultContainerParagraph}>
            {!!task.progress && `Progress: ${task.progress} %`}
          </p>
        </React.Fragment>
      }
    >
      <g
        className={cx(
          styles.barWrapper,
          stylesRelationHandle.barRelationHandleWrapper
        )}
        tabIndex={0}
      >
        <BarDisplay
          x={task.x1}
          y={task.y + 2}
          width={task.x2 - task.x1}
          height={15}
          progressX={task.progressX}
          progressWidth={0} //HARDCODED TO FULL COLOR THE TASK BAR
          barCornerRadius={task.barCornerRadius}
          styles={taskStyle}
          isSelected={isSelected}
          onMouseDown={e => {
            isDateChangeable && onEventStart("move", task, e);
          }}
        />
        <g className="handleGroup">
          {isDateChangeable && (
            <g>
              {/* left */}
              <BarDateHandle
                x={task.x1 + 1}
                y={task.y + 1}
                width={task.handleWidth}
                height={handleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  onEventStart("start", task, e);
                }}
              />
              {/* right */}
              <BarDateHandle
                x={task.x2 - task.handleWidth - 1}
                y={task.y + 1}
                width={task.handleWidth}
                height={handleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  onEventStart("end", task, e);
                }}
              />
            </g>
          )}
          {isRelationChangeable && (
            <g>
              {/* left */}
              <BarRelationHandle
                isRelationDrawMode={isRelationDrawMode}
                x={task.x1 - relationCircleOffset}
                y={task.y + taskHalfHeight}
                radius={relationCircleRadius}
                onMouseDown={onLeftRelationTriggerMouseDown}
              />
              {/* right */}
              <BarRelationHandle
                isRelationDrawMode={isRelationDrawMode}
                x={task.x2 + relationCircleOffset}
                y={task.y + taskHalfHeight}
                radius={relationCircleRadius}
                onMouseDown={onRightRelationTriggerMouseDown}
              />
            </g>
          )}
          {isProgressChangeable && (
            <BarProgressHandle
              progressPoint={progressPoint}
              onMouseDown={e => {
                onEventStart("progress", task, e);
              }}
            />
          )}
        </g>
      </g>
    </HtmlTooltip>
  );
};
