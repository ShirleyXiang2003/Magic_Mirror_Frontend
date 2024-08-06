import { $getRoot } from "lexical";
import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { lexicalEditorConfig } from "./editorConfig";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import TurndownService from "turndown";
import { marked } from "marked";
import { $generateNodesFromDOM } from "@lexical/html";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import ToolbarPlugin from "./ToolbarPlugin";

function LexicalEditorWrapper() {
  return (
    <>
      <LexicalComposer initialConfig={lexicalEditorConfig}>
        <div className="flex flex-col h-full">
          <ToolbarPlugin />
          <div className="flex-grow overflow-auto p-4">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-full outline-none" />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>
        <OnChangePlugin onChange={handleEditorChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <SaveToLocalStoragePlugin />
        <AutoFocusPlugin />
        <LoadFromLocalStoragePlugin />
      </LexicalComposer>
    </>
  );
}

function handleEditorChange(editorState: any) {
  // handle changes
}

function LoadFromLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const markdownContent = localStorage.getItem("editorContent");
    if (markdownContent) {
      const htmlContent = marked(markdownContent, { async: false });
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlContent as string, "text/html");

      editor.update(() => {
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
    }
  }, [editor]);

  return null;
}

function SaveToLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();
  const turndownService = new TurndownService();

  turndownService.addRule("strikethrough", {
    filter: ["del", "s", "strike"] as any,
    replacement: function (content: any) {
      return "~~" + content + "~~";
    },
  });

  const saveContentToLocalStorage = () => {
    editor.getEditorState().read(() => {
      const htmlContent = editor.getRootElement()?.innerHTML || "";
      const markdownContent = turndownService.turndown(htmlContent);
      localStorage.setItem("editorContent", markdownContent);
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveContentToLocalStorage();
      console.log("saved");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editor]);

  return null;
}

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.focus();
  }, [editor]);
  return null;
}

export default LexicalEditorWrapper;
