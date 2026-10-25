import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function extractPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractPlainText(node.props.children);
  }
  return "";
}

function normalizeLatexDelimiters(source: string): string {
  // Users write LaTeX as \( ... \) and \[ ... \] per our blog rules.
  // remark-math parses $...$ / $$...$$, so we normalize before MDX parsing
  // to avoid MDX treating `{...}` inside LaTeX as JS expressions.
  return source
    .replace(/\\\[((?:.|\n)*?)\\\]/g, (_m, inner) => `\n$$\n${inner}\n$$\n`)
    .replace(/\\\(((?:.|\n)*?)\\\)/g, (_m, inner) => `$${inner}$`);
}

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  if (typeof children !== "string") {
    return <code {...props}>{children}</code>;
  }

  let codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(extractPlainText(children));
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
          "aria-label": `Link to ${extractPlainText(children)}`,
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
};

export function CustomMDX(props) {
  const source =
    typeof props.source === "string"
      ? normalizeLatexDelimiters(props.source)
      : props.source;

  const mergedOptions = {
    ...(props.options || {}),
    mdxOptions: {
      ...(props.options?.mdxOptions || {}),
      remarkPlugins: [
        ...(props.options?.mdxOptions?.remarkPlugins || []),
        remarkGfm,
        remarkMath,
      ],
      rehypePlugins: [
        ...(props.options?.mdxOptions?.rehypePlugins || []),
        rehypeKatex,
      ],
    },
  };

  return (
    <MDXRemote
      {...props}
      source={source}
      options={mergedOptions}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
