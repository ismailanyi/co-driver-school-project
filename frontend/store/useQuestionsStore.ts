import api from "@/lib/api";
import { useEffect } from "react";
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Question {
  id: number | string;
  category?: string;
  question: string;
  image_url?: string;
  correct_ans?: string[];
  wrong_ans?: string[];
  hint?: string;
}

import { useCourseStore } from '@/store/useCourseStore';
import { useLessonsStore } from '@/store/useLessonsStore';
import { useAuthStore } from '@/store/useAuthStore';

// State shape for a single endpoint/quiz type
interface QuizState {
  selectedId: number | string | null;
  questions: any[];
  allQuestions: any[];
  targetQuestion: Question | null;
  isCorrect: boolean | null | undefined;
  isSubmitted: boolean;
  isLoading: boolean;
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  startTime: number | null;
  endTime: number | null;
  currentCategory?: string;
  attempts: any[];
  questionStartTime: number | null;
}

// Structure to support multiple distinct endpoints simultaneously
interface QuestionsStoreProps {
  quizStates: Record<string, QuizState>;
  // Global actions
  setSelectedId: (endpoint: string, id: number | string | null) => void;
  setIsCorrect: (endpoint: string, isCorrect: boolean | null | undefined) => void;
  setIsSubmitted: (endpoint: string, isSubmitted: boolean) => void;
  fetchQuestion: (endpoint: string, category?: string) => Promise<void>;
  handleSubmit: (endpoint: string, category?: string) => void;
  saveQuizResult: (endpoint: string, category: string, correctCount: number, totalQuestions: number, timeSeconds: number | null, attempts: any[]) => Promise<void>;
  startTimer: (endpoint: string) => void;
  stopTimer: (endpoint: string) => void;
}

// Initial default state template for any new endpoint
const initialQuizState: QuizState = {
  selectedId: null,
  questions: [],
  allQuestions: [],
  targetQuestion: null,
  isCorrect: false,
  isSubmitted: false,
  isLoading: false,
  answeredCount: 0,
  totalQuestions: 0,
  correctCount: 0,
  startTime: null,
  endTime: null,
  currentCategory: undefined,
  attempts: [],
  questionStartTime: null,
};

const useQuestionsStore = create<QuestionsStoreProps>()(
  devtools((set, get) => ({
    quizStates: {},

    setSelectedId: (endpoint, id) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), selectedId: id }
      }
    })),

    setIsCorrect: (endpoint, isCorrect) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), isCorrect }
      }
    })),

    setIsSubmitted: (endpoint, isSubmitted) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), isSubmitted }
      }
    })),

    startTimer: (endpoint) => set((state) => {
      const currentState = state.quizStates[endpoint] || initialQuizState;
      if (currentState.startTime) return state; // Already started
      return {
        quizStates: {
          ...state.quizStates,
          [endpoint]: { ...currentState, startTime: Date.now() }
        }
      }
    }),

    stopTimer: (endpoint) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), endTime: Date.now() }
      }
    })),

    fetchQuestion: async (endpoint: string, category?: string) => {
      const currentQuizState = get().quizStates[endpoint] || initialQuizState;
      const isNewCategory = currentQuizState.currentCategory !== category;
      
      set((state) => ({
        quizStates: {
          ...state.quizStates,
          [endpoint]: { 
            ...(state.quizStates[endpoint] || initialQuizState), 
            isLoading: true, 
            ...(isNewCategory ? { 
                answeredCount: 0, 
                totalQuestions: 0, 
                correctCount: 0, 
                startTime: Date.now(), 
                endTime: null, 
                currentCategory: category,
                allQuestions: [],
                attempts: [],
            } : {}) 
          }
        }
      }));

      try {
        let fetchedSigns = get().quizStates[endpoint]?.allQuestions || [];
        
        if (isNewCategory || fetchedSigns.length === 0) {
          
          let url = `/quiz/${endpoint}`;
          if (category) {
            url += `?category=${encodeURIComponent(category)}`;
          }
          
          const response = await api.get(url);
          fetchedSigns = response.data;
        }

        const { courseProgress } = useCourseStore.getState();
        const { lessons } = useLessonsStore.getState();
        const lessonIndex = lessons.findIndex((l) => l.category === category);
        
        let segmentIndex = 0;
        if (lessonIndex !== -1) {
            if (lessonIndex === courseProgress.lessonId) {
                segmentIndex = courseProgress.exerciseId || 0;
            } else if (lessonIndex < courseProgress.lessonId) {
                const totalSegments = Math.ceil(fetchedSigns.length / 10);
                segmentIndex = Math.floor(Math.random() * totalSegments) || 0;
            }
        }

        const globalIndex = segmentIndex * 10 + (get().quizStates[endpoint]?.answeredCount || 0);
        const remainingInSegment = Math.min(10, fetchedSigns.length - segmentIndex * 10);
        const totalQuestions = remainingInSegment > 0 ? remainingInSegment : 0;

        if (totalQuestions === 0 || globalIndex >= fetchedSigns.length) {
            set((state) => ({
                quizStates: {
                  ...state.quizStates,
                  [endpoint]: {
                    ...(state.quizStates[endpoint] || initialQuizState),
                    isLoading: false,
                    totalQuestions: 0,
                    targetQuestion: null,
                    questions: [],
                  }
                }
            }));
            return;
        }

        const targetQuestion = fetchedSigns[globalIndex];

        if (endpoint === 'theory') {
          const allOptions = [...(targetQuestion?.correct_ans ?? []), ...(targetQuestion?.wrong_ans ?? [])];
          const shuffledQuestions = allOptions.sort(() => Math.random() - 0.5);

          const mappedAnswers = shuffledQuestions.map((option) => ({
            id: option,
            question: option,
          }));

          set((state) => ({
            quizStates: {
              ...state.quizStates,
              [endpoint]: {
                ...(state.quizStates[endpoint] || initialQuizState),
                allQuestions: fetchedSigns,
                targetQuestion: targetQuestion,
                questions: mappedAnswers,
                isLoading: false,
                totalQuestions,
                questionStartTime: Date.now(),
              }
            }
          }));
        } else {
          const otherSigns = fetchedSigns.filter((s: any) => s.id !== targetQuestion.id);
          const shuffledOthers = otherSigns.sort(() => Math.random() - 0.5).slice(0, 3);
          const options = [targetQuestion, ...shuffledOthers].sort(() => Math.random() - 0.5);

          set((state) => ({
            quizStates: {
              ...state.quizStates,
              [endpoint]: {
                ...(state.quizStates[endpoint] || initialQuizState),
                allQuestions: fetchedSigns,
                targetQuestion: targetQuestion,
                questions: options,
                isLoading: false,
                totalQuestions,
                questionStartTime: Date.now(),
              }
            }
          }));
        }
      } catch (error) {
        console.error("Error failed to get signs: ", error);
        set((state) => ({
          quizStates: {
            ...state.quizStates,
            [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), isLoading: false }
          }
        }));
      }
    },

    handleSubmit: (endpoint: string, category?: string) => {
      const currentQuiz = get().quizStates[endpoint] || initialQuizState;
      const { isSubmitted, targetQuestion, selectedId, answeredCount, totalQuestions, correctCount } = currentQuiz;
      const { setIsCorrect, setIsSubmitted, setSelectedId, fetchQuestion, stopTimer } = get();

      if (!isSubmitted) {
        let isAnswerCorrect = false;
        if (endpoint === 'theory') {
          isAnswerCorrect = !!targetQuestion?.correct_ans?.includes(selectedId as string);
        } else {
          isAnswerCorrect = !!(targetQuestion && selectedId === targetQuestion.id);
        }
        const timeTaken = currentQuiz.questionStartTime 
          ? Math.round((Date.now() - currentQuiz.questionStartTime) / 1000) 
          : 0;
          
        const attempt = {
          question_id: targetQuestion?.id,
          is_correct: isAnswerCorrect,
          time_taken_seconds: timeTaken,
        };

        setIsCorrect(endpoint, isAnswerCorrect);
        setIsSubmitted(endpoint, true);
        
        if (!isAnswerCorrect) {
          const deductHeart = async () => {
            try {
              const res = await api.post('/quiz/deduct-heart');
              const currentUser = useAuthStore.getState().user;
              if (currentUser && res.data.hearts != null) {
                useAuthStore.getState().setUser({
                  ...currentUser,
                  hearts: res.data.hearts
                });
              }
            } catch (err) {
              console.error("Failed to deduct heart", err);
            }
          };
          deductHeart();
        }

        const newAnsweredCount = answeredCount + 1;
        const newCorrectCount = isAnswerCorrect ? correctCount + 1 : correctCount;

        set((state) => ({
          quizStates: {
            ...state.quizStates,
            [endpoint]: { 
                ...(state.quizStates[endpoint] || initialQuizState), 
                answeredCount: newAnsweredCount,
                correctCount: newCorrectCount,
                attempts: [...(state.quizStates[endpoint]?.attempts || []), attempt]
            }
          }
        }));

        if (totalQuestions > 0 && newAnsweredCount >= totalQuestions) {
           stopTimer(endpoint);
           // Save quiz result to the database
           const quizAfterStop = get().quizStates[endpoint];
           const timeSeconds = quizAfterStop?.startTime && quizAfterStop?.endTime
             ? Math.round((quizAfterStop.endTime - quizAfterStop.startTime) / 1000)
             : null;
           get().saveQuizResult(
             endpoint,
             quizAfterStop?.currentCategory || 'unknown',
             newCorrectCount,
             totalQuestions,
             timeSeconds,
             quizAfterStop?.attempts || []
           );
        }
      } else {
        setIsSubmitted(endpoint, false);
        setSelectedId(endpoint, null);
        if (answeredCount < totalQuestions) {
          fetchQuestion(endpoint, category);
        }
      }
    },

    saveQuizResult: async (endpoint, category, correctCount, totalQuestions, timeSeconds, attempts) => {
      try {
        const quizType = endpoint === 'theory' ? 'theory' : 'sign';

        const response = await api.post('/quiz/results', {
          quiz_type: quizType,
          category,
          correct_count: correctCount,
          total_questions: totalQuestions,
          time_seconds: timeSeconds,
          attempts,
        });

        // Update the user's total_xp locally
        const currentUser = useAuthStore.getState().user;
        if (currentUser && response.data.total_xp != null) {
          useAuthStore.getState().setUser({
            ...currentUser,
            total_xp: response.data.total_xp,
          });
        }

        console.log(`Quiz saved: +${response.data.xp_earned} XP (total: ${response.data.total_xp})`);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.detail || error?.response?.data?.message || error.message;
        console.error('Failed to save quiz result:', serverMessage);
      }
    },
  }))
);

// This custom hook retains your EXACT component surface signature.
// Your UI components require ZERO modifications.
export const useQuestions = (endpoint: string, category?: string) => {
  const currentQuiz = useQuestionsStore((state) => state.quizStates[endpoint]) || initialQuizState;
  const fetchQuestionAction = useQuestionsStore((state) => state.fetchQuestion);
  const handleSubmitAction = useQuestionsStore((state) => state.handleSubmit);
  const setSelectedIdAction = useQuestionsStore((state) => state.setSelectedId);

  // 3. Keep your exact original useEffect to fetch state on screen mount
  useEffect(() => {
    fetchQuestionAction(endpoint, category);
  }, [endpoint, category]);

  // 4. Return the exact state properties your old local useState hook returned
  return {
    questions: currentQuiz.questions,
    targetQuestion: currentQuiz.targetQuestion,
    isCorrect: currentQuiz.isCorrect,
    isSubmitted: currentQuiz.isSubmitted,
    selectedId: currentQuiz.selectedId,
    answeredCount: currentQuiz.answeredCount,
    totalQuestions: currentQuiz.totalQuestions,
    correctCount: currentQuiz.correctCount,
    startTime: currentQuiz.startTime,
    endTime: currentQuiz.endTime,
    setSelectedId: (id: number | string | null) => setSelectedIdAction(endpoint, id),
    fetchQuestion: () => fetchQuestionAction(endpoint, category),
    handleSubmit: () => handleSubmitAction(endpoint, category),
  };
};
