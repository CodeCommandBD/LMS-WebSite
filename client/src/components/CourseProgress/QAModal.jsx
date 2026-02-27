import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const QAModal = ({ isOpen, onOpenChange, currentLecture }) => {
  const [qaList, setQaList] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    if (currentLecture && isOpen) {
      const savedQa = localStorage.getItem(`qa_${currentLecture._id}`);
      if (savedQa) {
        setQaList(JSON.parse(savedQa));
      } else {
        setQaList([]);
      }
    }
  }, [currentLecture, isOpen]);

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;
    const newQa = {
      id: Date.now().toString(),
      user: "You",
      question: newQuestion,
      date: new Date().toLocaleDateString(),
      answers: [],
    };

    const updatedList = [newQa, ...qaList];
    setQaList(updatedList);
    localStorage.setItem(
      `qa_${currentLecture._id}`,
      JSON.stringify(updatedList),
    );
    setNewQuestion("");
    toast.success("Question posted!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0f172a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Q&A Session</DialogTitle>
          <DialogDescription className="text-gray-400">
            Ask questions about "{currentLecture?.lectureTitle}" and view
            previous answers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 my-4">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAskQuestion();
            }}
          />
          <Button
            onClick={handleAskQuestion}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl h-auto"
          >
            Ask
          </Button>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {qaList.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">
              No questions asked yet. Be the first!
            </p>
          ) : (
            qaList.map((qa) => (
              <div
                key={qa.id}
                className="bg-white/5 rounded-xl p-3 border border-white/5"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-blue-400">
                    {qa.user}
                  </span>
                  <span className="text-[10px] text-gray-500">{qa.date}</span>
                </div>
                <p className="text-sm font-medium text-gray-300">
                  {qa.question}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QAModal;
