import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RotateCcw, Trophy, Target } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ModuleQuizProps {
  moduleSlug: string;
  questions: QuizQuestion[];
  passingScore?: number;
  onComplete?: (score: number, passed: boolean) => void;
}

export const ModuleQuiz: React.FC<ModuleQuizProps> = ({
  moduleSlug,
  questions,
  passingScore = 70,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return; // Don't allow changing after revealing answer

    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitAnswer = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(false);
    } else {
      // Quiz complete
      const score = calculateScore();
      const passed = score >= passingScore;
      setQuizCompleted(true);
      if (onComplete) {
        onComplete(score, passed);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowExplanation(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers(new Array(questions.length).fill(null));
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getCorrectCount = () => {
    return answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
  };

  if (questions.length === 0) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
        <AlertCircle className="mx-auto mb-3 text-amber-600" size={36} />
        <p className="text-amber-800 font-semibold">No quiz available for this module yet.</p>
        <p className="text-amber-600 text-sm mt-2">Check back soon!</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  // Quiz Results Screen
  if (quizCompleted) {
    const score = calculateScore();
    const passed = score >= passingScore;
    const correctCount = getCorrectCount();

    return (
      <div className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-xl">
        {/* Header */}
        <div className={`p-6 ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
          <div className="flex items-center justify-center gap-3 mb-3">
            {passed ? (
              <Trophy size={40} className="text-white" />
            ) : (
              <Target size={40} className="text-white" />
            )}
            <h2 className="text-3xl font-display font-bold text-white">
              {passed ? 'Quiz Completed!' : 'Keep Practicing!'}
            </h2>
          </div>
          <p className="text-white/90 text-center text-lg">
            {passed
              ? 'Congratulations! You passed this module quiz.'
              : 'You can retake the quiz to improve your score.'}
          </p>
        </div>

        {/* Score Display */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-block px-8 py-6 rounded-3xl ${passed ? 'bg-green-100' : 'bg-amber-100'} mb-4`}>
              <div className={`text-6xl font-display font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`}>
                {score}%
              </div>
              <div className={`text-sm font-semibold ${passed ? 'text-green-700' : 'text-amber-700'} mt-2`}>
                {correctCount} / {questions.length} Correct
              </div>
            </div>

            <div className="text-neutral-600 mb-6">
              {passed ? (
                <p>
                  ✅ Excellent work! You scored above the {passingScore}% passing threshold.
                </p>
              ) : (
                <p>
                  📚 You need {passingScore}% to pass. Review the module content and try again!
                </p>
              )}
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-purple-600" />
              Question Review
            </h3>
            <div className="space-y-3">
              {questions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div key={q.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 size={20} className="text-green-600" />
                      ) : (
                        <XCircle size={20} className="text-red-500" />
                      )}
                      <span className="text-sm text-neutral-700">
                        Question {index + 1}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRetakeQuiz}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Retake Quiz
            </button>
            {passed && (
              <button
                onClick={() => window.location.href = '/courses'}
                className="flex-1 px-6 py-4 bg-white border-2 border-neutral-200 text-neutral-700 font-semibold rounded-2xl hover:border-purple-300 transition-all"
              >
                Continue Learning →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  return (
    <div className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-xl">
      {/* Progress Bar */}
      <div className="bg-neutral-100 h-2">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6">
        <div className="flex items-center justify-between text-white/80 text-sm mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span className={`px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm ${
            currentQ.difficulty === 'easy' ? 'text-green-200' :
            currentQ.difficulty === 'medium' ? 'text-amber-200' :
            'text-red-200'
          }`}>
            {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
          </span>
        </div>
        <h3 className="text-xl font-display font-bold text-white">
          {currentQ.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="p-6 space-y-3">
        {currentQ.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === currentQ.correctAnswer;
          const showResult = showExplanation;

          let buttonStyle = 'bg-white border-2 border-neutral-200 hover:border-purple-300';

          if (showResult) {
            if (isCorrectOption) {
              buttonStyle = 'bg-green-50 border-2 border-green-500';
            } else if (isSelected && !isCorrectOption) {
              buttonStyle = 'bg-red-50 border-2 border-red-500';
            } else {
              buttonStyle = 'bg-neutral-50 border-2 border-neutral-200';
            }
          } else if (isSelected) {
            buttonStyle = 'bg-purple-50 border-2 border-purple-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={`w-full p-4 rounded-2xl text-left transition-all ${buttonStyle} ${
                showExplanation ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    showResult && isCorrectOption
                      ? 'bg-green-500 text-white'
                      : showResult && isSelected && !isCorrectOption
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-purple-500 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`text-neutral-800 ${
                    showResult && isCorrectOption ? 'font-semibold' : ''
                  }`}>
                    {option}
                  </span>
                </div>
                {showResult && isCorrectOption && (
                  <CheckCircle2 size={24} className="text-green-600" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircle size={24} className="text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`mx-6 mb-6 p-6 rounded-2xl ${
          isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-amber-50 border-2 border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <h4 className={`font-semibold mb-2 ${
                isCorrect ? 'text-green-800' : 'text-amber-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Not Quite'}
              </h4>
              <p className={`text-sm leading-relaxed ${
                isCorrect ? 'text-green-700' : 'text-amber-700'
              }`}>
                {currentQ.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="p-6 pt-0 flex gap-3">
        {currentQuestion > 0 && (
          <button
            onClick={handlePreviousQuestion}
            className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-purple-300 transition-all"
          >
            ← Previous
          </button>
        )}

        {!showExplanation ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!isAnswered}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${
              isAnswered
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};
