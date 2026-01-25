import { QuizList } from "@/components/pages/quiz/quiz-list";

export const metadata = {
  title: "Intelli-PDF - Quiz",
  description: "Manage your all Quizzes on Intelli-PDF.",
};

export default function QuizListPage() {
  return (
    <div className="p-4">
      <QuizList />
    </div>
  );
}