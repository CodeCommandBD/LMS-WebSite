import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";

const RichTextEditor = ({ content, onChange }) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your course description here...",
      height: 300,
      toolbarButtonSize: "middle",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "paragraph",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      removeButtons: ["source"],
    }),
    [],
  );

  return (
    <JoditEditor
      ref={editor}
      value={content || ""}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => onChange && onChange(newContent)}
    />
  );
};

export default RichTextEditor;
