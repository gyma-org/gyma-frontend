import React, { useState, useEffect } from "react";
import moment from "jalali-moment";
import styles from "./PersianCalendar.module.css";

interface GymSession {
  id: number;
  date: string;
  price: number;
  start_time: string; // Add this
  end_time: string;
}

interface PersianCalendarProps {
  handleSetDate: (data: { date: string; startTime: string; endTime: string }) => void;
  sessions: GymSession[];
}

const PersianCalendar: React.FC<PersianCalendarProps> = ({ handleSetDate, sessions }) => {
  const [currentDate, setCurrentDate] = useState(moment().locale("fa"));
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  useEffect(() => {
    console.log("Sessions: ", sessions);
  }, [sessions]);

  const convertToJalaliWithIntl = (date: string): string => {
    const d = new Date(date); // Convert string to Date object
    return new Intl.DateTimeFormat("fa-IR").format(d); // Format to Jalali
  };

  const getSessionForDate = (date: string) => {
    const jalaliDate = convertToJalaliWithIntl(date);
    console.log("Searching for session on date: ", jalaliDate);
    const session = sessions.find((session) => {
      const sessionJalaliDate = convertToJalaliWithIntl(session.date);
      return sessionJalaliDate === jalaliDate;
    });
    console.log("Found session: ", session);
    return session;
  };

  const renderCalendar = (date: moment.Moment) => {
    const startOfMonth = date.clone().startOf("jMonth");
    const endOfMonth = date.clone().endOf("jMonth");
    const monthYear = date.format("jMMMM jYYYY");

    const daysGrid: React.ReactNode[] = [];
    const firstDayOfWeek = (startOfMonth.day() + 1) % 7;
    const today = moment().locale("fa"); // Get today's date

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
      const formattedDate = dayMoment.format("YYYY-MM-DD");
      const session = getSessionForDate(formattedDate);

      const isAvailable = !!session;
      const isSelected = selectedDate?.isSame(dayMoment);
      const isBeforeToday = dayMoment.isBefore(today, "day"); // Check if it's before today
      const isToday = dayMoment.isSame(today, "day"); // Check if it's today

      const isDisabled = isBeforeToday || !isAvailable; // Disable if before today or no session

      daysGrid.push(
        <div
          key={day}
          className={styles.dayContainer}>
          <button
            className={`${styles.dayButton} 
              ${isSelected ? styles.selected : ""}
              ${isAvailable ? styles.hasSession : styles.noSession} 
              ${isBeforeToday ? styles.disabled : ""}
              ${isToday ? styles.today : ""}`} // Apply classes conditionally
            onClick={(e) => {
              // Prevent click if disabled
              if (isDisabled) {
                e.preventDefault();
                return;
              }

              // Otherwise, allow the selection
              setSelectedDate(dayMoment);
            }}
            disabled={isDisabled} // Disable the button for unavailable days
            data-session-id={session?.id}>
            <div className={styles.dayNumber}>{day}</div>
            {isAvailable && (
              <div className={styles.price}>{session.price ? Math.floor(session?.price / 1000) : ""}</div>
            )}
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
            setCurrentDate(currentDate.clone().subtract(1, "month"));
          }}>
          ماه قبل
        </button>
        <h3>{monthYear}</h3>
        <button
          onClick={() => {
            setCurrentDate(currentDate.clone().add(1, "month"));
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
            const session = getSessionForDate(selectedDate.format("YYYY-MM-DD"));
            if (session) {
              console.log("Selected Date: ", selectedDate.format("jYYYY/jMM/jDD"));
              console.log("Session Start Time: ", session.start_time); // Corrected property name
              console.log("Session End Time: ", session.end_time); // Corrected property name
              handleSetDate({
                date: selectedDate.format("jYYYY/jMM/jDD"),
                startTime: session.start_time, // Use `start_time`
                endTime: session.end_time, // Use `end_time`
              });
            }
          }
        }}
        disabled={!selectedDate}>
        انتخاب
      </button>
    </div>
  );
};

export default PersianCalendar;
