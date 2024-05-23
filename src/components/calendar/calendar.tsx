import React, { ReactChild } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
}) => {
  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear();
      bottomValues.push(
        <text
          key={date.getFullYear()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  function getWeekNumber(d: Date): number {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    // Return array of year and week number
    return weekNo;
  }

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = getLocaleMonth(date, locale);
      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;
      }
      // bottom
      const bottomValue = `WH ${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues = [];
    const bottomValues = [];
    const middleValues = [];

    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const weekNumber = getWeekNumber(date);
      const middleValue = `WH ${weekNumber}`;
      /* const bottomValue = `${getLocalDayOfWeek(date, locale, "short")}, ${date
        .getDate()
        .toString()}`; */

      if (date.getDay() === 1) {
        middleValues.push(
          <text
            key={date.getTime() + "middle"}
            y={headerHeight * 0.65} // Adjust the y value as needed
            x={columnWidth * i + columnWidth * 0.55}
            className={styles.calendarMiddleText} // Add a new style for the middle text
          >
            {middleValue}
          </text>
        );
      }

      const bottomValue = date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
      });

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.9}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue.split("/").join(".")}
          {/* added split join */}
        </text>
      );
      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const topValue = `${getLocaleMonth(
          date,
          locale
        ).toUpperCase()}, ${date.getFullYear()}`;

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) *
                columnWidth *
                0.5
            }
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues, middleValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          date,
          locale,
          "short"
        )}, ${date.getDate()} ${getLocaleMonth(date, locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          locale,
          "long"
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  let middleValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues, middleValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }
  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className={styles.calendarHeader}
      />
      {bottomValues} {middleValues} {topValues}
    </g>
  );
};
