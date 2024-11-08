import React, { useState } from "react";
import moment from "jalali-moment";
import styles from "./PersianCalendar.module.css";

const PersianCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(moment().locale("fa"));
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  const renderCalendar = (date: moment.Moment) => {
    const startOfMonth = date.clone().startOf("jMonth");
    const endOfMonth = date.clone().endOf("jMonth");
    const monthYear = date.format("jMMMM jYYYY");

    const daysGrid: React.ReactNode[] = [];

    const firstDayOfWeek = (startOfMonth.day() + 1) % 7;

    for (let i = 0; i < firstDayOfWeek; i++) {
      daysGrid.push(
        <div
          key={`empty-${i}`}
          className={styles.emptyCell}
        />
      );
    }

    for (let day = 1; day <= endOfMonth.jDate(); day++) {
      const dayMoment = moment(date).jDate(day);
      daysGrid.push(
        <div
          key={day}
          className={styles.dayContainer}>
          <button
            className={`${styles.dayButton} ${selectedDate?.isSame(dayMoment) ? styles.selected : ""}`}
            onClick={() => {
              setSelectedDate(dayMoment);
            }}>
            <div className={styles.dayNumber}>{day}</div>
            <div className={styles.price}>120</div>
          </button>
        </div>
      );
    }

    return { monthYear, daysGrid };
  };

  const { monthYear, daysGrid } = renderCalendar(currentDate);

  return (
    <div
      dir="rtl"
      className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button
          onClick={() => {
            setCurrentDate(currentDate.clone().subtract(1, "jMonth"));
            setSelectedDate(null);
          }}>
          ماه قبل
        </button>
        <h3>{monthYear}</h3>
        <button
          onClick={() => {
            setCurrentDate(currentDate.clone().add(1, "jMonth"));
            setSelectedDate(null);
          }}>
          ماه بعد
        </button>
      </div>

      <div className={styles.daysOfWeek}>
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      <div className={styles.daysGrid}>{daysGrid}</div>

      <button
        className={styles.reserveButton}
        onClick={() => {
          if (selectedDate) {
            alert(
              `You reserved: ${selectedDate.jYear()}/${selectedDate.jMonth() + 1}/${selectedDate.jDate()}`
            );
          }
        }}
        disabled={!selectedDate}>
        رزرو
      </button>
    </div>
  );
};

export default PersianCalendar;
