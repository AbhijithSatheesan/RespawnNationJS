import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-black/30">
      {children}
    </thead>
  ),

  tr: ({ children }) => (
    <tr className="border-b border-white/10">
      {children}
    </tr>
  ),

  th: ({ children }) => (
    <th className="px-3 py-2 text-left border border-white/10">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-3 py-2 border border-white/10">
      {children}
    </td>
  ),

  p: ({ children }) => (
    <p className="mb-3 last:mb-0">
      {children}
    </p>
  ),

  strong: ({ children }) => (
    <strong className="font-bold text-white">
      {children}
    </strong>
  ),

  ul: ({ children }) => (
    <ul className="list-disc ml-6 mb-3 space-y-1">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal ml-6 mb-3 space-y-1">
      {children}
    </ol>
  ),

  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-white mb-3">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-white mb-3">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="text-base font-bold text-white mb-2">
      {children}
    </h3>
  ),

  code: ({ children }) => (
    <code className="bg-black/50 rounded px-1.5 py-0.5 text-sm text-cyan-300">
      {children}
    </code>
  ),
};

const MarkdownRenderer = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;