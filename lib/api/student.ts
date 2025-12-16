import type { StudentInfo } from "@/types/database";

const STUDENT_API_URL =
  process.env.STUDENT_API_URL || "https://project-qol-backend.onrender.com";

// Render free-tier cold starts can exceed 10s; give a bit more headroom.
const REQUEST_TIMEOUT_MS = 20000;
const MAX_RETRIES = 1;

/**
 * Fetch student information from external API
 * @param studentId - Student ID / Card Tag UID
 * @returns Student information object
 * @throws Error if student not found or API error
 */

export async function fetchStudentInfo(
  studentId: string
): Promise<StudentInfo> {
  let attempt = 0;

  while (true) {
    try {
      const response = await fetch(
        `${STUDENT_API_URL}/api/student?id=${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Student not found");
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.card_tag_uid) {
        throw new Error("Invalid student data received");
      }

      return data as StudentInfo;
    } catch (error: unknown) {
      const isTimeout = error instanceof Error && error.name === "TimeoutError";

      if (isTimeout && attempt < MAX_RETRIES) {
        attempt += 1;
        continue;
      }

      if (isTimeout) {
        throw new Error("Student API request timed out");
      }

      throw error;
    }
  }
}

/**
 * Format student name from email
 * @param email - Student email address
 * @returns Formatted name
 */

export function formatStudentName(email: string | undefined): string {
  if (!email) return "Unknown";

  // 1. extract the part before @
  const namePart = email.split("@")[0];

  // 2. split by underscore
  const nameWords = namePart.split("_");

  // 3. capitalize first letter, lowercase the rest
  const formattedName = nameWords
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return formattedName;
}
