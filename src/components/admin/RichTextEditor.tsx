"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Heading2,
  Heading3,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type DialogState = {
  open: boolean;
  mode: "link" | "image";
  inputValue: string;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [linkError, setLinkError] = useState(false);

  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    mode: "link",
    inputValue: "",
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content: value,
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[240px] rounded-md border border-input bg-background p-3 text-sm focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return <Input disabled value="Loading editor..." />;

  function openLinkDialog() {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      setLinkError(true);
      setTimeout(() => setLinkError(false), 3000);
      return;
    }
    const previousUrl = editor.getAttributes("link").href ?? "";
    setDialog({ open: true, mode: "link", inputValue: previousUrl });
  }

  function openImageDialog() {
    setDialog({ open: true, mode: "image", inputValue: "" });
  }

  function handleConfirm() {
    if (!editor) return;
    const url = dialog.inputValue.trim();
    if (dialog.mode === "link") {
      if (!url) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }
    } else {
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
    setDialog((d) => ({ ...d, open: false }));
  }

  return (
    <>
      <div className="space-y-2">
        {linkError && (
          <p className="text-xs text-destructive px-1">
            Select text first before applying a link.
          </p>
        )}
        <div className="flex flex-wrap gap-2 rounded-md border bg-muted/40 p-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={openLinkDialog}
          >
            <Link2 className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={openImageDialog}
          >
            <ImagePlus className="size-4" />
          </Button>
        </div>
        <EditorContent editor={editor} />
      </div>

      <Dialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog.mode === "link" ? "Insert Link" : "Insert Image"}
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder={
              dialog.mode === "link"
                ? "https://example.com"
                : "https://example.com/image.jpg"
            }
            value={dialog.inputValue}
            onChange={(e) =>
              setDialog((d) => ({ ...d, inputValue: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            autoFocus
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialog((d) => ({ ...d, open: false }))}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm}>
              {dialog.mode === "link" ? "Set Link" : "Insert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
