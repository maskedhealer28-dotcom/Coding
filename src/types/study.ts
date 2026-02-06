export type AppMode = 'new' | 'archive' | 'trash';

export type Subject = {
  id: string;
  name: string;
  color: string;
};

export type StudyEvent = {
  id: string;
  subjectId: string;
  chapterTitle: string;
  date: string;
  reviewIndex: number;
  completed: boolean;
  deleted: boolean;
  wasCompletedBeforeDelete: boolean;
};

export type AppState = {
  subjects: Subject[];
  events: StudyEvent[];
  uiPreferences: {
    theme: 'light' | 'dark';
    lastSelectedDate: string;
    lastMode: AppMode;
  };
};
