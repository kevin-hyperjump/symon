import Storage from "../utils/storage";

export function logout(): void {
  const storage = new Storage();

  storage.del("at");
  storage.del("rt");
  window.location.reload();
}
