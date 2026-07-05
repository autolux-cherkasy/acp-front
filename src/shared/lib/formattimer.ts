export function formatTimer(seconds: number | null): string {
    if (seconds === null || seconds <= 0) {
        return "00:00:00";
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const time = [hours, minutes, secs]
        .map((v) => String(v).padStart(2, "0"))
        .join(":");

    return days > 0 ? `${days}д ${time}` : time;
}