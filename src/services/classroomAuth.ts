/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse existing Firebase app instance if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Classroom Scopes
export const CLASSROOM_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
  'https://www.googleapis.com/auth/classroom.announcements.readonly',
  'https://www.googleapis.com/auth/classroom.topics.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
];

const provider = new GoogleAuthProvider();
for (const scope of CLASSROOM_SCOPES) {
  provider.addScope(scope);
}

// In-memory token storage (NEVER stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  alternateLink?: string;
  courseState?: string;
}

export interface ClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state?: string;
  alternateLink?: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  dueTime?: {
    hours: number;
    minutes: number;
  };
  maxPoints?: number;
  workType?: string;
}

export const initClassroomAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogleClassroom = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan access token Google Classroom.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Classroom sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getClassroomAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const signOutGoogleClassroom = async () => {
  await firebaseSignOut(auth);
  cachedAccessToken = null;
};

/**
 * Fetches active courses from Google Classroom API
 */
export async function fetchClassroomCourses(token: string): Promise<ClassroomCourse[]> {
  try {
    const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        cachedAccessToken = null;
        throw new Error('Sesi Google Classroom telah kedaluwarsa. Silakan masuk kembali.');
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal memuat kelas Google Classroom.');
    }

    const data = await res.json();
    return data.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

/**
 * Fetches assignments / coursework for a specific course
 */
export async function fetchCourseWork(
  courseId: string,
  token: string
): Promise<ClassroomCourseWork[]> {
  try {
    const res = await fetch(
      `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/courseWork`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal memuat tugas kelas.');
    }

    const data = await res.json();
    return data.courseWork || [];
  } catch (error) {
    console.error('Error fetching course work:', error);
    throw error;
  }
}
