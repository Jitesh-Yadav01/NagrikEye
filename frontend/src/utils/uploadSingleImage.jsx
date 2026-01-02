import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase"

export async function uploadSingleImage(file, userId) {
  if (!file) return null;

  const imageRef = ref(
    storage,
    `reports/${userId}/${Date.now()}-${file.name}`
  );

  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}
