import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "./project.module.css";
import { useProvideChipColors } from "../../task-list/useProvideChipColors";
import { HtmlTooltip } from "../bar/bar";

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
    <HtmlTooltip
      followCursor
      title={
        <React.Fragment>
          <div style={{ margin: "auto" }}>
            <div
              style={{
                background: resolveChipColor(task.color, "Title chip"),
                color: resolveChipLabelColor(task.color, "Title chip"),
                padding: "0.5rem 1rem",
                borderRadius: "50px",
                fontWeight: "600",
                fontSize: "12px",
                maxHeight: "30px",
                lineHeight: 1,
                maxWidth: "235px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
              }}
            >
              {task.name}
            </div>
          </div>
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
      <g tabIndex={0} className={styles.projectWrapper}>
        <rect
          fill={resolveChipColor(task.color, "test")} //COLOR OF !PROGRESS
          x={task.x1}
          width={projectWith}
          y={task.y + 7}
          height={5}
          rx={task.barCornerRadius}
          ry={task.barCornerRadius}
          className={styles.projectBackground}
        />
        <rect
          x={task.progressX}
          width={task.progressWidth}
          y={task.y + 7}
          height={5}
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
    </HtmlTooltip>
  );
};
