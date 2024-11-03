export function validateTimeRanges(backtestStartTime: number, backtestEndTime: number, forwardTestEndTime: number): void {
  if (backtestStartTime >= backtestEndTime || backtestEndTime >= forwardTestEndTime) {
    throw new Error(
      'Backtest startTime should be < endTime should be < forwardEnd'
    );
  }
}