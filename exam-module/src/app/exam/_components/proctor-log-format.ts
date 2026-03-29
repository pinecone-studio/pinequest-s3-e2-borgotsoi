export function formatLogTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getEventLabel(eventType: string) {
  const type = eventType.toLowerCase();

  if (type.includes("human_speech")) return "Бусадтай ярьсан";
  if (type.includes("tab_change")) return "Цонх солих гэж оролдсон";
  if (type.includes("no_face_detected")) return "Сурагч харагдахгүй байна";
  if (
    type.includes("camera_off") ||
    type.includes("camera_disabled") ||
    type.includes("camera_lost")
  )
    return "Камер унтраасан";

  return eventType;
}

export function getEventIcon(eventType: string) {
  const type = eventType.toLowerCase();

  if (type.includes("human_speech")) return "🎤";
  if (type.includes("tab_change")) return "↗";
  if (
    type.includes("camera_off") ||
    type.includes("camera_disabled") ||
    type.includes("camera_lost") ||
    type.includes("no_face_detected")
  )
    return "📷";

  return "•";
}

export function getStudentShort(studentId: string) {
  if (!studentId) return "—";
  return `ID ${studentId.slice(0, 8)}`;
}
