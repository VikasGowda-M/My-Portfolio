import {
  doc as fsDoc,
  collection,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import type { Profile, Project, Document, BlogPost } from "../app/data";
import {
  defaultProfile,
  defaultProjects,
  defaultDocuments,
  defaultBlogPosts,
} from "../app/data";

const noop = () => {};

// ─── Profile ────────────────────────────────────────────────────────────────

export const subscribeToProfile = (
  callback: (profile: Profile) => void,
  onError?: (err: Error) => void
) => {
  if (!isFirebaseConfigured) { callback(defaultProfile); return noop; }
  return onSnapshot(
    fsDoc(db, "portfolio", "profile"),
    (snap) => callback(snap.exists() ? (snap.data() as Profile) : defaultProfile),
    onError
  );
};

export const saveProfile = async (profile: Profile): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await setDoc(fsDoc(db, "portfolio", "profile"), profile);
};

// ─── Projects ───────────────────────────────────────────────────────────────

export const subscribeToProjects = (
  callback: (projects: Project[]) => void,
  onError?: (err: Error) => void
) => {
  if (!isFirebaseConfigured) { callback(defaultProjects); return noop; }
  return onSnapshot(
    collection(db, "projects"),
    (snap) => {
      const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
      callback(projects);
    },
    onError
  );
};

export const upsertProject = async (project: Project): Promise<void> => {
  if (!isFirebaseConfigured) return;
  const { id, ...data } = project;
  if (id) {
    await setDoc(fsDoc(db, "projects", id), data, { merge: true });
  } else {
    await addDoc(collection(db, "projects"), data);
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await deleteDoc(fsDoc(db, "projects", id));
};

// ─── Documents ──────────────────────────────────────────────────────────────

export const subscribeToDocuments = (
  callback: (docs: Document[]) => void,
  onError?: (err: Error) => void
) => {
  if (!isFirebaseConfigured) { callback(defaultDocuments); return noop; }
  return onSnapshot(
    collection(db, "documents"),
    (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Document));
      callback(docs);
    },
    onError
  );
};

export const addDocument = async (doc: Omit<Document, "id">): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await addDoc(collection(db, "documents"), doc);
};

export const deleteDocument = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await deleteDoc(fsDoc(db, "documents", id));
};

// ─── Blog Posts ─────────────────────────────────────────────────────────────

export const subscribeToBlogPosts = (
  callback: (posts: BlogPost[]) => void,
  onError?: (err: Error) => void
) => {
  if (!isFirebaseConfigured) { callback(defaultBlogPosts); return noop; }
  return onSnapshot(
    collection(db, "blogs"),
    (snap) => {
      const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));
      callback(posts);
    },
    onError
  );
};

export const upsertBlogPost = async (post: BlogPost): Promise<void> => {
  if (!isFirebaseConfigured) return;
  const { id, ...data } = post;
  if (id) {
    await setDoc(fsDoc(db, "blogs", id), data, { merge: true });
  } else {
    await addDoc(collection(db, "blogs"), data);
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await deleteDoc(fsDoc(db, "blogs", id));
};

// ─── Seed default data (runs once on first launch) ──────────────────────────

export const seedDefaultData = async (): Promise<void> => {
  if (!isFirebaseConfigured) return;
  const profileRef = fsDoc(db, "portfolio", "profile");
  const profileSnap = await getDoc(profileRef);
  if (profileSnap.exists()) return;

  try {
    await setDoc(profileRef, defaultProfile);

    for (const project of defaultProjects) {
      const { id, ...data } = project;
      await setDoc(fsDoc(db, "projects", id), data);
    }

    for (const document of defaultDocuments) {
      const { id, ...data } = document;
      await setDoc(fsDoc(db, "documents", id), data);
    }

    for (const post of defaultBlogPosts) {
      const { id, ...data } = post;
      await setDoc(fsDoc(db, "blogs", id), data);
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};
