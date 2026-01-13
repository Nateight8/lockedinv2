"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QuizQuestion from "./_component/quize-question";

export default function TradingStyleQuiz() {
  const [answers, setAnswers] = useState({});

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-medium mb-2">
          Tell Us About Your Trading Style
        </h2>
        <p className="text-muted-foreground">
          This helps us recommend the best prop firms for you (takes 60 seconds)
        </p>
      </div>

      {/* Question 1 */}
      <QuizQuestion
        number={1}
        question="What's your typical trade duration?"
        options={[
          { value: "scalper", label: "Scalper (< 1 hour)", icon: "zap" },
          { value: "day", label: "Day Trader (1-8 hours)", icon: "sun" },
          {
            value: "swing",
            label: "Swing Trader (1+ days)",
            icon: "trending-up",
          },
          { value: "mixed", label: "I trade all styles", icon: "shuffle" },
        ]}
        value={answers.tradeDuration}
        onChange={(v) => setAnswers({ ...answers, tradeDuration: v })}
      />

      {/* Question 2 */}
      <QuizQuestion
        number={2}
        question="How many trades do you take per day?"
        options={[
          { value: "low", label: "1-5 trades", desc: "Patient, selective" },
          { value: "medium", label: "5-15 trades", desc: "Active day trader" },
          {
            value: "high",
            label: "15+ trades",
            desc: "High-frequency scalper",
          },
        ]}
        value={answers.tradesPerDay}
        onChange={(v) => setAnswers({ ...answers, tradesPerDay: v })}
      />

      {/* Question 3 */}
      <QuizQuestion
        number={3}
        question="What trading session(s) do you prefer?"
        type="multi-select"
        options={[
          { value: "london", label: "London (8am-5pm GMT)" },
          { value: "newyork", label: "New York (1pm-10pm GMT)" },
          { value: "asian", label: "Asian (11pm-8am GMT)" },
        ]}
        value={answers.sessions}
        onChange={(v) => setAnswers({ ...answers, sessions: v })}
      />

      {/* Question 4 */}
      <QuizQuestion
        number={4}
        question="Do you hold trades over weekends?"
        options={[
          { value: "yes", label: "Yes, often", icon: "check" },
          { value: "sometimes", label: "Sometimes", icon: "minus" },
          { value: "no", label: "No, I always close Friday", icon: "x" },
        ]}
        value={answers.weekendHolding}
        onChange={(v) => setAnswers({ ...answers, weekendHolding: v })}
      />

      {/* Question 5 */}
      <QuizQuestion
        number={5}
        question="Do you trade during high-impact news?"
        options={[
          { value: "yes", label: "Yes, I trade the news", icon: "trending-up" },
          { value: "no", label: "No, I avoid news volatility", icon: "shield" },
        ]}
        value={answers.newsTrading}
        onChange={(v) => setAnswers({ ...answers, newsTrading: v })}
      />

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          // onClick={() => skipQuiz()}
        >
          Skip This
        </Button>
        <Button
          size="lg"
          //   onClick={() => onComplete(answers)}
          //   disabled={!isComplete(answers)}
        >
          Get My Recommendations →
        </Button>
      </div>
    </div>
  );
}
