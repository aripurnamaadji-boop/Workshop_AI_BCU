function splitUsername(username: string): string[] {
  return username.replace(/[._-]+/g, " ").trim().split(/\s+/);
}

export function initialsOf(username: string): string {
  const parts = splitUsername(username);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function lastNameOf(username: string): string {
  const parts = splitUsername(username);
  const last = parts[parts.length - 1] || username;
  return last.charAt(0).toUpperCase() + last.slice(1);
}
