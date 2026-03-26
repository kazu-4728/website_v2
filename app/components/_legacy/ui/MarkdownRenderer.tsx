import { CodeBlock } from '../CodeBlock';

interface Props {
  content: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function MarkdownRenderer({ content }: Props) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentCodeBlock: { language: string; code: string[] } | null = null;

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (currentCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-8 overflow-hidden rounded-[24px] border border-[#e3d4c1] bg-[#fffdfa] p-2 shadow-[0_16px_40px_rgba(53,37,27,0.06)]">
            <CodeBlock language={currentCodeBlock.language} code={currentCodeBlock.code.join('\n')} />
          </div>
        );
        currentCodeBlock = null;
      } else {
        const language = line.trim().slice(3);
        currentCodeBlock = { language, code: [] };
      }
      return;
    }

    if (currentCodeBlock) {
      currentCodeBlock.code.push(line);
      return;
    }

    if (line.startsWith('## ')) {
      const text = line.slice(3);
      const id = slugify(text);
      elements.push(
        <h2 key={index} id={id} className="mt-14 scroll-mt-28 border-b border-[#e7dac7] pb-4 text-3xl text-[#2f241c] sm:text-[2.1rem]">
          {text}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      const text = line.slice(4);
      const id = slugify(text);
      elements.push(
        <h3 key={index} id={id} className="mt-9 scroll-mt-28 text-2xl text-[#3a2d23] sm:text-[1.7rem]">
          {text}
        </h3>
      );
      return;
    }

    if (line.startsWith('- ')) {
      elements.push(
        <li key={index} className="ml-5 list-disc text-[1rem] leading-8 text-[#5f4a3b] marker:text-[#bf8748]">
          {line.slice(2)}
        </li>
      );
      return;
    }

    if (line.match(/^\d+\. /)) {
      elements.push(
        <div key={index} className="flex gap-3 text-[1rem] leading-8 text-[#5f4a3b]">
          <span className="font-bold text-[#8e6231]">{line.split('.')[0]}.</span>
          <span>{line.split('. ').slice(1).join('. ')}</span>
        </div>
      );
      return;
    }

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="my-7 rounded-r-[20px] border-l-4 border-[#bf8748] bg-[#f6eee3] px-5 py-4 text-[0.98rem] italic leading-8 text-[#756354]">
          {line.slice(2)}
        </blockquote>
      );
      return;
    }

    if (line.trim() === '') {
      return;
    }

    elements.push(
      <p key={index} className="text-[1rem] leading-8 text-[#5f4a3b] sm:text-[1.05rem]">
        {line}
      </p>
    );
  });

  return <div className="markdown-content space-y-4">{elements}</div>;
}
