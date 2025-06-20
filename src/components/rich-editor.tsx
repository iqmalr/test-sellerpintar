"use client";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { editorTheme } from "./editor/themes/editor-theme";
import { TooltipProvider } from "./ui/tooltip";
import { Plugins } from "./blocks/editor-00/plugins";
type RichEditorProps = {
  onChange: (value: string) => void;
};
const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [HeadingNode, ParagraphNode, TextNode, QuoteNode],
  onError: (error: Error) => {
    console.error(error);
  },
};

function RichEditor({ onChange }: RichEditorProps) {
  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <TooltipProvider>
          <HistoryPlugin />
          <Plugins />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const htmlString = JSON.stringify(editorState); // Ganti dengan konversi ke string/html sesuai kebutuhan
                onChange(htmlString);
              });
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

export default RichEditor;
