import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "./project.module.css";
import { useProvideChipColors } from "../../task-list/useProvideChipColors";

export const Project: React.FC<TaskItemProps> = ({ task /* isSelected */ }) => {
  const { resolveChipColor, resolveChipLabelColor } = useProvideChipColors();
  /* const barColor = isSelected
    ? task.styles.backgroundSelectedColor
    : task.styles.backgroundColor;
  /*   const processColor = isSelected
    ? task.styles.progressSelectedColor
    : task.styles.progressColor; */
  const projectWith = task.x2 - task.x1;

  /*   const projectLeftTriangle = [
    task.x1,
    task.y + task.height / 2 - 1,
    task.x1,
    task.y + task.height,
    task.x1 + 15,
    task.y + task.height / 2 - 1,
  ].join(",");
  const projectRightTriangle = [
    task.x2,
    task.y + task.height / 2 - 1,
    task.x2,
    task.y + task.height,
    task.x2 - 15,
    task.y + task.height / 2 - 1,
  ].join(",");
 */
  return (
    <g tabIndex={0} className={styles.projectWrapper}>
      <rect
        fill={resolveChipColor(task.color, "test")} //COLOR OF !PROGRESS
        x={task.x1}
        width={projectWith}
        y={task.y}
        height={10}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className={styles.projectBackground}
      />
      <rect
        x={task.progressX}
        width={task.progressWidth}
        y={task.y}
        height={10}
        ry={task.barCornerRadius}
        rx={task.barCornerRadius}
        fill={resolveChipLabelColor(task.color, "test")} //COLOR OF PROGRESS
      />
      {/* <rect
        fill={barColor}
        x={task.x1}
        width={projectWith}
        y={task.y}
        height={task.height / 2}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className={styles.projectTop}
      /> */}
      {/* <polygon
        className={styles.projectTop}
        points={projectLeftTriangle}
        fill={barColor}
      />
      <polygon
        className={styles.projectTop}
        points={projectRightTriangle}
        fill={barColor}
      /> */}
    </g>
  );
};
