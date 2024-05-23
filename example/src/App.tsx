import React from "react";
import { Task, ViewMode, Gantt, OnRelationChange } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject } from "./helper";
import "gantt-task-react/dist/index.css";
import { BarTask } from "../../dist/types/bar-task";

const currentDate = new Date();
const data: Task[] = [
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    name: "Some Project",
    id: "ProjectSample",
    progress: 25,
    type: "project",
    hideChildren: false,
    displayOrder: 1,
    color: "blue",
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
    name: "Idea",
    id: "Task 0",
    progress: 45,
    type: "task",
    project: "ProjectSample",
    displayOrder: 2,
    color: "blue",
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
    name: "Research",
    id: "Task 1",
    progress: 25,
    dependencies: ["Task 0"],
    type: "task",
    project: "ProjectSample",
    displayOrder: 3,
    color: "blue",
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
    name: "Discussion with team",
    id: "Task 2",
    progress: 10,
    dependencies: ["Task 1"],
    type: "task",
    project: "ProjectSample",
    displayOrder: 4,
    color: "blue",
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
    name: "Developing",
    id: "Task 3",
    progress: 2,
    dependencies: ["Task 2"],
    type: "task",
    project: "ProjectSample",
    displayOrder: 5,
    color: "blue",
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
    name: "Review",
    id: "Task 4",
    type: "task",
    progress: 70,
    dependencies: ["Task 2"],
    project: "ProjectSample",
    displayOrder: 6,
    color: "blue",
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    name: "Release",
    id: "Task 6",
    progress: currentDate.getMonth(),
    type: "milestone",
    dependencies: ["Task 4"],
    project: "ProjectSample",
    displayOrder: 7,
    color: "blue",
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    name: "Party Time",
    id: "Task 9",
    progress: 0,
    isDisabled: true,
    type: "task",
    color: "red",
  },
  /*     {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    name: "Some Project 2",
    id: "ProjectSample1",
    progress: 25,
    type: "project",
    hideChildren: false,
    displayOrder: 8,
  },
  {
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    name: "Release 5",
    id: "6",
    progress: currentDate.getMonth(),
    type: "milestone",
    dependencies: ["4"],
    project: "ProjectSample1",
    displayOrder: 9,
  }, */
];

// Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(data);
  const [isChecked, setIsChecked] = React.useState(true);
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }
  console.log("TASKS APP", tasks);
  const handleTaskChange = (task: Task, children: BarTask[]) => {
    const prevTaskState = tasks.filter(t => t.id === task.id)[0];
    const prevStart: Date = new Date(prevTaskState.start);
    const newStart: Date = new Date(task.start);
    const difference: number = newStart.getTime() - prevStart.getTime();
    const dayDiff: number = difference / (1000 * 60 * 60 * 24);

    console.log("DAYDIFF", Math.round(dayDiff), task.id);

    let updatedTask = tasks.map(t => (t.id === task.id ? task : t));

    const changedTaskData = getAllChildrenInfo(children);
    changedTaskData[task.id] = { start: task.start, end: task.end };

    let updatedGroupTask = tasks.map(t => {
      if (changedTaskData.hasOwnProperty(t.id)) {
        t.start = changedTaskData[t.id].start;
        t.end = changedTaskData[t.id].end;
      }
      return t;
    });

    let newTasks = changedTaskData ? updatedGroupTask : updatedTask;
    /* newTasks =  */
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }

    setTasks(newTasks);
  };

  const handleRelationChange: OnRelationChange = (
    [taskFrom, targetFrom],
    [taskTo]
  ) => {
    setTasks(
      tasks.map(t => {
        //If user connects arrow with project => return
        if (taskTo.type === "project") return t;

        if (targetFrom === "startOfTask") {
          if (t.id === taskFrom.id) {
            if (!t.dependencies) {
              return {
                ...t,
                dependencies: [taskTo.id],
              };
            }

            const hasDependency = t.dependencies.some(
              dependencyId => dependencyId === taskTo.id
            );

            if (hasDependency) {
              return {
                ...t,
                dependencies: t.dependencies.filter(
                  dependencyId => dependencyId !== taskTo.id
                ),
              };
            }

            return {
              ...t,
              dependencies: [...t.dependencies, taskTo.id],
            };
          }
        }

        if (targetFrom === "endOfTask") {
          if (t.id === taskTo.id) {
            if (!t.dependencies) {
              return {
                ...t,
                dependencies: [taskFrom.id],
              };
            }

            const hasDependency = t.dependencies.some(
              dependencyId => dependencyId === taskFrom.id
            );

            if (hasDependency) {
              return {
                ...t,
                dependencies: t.dependencies.filter(
                  dependencyId => dependencyId !== taskFrom.id
                ),
              };
            }

            return {
              ...t,
              dependencies: [...t.dependencies, taskFrom.id],
            };
          }
        }

        return t;
      })
    );
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));

    console.log("On expander click Id:" + task.id);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <h3>Gantt With Unlimited Height</h3>
      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onRelationChange={handleRelationChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
        rowHeight={32}
      />
      <h3>Gantt With Limited Height</h3>
      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onRelationChange={handleRelationChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        columnWidth={columnWidth}
      />
    </div>
  );
};

export default App;

function getAllChildrenInfo(tasks: BarTask[]) {
  return tasks.reduce((result, task) => {
    if (task.barChildren && task.barChildren.length > 0) {
      const childrenInfo = getAllChildrenInfo(task.barChildren);
      Object.assign(result, childrenInfo);
    }
    result[task.id] = { start: task.start, end: task.end };
    return result;
  }, {});
}
