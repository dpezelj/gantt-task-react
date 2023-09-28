import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";
import { useProvideChipColors } from "../../task-list/useProvideChipColors";

export const BarSmall: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const x = false;
  const { resolveChipColor, resolveChipLabelColor } = useProvideChipColors();

  const progressPoint = getProgressPoint(
    task.progressWidth + task.x1,
    task.y,
    task.height
  );

  const taskStyle = {
    ...task.styles,
    backgroundColor: resolveChipLabelColor(task.color, "test") || "#ededed",
    backgroundSelectedColor: resolveChipColor(task.color, "test") || "#ededed",
  };
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={taskStyle}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isProgressChangeable && x && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
