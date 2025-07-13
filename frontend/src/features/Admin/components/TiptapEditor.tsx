import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// Thêm `useEffect` từ React
import React, { useCallback, useEffect } from "react";

// --- Component Toolbar của bạn (giữ nguyên, chỉ sửa nhỏ) ---
const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  const getButtonStyle = (isActive: boolean) =>
    isActive ? { ...baseButtonStyle, ...activeButtonStyle } : baseButtonStyle;

  // Sửa nhỏ: Thêm `editor` vào dependency array của useCallback
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Sửa nhỏ: Thêm `editor` vào dependency array của useCallback
  const addImage = useCallback(() => {
    const url = window.prompt("Nhập URL hình ảnh");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]); // Phần JSX của Toolbar được giữ nguyên

  return (
    <div style={toolbarStyle}>
      <div style={buttonGroupStyle}>
        {/* Các nút Bold, Italic, Strike... */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={getButtonStyle(editor.isActive("bold"))}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={getButtonStyle(editor.isActive("italic"))}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={getButtonStyle(editor.isActive("strike"))}
        >
          Strike
        </button>
      </div>
      <div style={buttonGroupStyle}>
        {/* Các nút H1, H2, H3... */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          style={getButtonStyle(editor.isActive("heading", { level: 1 }))}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={getButtonStyle(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={getButtonStyle(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>
      </div>
      <div style={buttonGroupStyle}>
        {/* Các nút Bullet List, Ordered List... */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={getButtonStyle(editor.isActive("bulletList"))}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={getButtonStyle(editor.isActive("orderedList"))}
        >
          Ordered List
        </button>
      </div>
      <div style={buttonGroupStyle}>
        {/* Các nút Căn lề... */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          style={getButtonStyle(editor.isActive({ textAlign: "left" }))}
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          style={getButtonStyle(editor.isActive({ textAlign: "center" }))}
        >
          Center
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          style={getButtonStyle(editor.isActive({ textAlign: "right" }))}
        >
          Right
        </button>
      </div>
      <div style={buttonGroupStyle}>
        {/* Các nút Link, Image... */}
        <button type="button" onClick={setLink} style={baseButtonStyle}>
          Set Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          style={baseButtonStyle}
        >
          Unset Link
        </button>
        <button type="button" onClick={addImage} style={baseButtonStyle}>
          Add Image
        </button>
      </div>
    </div>
  );
};

// --- Các object style của bạn (giữ nguyên) ---
const toolbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "0.75rem",
  padding: "0.5rem",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem 0.5rem 0 0",
  backgroundColor: "#f9fafb",
};
const buttonGroupStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0.25rem" };
const baseButtonStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: "0.875rem",
  padding: "0.375rem 0.625rem",
  borderRadius: "0.375rem",
  border: "1px solid transparent",
  backgroundColor: "transparent",
  transition: "all 0.2s ease-in-out",
  cursor: "pointer",
};
const activeButtonStyle: React.CSSProperties = { backgroundColor: "#000000", color: "#ffffff" };

// --- Component chính và props ---
interface TiptapProps {
  value: string;
  onChange: (value: { rawHtml: string; plainText: string }) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    // Giữ nguyên `content: value` để thiết lập giá trị ban đầu
    content: value,
    editorProps: {
      attributes: {
        class: "rounded-b-md border-x border-b min-h-[250px] border-input bg-background p-4",
      },
    },
    onUpdate({ editor }) {
      const rawHtml = editor.getHTML();
      const plainText = editor.getText();
      onChange({ rawHtml, plainText });
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col justify-stretch">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
