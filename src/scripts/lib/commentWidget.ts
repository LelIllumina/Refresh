import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export interface CommentData {
  id: string;
  parentId?: string;
  username: string;
  website?: string;
  content: string;
  createdAt?: { toDate?: () => Date };
  replies: CommentData[];
}

export async function postComment(
  username: string,
  content: string,
  slug: string,
  parentId?: string,
  website?: string,
) {
  if (!username.trim() || !content.trim()) throw new Error("Invalid input");

  const data: {
    username: string;
    content: string;
    slug: string;
    createdAt: ReturnType<typeof serverTimestamp>;
    replyTo?: string;
    website?: string;
  } = {
    username,
    content,
    slug,
    createdAt: serverTimestamp(),
  };
  if (parentId) data.replyTo = parentId;
  if (website) data.website = website;

  await addDoc(collection(db, "comments"), data);
}

export async function loadComments(slug: string): Promise<CommentData[]> {
  const q = query(
    collection(db, "comments"),
    where("slug", "==", slug),
    orderBy("createdAt", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      parentId: data.replyTo ?? undefined,
      username: data.username ?? "",
      website: data.website ?? undefined,
      content: data.content ?? "",
      createdAt: data.createdAt,
      replies: [],
    } as CommentData;
  });
}
