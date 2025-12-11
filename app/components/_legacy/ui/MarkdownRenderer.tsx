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
    // Code Block Start/End
    if (line.trim().startsWith('```')) {
      if (currentCodeBlock) {
        // End of block
        elements.push(
          <div key={`code-${index}`} className="my-8">
            <CodeBlock 
              language={currentCodeBlock.language} 
              code={currentCodeBlock.code.join('\n')} 
            />
          </div>
        );
        currentCodeBlock = null;
      } else {
        // Start of block
        const language = line.trim().slice(3);
        currentCodeBlock = { language, code: [] };
      }
      return;
    }

    // Inside Code Block
    if (currentCodeBlock) {
      currentCodeBlock.code.push(line);
      return;
    }

    // Headings
    if (line.startsWith('## ')) {
      const text = line.slice(3);
      const id = slugify(text);
      elements.push(
        <h2 key={index} id={id} className="text-3xl font-bold text-white mt-12 mb-6 scroll-mt-24 border-b border-white/10 pb-4">
          {text}
        </h2>
      );
      return;
    }
    
    if (line.startsWith('### ')) {
      const text = line.slice(4);
      const id = slugify(text);
      elements.push(
        <h3 key={index} id={id} className="text-2xl font-bold text-white mt-8 mb-4 scroll-mt-24">
          {text}
        </h3>
      );
      return;
    }

    // List Items
    if (line.startsWith('- ')) {
        elements.push(
            <li key={index} className="ml-4 text-lg text-gray-300 mb-2">
                {line.slice(2)}
            </li>
        );
        return;
    }

    if (line.match(/^\d+\. /)) {
        elements.push(
            <div key={index} className="flex gap-2 text-lg text-gray-300 mb-2">
                 <span className="font-bold text-primary-400">{line.split('.')[0]}.</span>
                 <span>{line.split('. ').slice(1).join('. ')}</span>
            </div>
        );
        return;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
        elements.push(
            <blockquote key={index} className="border-l-4 border-primary-500 pl-4 py-2 my-6 text-gray-400 italic bg-dark-800/50 rounded-r">
                {line.slice(2)}
            </blockquote>
        );
        return;
    }

    // Empty lines
    if (line.trim() === '') {
      return;
    }

    // Paragraphs
    elements.push(
      <p key={index} className="text-lg text-gray-300 leading-relaxed mb-4">
        {line}
      </p>
    );
  });

  return <div className="markdown-content">{elements}</div>;
}
