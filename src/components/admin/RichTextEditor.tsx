"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, ImagePlus, Italic, Link2, List, ListOrdered, Heading2, Heading3 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] rounded-md border border-input bg-background p-3 text-sm focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return <Input disabled value="Loading editor..." />;
  }

  function setLink() {
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function setImage() {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 rounded-md border bg-muted/40 p-2">
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={setLink}>
          <Link2 className="size-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={setImage}>
          <ImagePlus className="size-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
