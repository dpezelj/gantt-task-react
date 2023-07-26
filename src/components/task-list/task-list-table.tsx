import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useProvideChipColors } from "./useProvideChipColors";

const localeDateStringCache = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }
    return lds;
  };

function formatDate(inputDate: string) {
  const dateObject = new Date(inputDate);
  /* const options = { day: '2-digit', month: '2-digit', year: 'numeric' }; */
  return dateObject.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
}
const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
}) => {
  const { resolveChipColor, resolveChipLabelColor } = useProvideChipColors();
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        let expanderSymbol = null;
        if (t.hideChildren === false) {
          expanderSymbol = <ExpandMoreIcon />;
        } else if (t.hideChildren === true) {
          expanderSymbol = <ChevronRightIcon /> /* "▶" */;
        }

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: "270px",
                maxWidth: rowWidth,
              }}
              title={t.name}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                {t.type === "project" ? (
                  <div style={{ margin: "auto" }}>
                    <div
                      style={{
                        background: resolveChipColor(t.color, "Title chip"),
                        color: resolveChipLabelColor(t.color, "Title chip"),
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
                      }}
                    >
                      {t.name}
                    </div>
                  </div>
                ) : (
                  <div style={{ margin: "auto", fontSize: "12px" }}>
                    {t.name}
                  </div>
                )}
              </div>
            </div>
            {/*             <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{formatDate(toLocaleDateString(t.start, dateTimeOptions))}
            </div> */}
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
                width: "67%",
                textAlign: "center",
                color: "#747474",
                fontSize: "12px",
              }}
            >
              &nbsp;
              {`${formatDate(toLocaleDateString(t.start, dateTimeOptions))
                .split("/")
                .join(".")} - ${formatDate(
                toLocaleDateString(t.end, dateTimeOptions)
              )
                .split("/")
                .join(".")}`}
              {/* &nbsp;{formatDate(toLocaleDateString(t.end, dateTimeOptions))} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
