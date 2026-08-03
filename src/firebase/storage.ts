import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a file to Firebase Storage and returns its public download URL.
 * @param file      The File object to upload
 * @param path      Storage path, e.g. "projects/image.png" or "documents/resume.pdf"
 * @param onProgress  Optional callback with upload progress 0–100
 */
export const uploadFile = (
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string> =>
  new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(pct);
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });

/**
 * Deletes a file from Firebase Storage by its download URL.
 * Silently ignores "not found" errors.
 */
export const deleteFileByUrl = async (url: string): Promise<void> => {
  if (!url || url === "#" || !url.includes("firebasestorage")) return;
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err: any) {
    if (err?.code !== "storage/object-not-found") {
      console.warn("Could not delete file:", err);
    }
  }
};
