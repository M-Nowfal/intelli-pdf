import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MarkDown({ content }: { content: string | undefined }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        strong: ({ children }) => <span className="font-semibold text-foreground">{children}</span>,
        em: ({ children }) => <span className="italic">{children}</span>,
        del: ({ children }) => <span className="line-through text-muted-foreground">{children}</span>,

        h1: ({ children }) => <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-foreground">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-6 mb-3 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-5 mb-2 text-xl font-semibold tracking-tight text-foreground">{children}</h3>,
        h4: ({ children }) => <h4 className="mt-4 mb-2 text-lg font-semibold tracking-tight text-foreground">{children}</h4>,
        h5: ({ children }) => <h5 className="mt-4 mb-2 text-base font-semibold tracking-tight text-foreground">{children}</h5>,
        h6: ({ children }) => <h6 className="mt-4 mb-2 text-sm font-semibold tracking-tight text-foreground">{children}</h6>,

        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,

        a: ({ children, href }) => (
          <Link
            href={href || "#"}
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </Link>
        ),

        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : null;
          const content = String(children).replace(/\n$/, "");

          const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(content);
          if (isUrl && inline) {
            const href = content.startsWith("http") ? content : `https://${content}`;
            return (
              <Link
                href={href}
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </Link>
            );
          }

          if (!inline && language) {
            return (
              <div className="rounded-md overflow-hidden my-4 border bg-[#1e1e1e]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                  <span className="text-xs text-gray-400 lowercase">{language}</span>
                </div>
                <div className="overflow-x-auto">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      background: "transparent",
                      fontSize: "0.875rem",
                    }}
                    {...props}
                  >
                    {content}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          }

          return (
            <code
              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
              {...props}
            >
              {children}
            </code>
          );
        },

        table: ({ children }) => (
          <div className="my-4 w-full overflow-hidden rounded-md border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">{children}</table>
            </div>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            {children}
          </thead>
        ),
        tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
        tr: ({ children }) => <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">{children}</tr>,
        th: ({ children }) => (
          <th className="h-10 px-4 py-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{children}</td>,

        blockquote: ({ children }) => (
          <blockquote className="mt-4 border-l-2 border-primary pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="rounded-md border border-border my-4 max-w-full h-auto"
          />
        ),
        hr: () => <hr className="my-6 border-border" />,
      }}
    >
      {content || ""}
    </ReactMarkdown>
  );
}