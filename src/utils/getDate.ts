export type DateString = `${string} ${string} ${string} ${string}:${string}:${string}`;
export type ShortDateString = `${string}-${string}-${string}`;

export const getDate = (
  date?: Date | DateString | ShortDateString | number | null
) => {
  let finalDate: Date;

  if (typeof date === "number") {
    finalDate = new Date(date);
  } else if (date instanceof Date) {
    finalDate = new Date(date);
  } else if (typeof date === "string") {
    if (date.length === 19) {
      const [yearStr = "", monthStr = "", dayStr = "", timeStr = ""] = date.split(" ");
      const [hourStr = "0", minStr = "0", secStr = "0"] = timeStr.split(":");
      
      const year = parseInt(yearStr, 10) || 0;
      const month = (parseInt(monthStr, 10) || 1) - 1;
      const day = parseInt(dayStr, 10) || 1;
      const hour = parseInt(hourStr, 10);
      const min = parseInt(minStr, 10);
      const sec = parseInt(secStr, 10);

      finalDate = new Date(year, month, day, hour, min, sec);
    } else if (date.length === 10) {
      const [yearStr = "", monthStr = "", dayStr = ""] = date.split("-");
      const year = parseInt(yearStr, 10) || 0;
      const month = (parseInt(monthStr, 10) || 1) - 1;
      const day = parseInt(dayStr, 10) || 1;
      finalDate = new Date(year, month, day);
    } else {
      finalDate = new Date();
    }
  } else {
    finalDate = new Date();
  }

  const year = finalDate.getFullYear().toString().slice(0, 4);
  const month = (finalDate.getMonth() + 1).toString().padStart(2, "0");
  const day = finalDate.getDate().toString().padStart(2, "0");
  const hour = finalDate.getHours().toString().padStart(2, "0");
  const minute = finalDate.getMinutes().toString().padStart(2, "0");
  const second = finalDate.getSeconds().toString().padStart(2, "0");

  return {
    date: finalDate,
    dateMs: finalDate.getTime(),
    dateString: `${year} ${month} ${day} ${hour}:${minute}:${second}` as DateString,
    shortDateString: `${year}-${month}-${day}` as ShortDateString,
  };
};