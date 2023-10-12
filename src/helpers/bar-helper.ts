import { Task } from "../types/public-types";
import { BarTask, TaskTypeInternal } from "../types/bar-task";
import { BarMoveAction } from "../types/gantt-task-actions";

export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
) => {
  let barTasks = tasks.map((t, i) => {
    return convertToBarTask(
      t,
      i,
      dates,
      columnWidth,
      rowHeight,
      taskHeight,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor
    );
  });
  console.log("BARTASKS", barTasks);
  // set dependencies
  barTasks = barTasks.map((task, index) => {
    const dependencies = task.dependencies || [];
    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(
        value => value.id === dependencies[j]
      );
      if (dependence !== -1) {
        barTasks[dependence].barChildren.push(task);

        task.offset = task.x1 - barTasks[index - 1].x2;
      } else {
        task.offset = 0;
      }
    }
    return task;
  });

  return barTasks;
};

const convertToBarTask = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarTask => {
  let barTask: BarTask;
  switch (task.type) {
    case "milestone":
      barTask = convertToMilestone(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      );
      break;
    case "project":
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor
      );
      break;
    default:
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor
      );
      break;
  }
  return barTask;
};

const convertToBar = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string
): BarTask => {
  let x1: number;
  let x2: number;
  if (rtl) {
    x2 = taskXCoordinateRTL(task.start, dates, columnWidth);
    x1 = taskXCoordinateRTL(task.end, dates, columnWidth);
  } else {
    x1 = taskXCoordinate(task.start, dates, columnWidth);
    x2 = taskXCoordinate(task.end, dates, columnWidth);
  }
  let typeInternal: TaskTypeInternal = task.type;
  if (typeInternal === "task" && x2 - x1 < handleWidth * 2) {
    typeInternal = "smalltask";
    x2 = x1 + handleWidth * 2;
  }

  const [progressWidth, progressX] = progressWithByParams(
    x1,
    x2,
    task.progress,
    rtl
  );
  const y = taskYCoordinate(index, rowHeight, taskHeight);
  const hideChildren = task.type === "project" ? task.hideChildren : undefined;

  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...task.styles,
  };
  return {
    ...task,
    typeInternal,
    x1,
    x2,
    y,
    index,
    progressX,
    progressWidth,
    barCornerRadius,
    handleWidth,
    hideChildren,
    height: taskHeight,
    barChildren: [],
    styles,
  };
};

const convertToMilestone = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarTask => {
  const x = taskXCoordinate(task.start, dates, columnWidth);
  const y = taskYCoordinate(index, rowHeight, taskHeight);

  const x1 = x - taskHeight * 0.5;
  const x2 = x + taskHeight * 0.5;

  const rotatedHeight = taskHeight / 1.414;
  const styles = {
    backgroundColor: milestoneBackgroundColor,
    backgroundSelectedColor: milestoneBackgroundSelectedColor,
    progressColor: "",
    progressSelectedColor: "",
    ...task.styles,
  };
  return {
    ...task,
    end: task.start,
    x1,
    x2,
    y,
    index,
    progressX: 0,
    progressWidth: 0,
    barCornerRadius,
    handleWidth,
    typeInternal: task.type,
    progress: 0,
    height: rotatedHeight,
    hideChildren: undefined,
    barChildren: [],
    styles,
  };
};

const taskXCoordinate = (xDate: Date, dates: Date[], columnWidth: number) => {
  const index = dates.findIndex(d => d.getTime() >= xDate.getTime()) - 1;

  const remainderMillis = xDate.getTime() - dates[index].getTime();
  const percentOfInterval =
    remainderMillis / (dates[index + 1].getTime() - dates[index].getTime());
  const x = index * columnWidth + percentOfInterval * columnWidth;
  return x;
};
const taskXCoordinateRTL = (
  xDate: Date,
  dates: Date[],
  columnWidth: number
) => {
  let x = taskXCoordinate(xDate, dates, columnWidth);
  x += columnWidth;
  return x;
};
const taskYCoordinate = (
  index: number,
  rowHeight: number,
  taskHeight: number
) => {
  const y = index * rowHeight + (rowHeight - taskHeight) / 2;
  return y;
};

export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number,
  rtl: boolean
) => {
  const progressWidth = (taskX2 - taskX1) * progress * 0.01;
  let progressX: number;
  if (rtl) {
    progressX = taskX2 - progressWidth;
  } else {
    progressX = taskX1;
  }
  return [progressWidth, progressX];
};

export const progressByProgressWidth = (
  progressWidth: number,
  barTask: BarTask
) => {
  const barWidth = barTask.x2 - barTask.x1;
  const progressPercent = Math.round((progressWidth * 100) / barWidth);
  if (progressPercent >= 100) return 100;
  else if (progressPercent <= 0) return 0;
  else return progressPercent;
};

const progressByX = (x: number, task: BarTask) => {
  if (x >= task.x2) return 100;
  else if (x <= task.x1) return 0;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((x - task.x1) * 100) / barWidth);
    return progressPercent;
  }
};
const progressByXRTL = (x: number, task: BarTask) => {
  if (x >= task.x2) return 0;
  else if (x <= task.x1) return 100;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((task.x2 - x) * 100) / barWidth);
    return progressPercent;
  }
};

export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ];
  return point.join(",");
};

const startByX = (x: number, xStep: number, task: BarTask) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x1 + additionalXValue;
  return newX;
};

const endByX = (x: number, xStep: number, task: BarTask) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x2 + additionalXValue;
  return newX;
};

const moveByX = (x: number, xStep: number, task: BarTask) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  console.log("TASK MOVEX", task.id, newX1, newX2);
  return [newX1, newX2];
};

const moveByXForEach = (
  x: number,
  xStep: number,
  task: BarTask,
  index: number
) => {
  const taskOffset = task.offset || 0;
  console.log("OFFSET MOVE", task.offset);
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1Test =
    index === 0 ? task.x1 + additionalXValue : task.x1 + taskOffset;
  const newX2Test = newX1Test + task.x2 - task.x1;
  console.log("TASK MOVEX", task.id, newX1Test, newX2Test);
  return { newX1Test, newX2Test };
};

const dateByX = (
  x: number,
  taskX: number,
  taskDate: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime());
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  );
  return newDate;
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  tasks: BarTask[],
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask; changedTasks: BarTask[] } => {
  let result: {
    isChanged: boolean;
    changedTask: BarTask;
    changedTasks: BarTask[];
  };
  switch (selectedTask.type) {
    case "milestone":
      result = handleTaskBySVGMouseEventForMilestone(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      break;
    default:
      console.log("MOVING");
      result = handleTaskBySVGMouseEventForBar(
        svgX,
        action,
        selectedTask,
        tasks,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      break;
  }
  return result;
};

const handleTaskBySVGMouseEventForBar = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  tasks: BarTask[],
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask; changedTasks: BarTask[] } => {
  const changedTasks: BarTask[] = [];
  const changedTask: BarTask = { ...selectedTask };
  let isChanged = false;
  //getAllBarChildrens

  console.log(tasks);
  switch (action) {
    case "progress":
      if (rtl) {
        changedTask.progress = progressByXRTL(svgX, selectedTask);
      } else {
        changedTask.progress = progressByX(svgX, selectedTask);
      }
      isChanged = changedTask.progress !== selectedTask.progress;
      if (isChanged) {
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    case "start": {
      const newX1 = startByX(svgX, xStep, selectedTask);
      changedTask.x1 = newX1;
      isChanged = changedTask.x1 !== selectedTask.x1;
      if (isChanged) {
        if (rtl) {
          changedTask.end = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.end,
            xStep,
            timeStep
          );
        } else {
          changedTask.start = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.start,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
    case "end": {
      const newX2 = endByX(svgX, xStep, selectedTask);
      changedTask.x2 = newX2;
      isChanged = changedTask.x2 !== selectedTask.x2;
      if (isChanged) {
        if (rtl) {
          console.log("RTL");
          changedTask.start = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.start,
            xStep,
            timeStep
          );
        } else {
          console.log("LTR");
          changedTask.end = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.end,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
    case "move": {
      /* console.log("MOVING 2");
      console.log(changedTask);
      console.log("BAR CHILDRENS", childrens); */
      //console.log("BAR CHILDRENS NEW", getAllBarChildren(changedTask));
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      console.log("MOVEX SELECTED", newMoveX1, newMoveX2);
      isChanged = newMoveX1 !== selectedTask.x1;
      console.log("SELECTED T", selectedTask.x1);
      if (isChanged) {
        if (changedTask.barChildren.length !== 0) {
          /* const moveByX = (x: number, xStep: number, task: BarTask) => {
            const steps = Math.round((x - task.x1) / xStep);
            const additionalXValue = steps * xStep;
            const newX1 = task.x1 + additionalXValue;
            const newX2 = newX1 + task.x2 - task.x1;
            return [newX1, newX2];
          }; */

          const childrenIds = getAllBarChildrenIds(changedTask);

          console.log(childrenIds);
          console.log(tasks);
          //console.log("RTL", rtl);
          tasks.forEach((task, index) => {
            if (childrenIds.includes(task.id)) {
              //const offset = task.x1 - tasks[index - 1].x2;
              //console.log("OFFSET", offset);
              const { newX1Test, newX2Test } = moveByXForEach(
                svgX - initEventX1Delta,
                xStep,
                task,
                index
                /* changedTask.x2 - selectedTask.x1 */
              );
              console.log("TESTING", task);
              console.log("MOVEX", newX1Test, newX2Test);
              //const taskOffset = task.offset || 0;
              task.start = dateByX(
                newX1Test,
                task.x1,
                task.start,
                xStep,
                timeStep
              );
              task.end = dateByX(newX2Test, task.x2, task.end, xStep, timeStep);
              task.x1 = newX1Test + (selectedTask.x1 - changedTask.x1);
              task.x2 = newX2Test + (selectedTask.x2 - changedTask.x2);
              const [progressWidth, progressX] = progressWithByParams(
                task.x1,
                task.x2,
                task.progress,
                rtl
              );
              task.progressWidth = progressWidth;
              task.progressX = progressX;
              changedTasks.push(task);
            } else {
              changedTasks.push(task);
            }
          });
          console.log("UPDATED TASKS", changedTasks);
          /*  const updateAllChildren = (task: BarTask) => {
            const offset = changedTask.x1 - selectedTask.x1;
            task.barChildren.forEach(taskToUpdate => {
              const [newMoveX1, newMoveX2] = moveByX(
                svgX - initEventX1Delta + offset,
                xStep,
                taskToUpdate
              );
              taskToUpdate.start = dateByX(
                newMoveX1,
                selectedTask.x1 + offset,
                taskToUpdate.start,
                xStep,
                timeStep
              );
              taskToUpdate.end = dateByX(
                newMoveX2,
                selectedTask.x2 + offset,
                taskToUpdate.end,
                xStep,
                timeStep
              );
              taskToUpdate.x1 = newMoveX1;
              taskToUpdate.x2 = newMoveX2;
              const [progressWidth, progressX] = progressWithByParams(
                taskToUpdate.x1,
                taskToUpdate.x2,
                taskToUpdate.progress,
                rtl
              );
              taskToUpdate.progressWidth = progressWidth;
              taskToUpdate.progressX = progressX;

              if (taskToUpdate.barChildren.length !== 0)
                updateAllChildren(taskToUpdate);
              return;
            });
          };
          updateAllChildren(changedTask); */
        } else {
          console.log("OKIDA SE");
          changedTask.start = dateByX(
            newMoveX1,
            selectedTask.x1,
            selectedTask.start,
            xStep,
            timeStep
          );
          changedTask.end = dateByX(
            newMoveX2,
            selectedTask.x2,
            selectedTask.end,
            xStep,
            timeStep
          );
          changedTask.x1 = newMoveX1;
          changedTask.x2 = newMoveX2;
          const [progressWidth, progressX] = progressWithByParams(
            changedTask.x1,
            changedTask.x2,
            changedTask.progress,
            rtl
          );
          changedTask.progressWidth = progressWidth;
          changedTask.progressX = progressX;
        }

        /* if(changedTask.barChildren.length !== 0) {

        } */
      }
      break;
    }
  }
  return { isChanged, changedTask, changedTasks };
};

const handleTaskBySVGMouseEventForMilestone = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; changedTask: BarTask; changedTasks: BarTask[] } => {
  const changedTasks: BarTask[] = [];
  const changedTask: BarTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "move": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
        changedTask.end = changedTask.start;
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
      }
      break;
    }
  }
  return { isChanged, changedTask, changedTasks };
};

/* function getAllBarChildren(obj: BarTask | undefined) {
  let barChildrenList: BarTask[] = [];

  if (obj && obj.barChildren && obj.barChildren.length > 0) {
    barChildrenList = barChildrenList.concat(obj.barChildren);
    obj.barChildren.forEach(child => {
      barChildrenList = barChildrenList.concat(getAllBarChildren(child));
    });
  }

  return barChildrenList;
} */

function getAllBarChildrenIds(obj: BarTask) {
  let ids: string[] = [];
  if (!ids.includes(obj.id)) {
    ids.push(obj.id);
  }

  if (obj.barChildren && obj.barChildren.length > 0) {
    for (const child of obj.barChildren) {
      ids.push(child.id);
      ids = ids.concat(getAllBarChildrenIds(child));
    }
  }

  return ids;
}

/* const updateAllChildrenPositions = (task: BarTask) => {};
 */
