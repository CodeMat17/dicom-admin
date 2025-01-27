import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content, onChange }) => {
  const quillRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
          ],
        },
      });

      editorRef.current.on("text-change", () => {
        if (editorRef.current) {
          const value = editorRef.current.root.innerHTML;
          onChange(value);
        }
      });
    }

    if (editorRef.current && editorRef.current.root.innerHTML !== content) {
      editorRef.current.root.innerHTML = content;
    }
  }, [content, onChange]);

  return <div ref={quillRef} className='h-64 bg-white'></div>;
};

export default QuillEditor;
