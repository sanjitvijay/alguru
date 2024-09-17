import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { FaRegClipboard } from "react-icons/fa";
import { useState } from "react";
import rehypeRaw from "rehype-raw";

SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("ts", ts);

function SystemChat({ response }) {
  const [copyButtonText, setCopyButtonText] = useState("Copy Code");

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    setCopyButtonText("Copied!");
    setTimeout(() => setCopyButtonText("Copy code"), 1000);
  };
  return (
    <div className="prose prose-sm my-2">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        children={response}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div>
                <div className="flex justify-between">
                  <div className="text-sm">{match[1]}</div>
                  <button
                    className="btn btn-outline btn-xs no-animation"
                    onClick={() =>
                      copyToClipboard(String(children).replace(/\n$/, ""))
                    }
                  >
                    <FaRegClipboard size={15} />
                    {copyButtonText}
                  </button>
                </div>

                <div className="text-sm">
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={oneDark}
                  />
                </div>
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
}

export default SystemChat;
