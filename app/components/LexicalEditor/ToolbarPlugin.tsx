import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  TextFormatType,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaStrikethrough,
} from "react-icons/fa";
import { $getSelection, $isRangeSelection } from "lexical";

const ToolbarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  const formatHeading = (headingType: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        if (type !== headingType) {
          selection.insertNodes([$createHeadingNode(headingType)]);
        }
      }
    });
  };

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="flex items-center p-2 justify-center w-full overflow-x-auto">
      <button onClick={handleUndo} className="p-2">
        <FaUndo />
      </button>
      <button onClick={handleRedo} className="p-2">
        <FaRedo />
      </button>
      <div className="border-l-2 h-6 mx-2"></div> {/* Separator */}
      <button onClick={() => formatHeading("h1")} className="p-2">
        <span className="text-lg font-medium">H1</span>
      </button>
      <button onClick={() => formatHeading("h2")} className="p-2">
        <span className="text-lg font-medium">H2</span>
      </button>
      <button onClick={() => formatHeading("h3")} className="p-2">
        <span className="text-lg font-medium">H3</span>
      </button>
      <div className="border-l-2 h-6 mx-2"></div> {/* Separator */}
      <button onClick={() => formatText("bold")} className="p-2">
        <FaBold />
      </button>
      <button onClick={() => formatText("italic")} className="p-2">
        <FaItalic />
      </button>
      <button onClick={() => formatText("strikethrough")} className="p-2">
        <FaStrikethrough />
      </button>
    </div>
  );
};

export default ToolbarPlugin;
