import * as React from 'react';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Commencez à écrire...',
  minHeight = '300px'
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const tools = [
    { icon: Heading2, label: 'Titre', action: () => insertMarkdown('## ', '\n') },
    { icon: Bold, label: 'Gras', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italique', action: () => insertMarkdown('_', '_') },
    { icon: List, label: 'Liste', action: () => insertMarkdown('\n- ', '') },
    { icon: ListOrdered, label: 'Liste numérotée', action: () => insertMarkdown('\n1. ', '') },
    { icon: LinkIcon, label: 'Lien', action: () => insertMarkdown('[', '](url)') },
  ];

  return (
    <div className="border border-[#634832]/10 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-[#634832]/10 bg-[#FAF7F2]">
        {tools.map((tool, idx) => (
          <button
            key={idx}
            onClick={tool.action}
            type="button"
            title={tool.label}
            className="p-2 hover:bg-white rounded-lg transition-colors text-[#634832] hover:text-[#D4A373]"
          >
            <tool.icon size={18} />
          </button>
        ))}
        <div className="ml-auto text-xs text-[#634832]/40 px-2">
          Markdown supporté
        </div>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-6 bg-white text-[#1A120B] placeholder:text-[#634832]/30 focus:outline-none resize-none font-sans leading-relaxed"
        style={{ minHeight }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#634832]/10 bg-[#FAF7F2] text-xs text-[#634832]/50">
        <span>{value.length} caractères</span>
        <span>~{Math.ceil(value.split(/\s+/).length / 200)} min de lecture</span>
      </div>
    </div>
  );
};