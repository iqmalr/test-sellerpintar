"use client";
import { useState } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { TooltipProvider } from "@/components/ui/tooltip";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { ActionsPlugin } from "@/components/editor/plugins/actions/actions-plugin";
import { CounterCharacterPlugin } from "@/components/editor/plugins/actions/counter-character-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [HeadingNode, ParagraphNode, TextNode, QuoteNode],
  onError: (error: Error) => {
    console.error(error);
  },
};
export function RichTextEditorDemo() {
  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <TooltipProvider>
          <Plugins />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
const placeholder = "Start typing...";
export function Plugins() {
  // const [floatingAnchorElem, setFloatingAnchorElem] =
  const [, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      <ToolbarPlugin>
        {() => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <ElementFormatToolbarPlugin />
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-72 min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div>
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-start"></div>
        </div>
      </ActionsPlugin>
    </div>
  );
}
