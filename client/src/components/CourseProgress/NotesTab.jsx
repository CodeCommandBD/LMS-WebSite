import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Save, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

// API helpers
const notesApi = {
  getNotes: (courseId, lectureId) =>
    api.get(`/notes/${courseId}/${lectureId}`).then((r) => r.data),
  saveNotes: (courseId, lectureId, content) =>
    api.post(`/notes/${courseId}/${lectureId}`, { content }).then((r) => r.data),
};

const NotesTab = ({ courseId, currentLecture }) => {
  const lectureId = currentLecture?._id;
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const debounceTimer = useRef(null);

  // Fetch existing notes when lecture changes
  const { data, isLoading } = useQuery({
    queryKey: ["notes", courseId, lectureId],
    queryFn: () => notesApi.getNotes(courseId, lectureId),
    enabled: !!(courseId && lectureId),
  });

  // Sync fetched notes into editor
  useEffect(() => {
    if (data !== undefined) {
      setContent(data?.content || "");
      setIsDirty(false);
    }
  }, [data]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (text) => notesApi.saveNotes(courseId, lectureId, text),
    onSuccess: () => {
      setIsDirty(false);
      toast.success("Notes saved!", { id: "notes-save" });
    },
    onError: (e) =>
      toast.error(e.response?.data?.message || "Failed to save notes", {
        id: "notes-save-err",
      }),
  });

  // Auto-save with 1.5s debounce
  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setContent(val);
      setIsDirty(true);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        saveMutation.mutate(val);
      }, 1500);
    },
    [courseId, lectureId],
  );

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  // Download notes as .txt
  const handleDownload = () => {
    if (!content.trim()) {
      toast.error("No notes to download. Write something first!");
      return;
    }
    const filename = `${
      currentLecture?.lectureTitle?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
      "lecture"
    }_notes.txt`;
    const header = `Lecture: ${currentLecture?.lectureTitle || "Untitled"}\n${"=".repeat(50)}\n\n`;
    const blob = new Blob([header + content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded!");
  };

  if (!currentLecture) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <FileText className="h-12 w-12 mb-3 opacity-20" />
        <p className="text-sm font-medium">Select a lecture to take notes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            My Notes
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentLecture.lectureTitle} — auto-saves as you type
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && !saveMutation.isPending && (
            <span className="text-[10px] text-amber-400 font-bold animate-pulse">
              Unsaved changes
            </span>
          )}
          {saveMutation.isPending && (
            <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold">
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </span>
          )}
          <Button
            size="sm"
            onClick={() => saveMutation.mutate(content)}
            disabled={!isDirty || saveMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 h-8 text-xs rounded-lg"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="border-white/10 text-gray-300 hover:text-white h-8 text-xs rounded-lg bg-white/5 hover:bg-white/10"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* Editor */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        </div>
      ) : (
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={`Write your notes for "${currentLecture.lectureTitle}" here...\n\nTip: Notes are auto-saved every 1.5 seconds as you type.`}
          className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 resize-none leading-relaxed font-mono transition-colors custom-scrollbar"
          spellCheck
        />
      )}

      {/* Character count */}
      <div className="flex justify-between items-center text-[10px] text-gray-600">
        <span>{content.length.toLocaleString()} / 10,000 characters</span>
        {!isDirty && content && (
          <span className="text-green-500 font-bold">✓ All changes saved</span>
        )}
      </div>
    </div>
  );
};

export default NotesTab;
