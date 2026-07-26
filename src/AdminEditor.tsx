import {
  Check,
  ChevronDown,
  Code2,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Image,
  Link,
  Link2,
  List,
  MousePointer2,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { uploadMediaFile } from './lib/mediaUpload';
import { supabase } from './lib/supabaseClient';

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'list' | 'image' | 'html';
type PostStatus = 'draft' | 'review' | 'published';

type Block = {
  alt?: string;
  code?: string;
  html?: string;
  id: string;
  items?: string[];
  type: BlockType;
  url?: string;
};

type LinkKind = 'internal' | 'external';

type AdminEditorProps = {
  adminEmail: string;
  adminRole: 'owner' | 'editor';
  onSignOut: () => Promise<void>;
};

const sampleImages = [
  {
    label: 'Currency desk',
    url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'London market',
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'India payments',
    url: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=900&q=80',
  },
];

const categories = ['Exchange rates', 'Money transfer', 'NRI banking', 'Guides', 'Market notes'];

const internalSuggestions = ['/gbp-to-inr', '/guides', '/news', '/nri-banking', '/money-transfer-uk-to-india'];

const allowedTags = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CODE',
  'DIV',
  'EM',
  'H1',
  'H2',
  'H3',
  'H4',
  'I',
  'IMG',
  'LI',
  'OL',
  'P',
  'PRE',
  'SPAN',
  'STRONG',
  'U',
  'UL',
]);

const allowedAttributes = new Set(['alt', 'class', 'href', 'rel', 'src', 'target', 'title']);
const blockedTags = new Set(['EMBED', 'IFRAME', 'OBJECT', 'SCRIPT', 'STYLE']);

const initialBlocks: Block[] = [
  {
    id: createId(),
    type: 'h2',
    html: 'GBP to INR market update',
  },
  {
    id: createId(),
    type: 'paragraph',
    html: 'The pound is trading inside a narrow range against the rupee while transfer providers continue to quote different margins.',
  },
  {
    id: createId(),
    type: 'paragraph',
    html: 'Use this editor to build a clear article with links, images, HTML snippets and SEO checks before publishing.',
  },
];

export function AdminEditor({ adminEmail, adminRole, onSignOut }: AdminEditorProps) {
  const [title, setTitle] = useState('GBP to INR transfer guide');
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [activeInserter, setActiveInserter] = useState<number | null>(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
  const [savedMessage, setSavedMessage] = useState('Draft not saved yet');
  const [status, setStatus] = useState<PostStatus>('draft');
  const [slug, setSlug] = useState('gbp-to-inr-transfer-guide');
  const [excerpt, setExcerpt] = useState('A plain-English guide to reading GBP to INR transfer rates before sending money.');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['Guides']));
  const [focusKeyword, setFocusKeyword] = useState('GBP to INR');
  const [seoTitle, setSeoTitle] = useState('GBP to INR transfer guide');
  const [metaDescription, setMetaDescription] = useState('Learn how to compare GBP to INR exchange rates, provider margins, internal transfer routes and market signals before sending money.');
  const [manualInternalLinks, setManualInternalLinks] = useState('/gbp-to-inr\n/guides');
  const [manualExternalLinks, setManualExternalLinks] = useState('https://www.bankofengland.co.uk');
  const [contextMenu, setContextMenu] = useState<{ blockId: string; selectedText: string; x: number; y: number } | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Admin Editor | PoundToINR';
    const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = existingRobots?.content;
    const robots = existingRobots ?? document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex,nofollow';
    if (!existingRobots) {
      document.head.appendChild(robots);
    }

    return () => {
      document.title = previousTitle;
      if (previousRobots && existingRobots) {
        existingRobots.content = previousRobots;
      } else if (!existingRobots) {
        robots.remove();
      }
    };
  }, []);

  const articleText = useMemo(() => stripHtml(`${title} ${blocks.map(blockToPlainText).join(' ')}`), [blocks, title]);
  const wordCount = useMemo(() => countWords(articleText), [articleText]);
  const foundLinks = useMemo(() => extractLinks(blocks), [blocks]);
  const hasFeaturedImage = Boolean(featuredImageUrl.trim() || blocks.some((block) => block.type === 'image' && block.url));
  const seo = useMemo(
    () => buildSeoScore({
      articleText,
      focusKeyword,
      foundLinks,
      hasFeaturedImage,
      metaDescription,
      seoTitle,
      slug,
      wordCount,
    }),
    [articleText, focusKeyword, foundLinks, hasFeaturedImage, metaDescription, seoTitle, slug, wordCount],
  );

  const insertBlock = (index: number, type: BlockType | LinkKind) => {
    const nextBlock = createBlock(type);
    setBlocks((current) => [...current.slice(0, index + 1), nextBlock, ...current.slice(index + 1)]);
    setSelectedBlockIds(new Set([nextBlock.id]));
    setActiveInserter(null);
    setSavedMessage('Unsaved changes');
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, ...updates } : block)));
    setSavedMessage('Unsaved changes');
  };

  const updateHtmlFromElement = (blockId: string, element: HTMLElement) => {
    updateBlock(blockId, { html: sanitizeHtml(element.innerHTML) });
  };

  const toggleBlockSelection = (id: string) => {
    setSelectedBlockIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deleteSelectedBlocks = () => {
    if (selectedBlockIds.size === 0) {
      return;
    }
    setBlocks((current) => current.filter((block) => !selectedBlockIds.has(block.id)));
    setSelectedBlockIds(new Set());
    setSavedMessage('Unsaved changes');
  };

  const clearAll = () => {
    setBlocks([]);
    setSelectedBlockIds(new Set());
    setSavedMessage('Article cleared');
  };

  const handleEditorContextMenu = (event: MouseEvent<HTMLElement>, blockId: string) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() ?? '';
    if (!selection || selection.rangeCount === 0 || !selectedText) {
      return;
    }
    const container = event.currentTarget;
    if (!container.contains(selection.anchorNode) || !container.contains(selection.focusNode)) {
      return;
    }
    event.preventDefault();
    savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    setContextMenu({ blockId, selectedText, x: event.clientX, y: event.clientY });
    setLinkUrl('');
  };

  const applyLink = (kind: LinkKind) => {
    const range = savedRangeRef.current;
    if (!range || !contextMenu) {
      return;
    }

    const targetUrl = normalizeUrl(linkUrl, kind);
    if (!targetUrl) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = targetUrl;
    if (kind === 'external') {
      anchor.target = '_blank';
      anchor.rel = 'nofollow noopener';
    }
    anchor.appendChild(range.extractContents());
    range.insertNode(anchor);

    const blockElement = document.querySelector<HTMLElement>(`[data-block-id="${contextMenu.blockId}"] .admin-block-content`);
    if (blockElement) {
      updateBlock(contextMenu.blockId, { html: sanitizeHtml(blockElement.innerHTML) });
    }
    setContextMenu(null);
    savedRangeRef.current = null;
    setLinkUrl('');
  };

  const deleteSelectedText = () => {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : savedRangeRef.current;
    if (!range) {
      return;
    }
    const host = findBlockHost(range.commonAncestorContainer);
    range.deleteContents();
    if (host) {
      const blockId = host.dataset.blockId;
      const content = host.querySelector<HTMLElement>('.admin-block-content');
      if (blockId && content) {
        updateBlock(blockId, { html: sanitizeHtml(content.innerHTML) });
      }
    }
    selection?.removeAllRanges();
    setContextMenu(null);
    savedRangeRef.current = null;
  };

  const persistPost = async (nextStatus: PostStatus) => {
    if (!supabase) {
      setSavedMessage('Supabase is not configured');
      return;
    }
    setIsSaving(true);
    const payload = {
      blocks,
      categories: Array.from(selectedCategories),
      excerpt,
      external_links: splitLinks(manualExternalLinks),
      featured_image_url: featuredImageUrl || null,
      focus_keyword: focusKeyword,
      internal_links: splitLinks(manualInternalLinks),
      meta_description: metaDescription,
      published_at: nextStatus === 'published' ? new Date().toISOString() : null,
      seo_score: seo.score,
      seo_title: seoTitle,
      slug: slug || slugify(title),
      status: nextStatus,
      title,
      word_count: wordCount,
    };

    const query = currentPostId
      ? supabase.from('posts').update(payload).eq('id', currentPostId).select('id').single()
      : supabase.from('posts').insert(payload).select('id').single();
    const { data, error } = await query;
    setIsSaving(false);

    if (error) {
      setSavedMessage(`Save failed: ${error.message}`);
      return;
    }

    setCurrentPostId(data.id);
    setStatus(nextStatus);
    setSavedMessage(`${nextStatus === 'published' ? 'Published' : 'Draft saved'} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  const saveDraft = () => {
    void persistPost('draft');
  };

  const publishPost = () => {
    void persistPost('published');
  };

  return (
    <div className="admin-shell" onClick={() => setContextMenu(null)}>
      <header className="admin-toolbar">
        <div className="admin-toolbar__brand">
          <FileText size={20} />
          <div>
            <strong>Post editor</strong>
            <span>{savedMessage}</span>
          </div>
        </div>
        <div className="admin-toolbar__stats">
          <span className="admin-user-pill">
            <ShieldCheck size={14} />
            {adminEmail} ({adminRole})
          </span>
          <span className={seo.score >= 70 ? 'admin-score is-good' : 'admin-score'}>SEO {seo.score}/100</span>
          <span>{wordCount} words</span>
        </div>
        <div className="admin-toolbar__actions">
          <button type="button" onClick={saveDraft} disabled={isSaving}>
            <Save size={16} />
            Save Draft
          </button>
          <button type="button" className="admin-publish" onClick={publishPost} disabled={isSaving}>
            <Send size={16} />
            Publish
          </button>
          <button type="button" onClick={() => void onSignOut()}>
            Sign out
          </button>
        </div>
      </header>

      <main className="admin-workspace">
        <section className="admin-editor-column">
          <input
            className="admin-title-input"
            aria-label="Post title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setSavedMessage('Unsaved changes');
            }}
            placeholder="Add title"
          />

          <div className="admin-editor-tools">
            <button type="button" onClick={deleteSelectedText}>
              <Trash2 size={15} />
              Delete selected text
            </button>
            <button type="button" onClick={deleteSelectedBlocks} disabled={selectedBlockIds.size === 0}>
              <Trash2 size={15} />
              Delete selected blocks
            </button>
            <button type="button" className="admin-danger" onClick={clearAll}>
              <X size={15} />
              Clear All
            </button>
          </div>

          <div className="admin-editor-canvas" aria-label="Visual article editor">
            {blocks.length === 0 ? (
              <div className="admin-empty-state">
                <p>Article is empty.</p>
                <button type="button" onClick={() => setBlocks([createBlock('paragraph')])}>
                  <Plus size={16} />
                  Add first block
                </button>
              </div>
            ) : (
              blocks.map((block, index) => (
                <div key={block.id} className={`admin-block ${selectedBlockIds.has(block.id) ? 'is-selected' : ''}`} data-block-id={block.id}>
                  <label className="admin-block-check" aria-label="Select block">
                    <input type="checkbox" checked={selectedBlockIds.has(block.id)} onChange={() => toggleBlockSelection(block.id)} />
                  </label>
                  {renderBlock(block, updateBlock, updateHtmlFromElement, handleEditorContextMenu)}
                  <div className="admin-block-add">
                    <button type="button" aria-label="Insert block" onClick={() => setActiveInserter(activeInserter === index ? null : index)}>
                      <Plus size={18} />
                    </button>
                    {activeInserter === index ? <InserterMenu onInsert={(type) => insertBlock(index, type)} /> : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="admin-preview-column">
          <div className="admin-preview-bar">
            <MousePointer2 size={16} />
            Live preview
          </div>
          <article className="admin-preview">
            <h1>{title || 'Untitled post'}</h1>
            {blocks.map((block) => renderPreviewBlock(block))}
          </article>
        </section>

        <aside className="admin-sidebar">
          <details open className="admin-panel">
            <summary>
              Post settings
              <ChevronDown size={16} />
            </summary>
            <label>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value as PostStatus)}>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label>
              Slug
              <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} />
            </label>
            <label>
              Excerpt
              <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} />
            </label>
            <label>
              Featured image URL
              <input value={featuredImageUrl} onChange={(event) => setFeaturedImageUrl(event.target.value)} placeholder="https://..." />
            </label>
            <div className="admin-checkbox-list">
              {categories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category)}
                    onChange={() =>
                      setSelectedCategories((current) => {
                        const next = new Set(current);
                        if (next.has(category)) {
                          next.delete(category);
                        } else {
                          next.add(category);
                        }
                        return next;
                      })
                    }
                  />
                  {category}
                </label>
              ))}
            </div>
          </details>

          <details open className="admin-panel">
            <summary>
              Rank Math SEO
              <ChevronDown size={16} />
            </summary>
            <div className="admin-seo-meter">
              <span style={{ width: `${seo.score}%` }} />
            </div>
            <strong className="admin-seo-number">{seo.score}/100</strong>
            <label>
              Focus keyword
              <input value={focusKeyword} onChange={(event) => setFocusKeyword(event.target.value)} />
            </label>
            <label>
              SEO title
              <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
            </label>
            <label>
              Meta description
              <textarea value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} rows={4} />
            </label>
            <div className="admin-slug-preview">/{slug || 'post-slug'}</div>
            <div className="admin-checks">
              {seo.checks.map((check) => (
                <div key={check.label} className={check.pass ? 'is-pass' : ''}>
                  <Check size={14} />
                  {check.label}
                </div>
              ))}
            </div>
          </details>

          <details open className="admin-panel">
            <summary>
              Links
              <ChevronDown size={16} />
            </summary>
            <label>
              Internal links
              <textarea value={manualInternalLinks} onChange={(event) => setManualInternalLinks(event.target.value)} rows={3} />
            </label>
            <label>
              External links
              <textarea value={manualExternalLinks} onChange={(event) => setManualExternalLinks(event.target.value)} rows={3} />
            </label>
            <div className="admin-link-suggestions">
              <span>Suggestions</span>
              {internalSuggestions.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => setManualInternalLinks((current) => `${current}\n${suggestion}`.trim())}>
                  <Link2 size={13} />
                  {suggestion}
                </button>
              ))}
            </div>
            <small>
              Found: {foundLinks.internal.length} internal, {foundLinks.external.length} external
            </small>
          </details>
        </aside>
      </main>

      {contextMenu ? (
        <div
          className="admin-link-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <strong>Link selected text</strong>
          <span>"{contextMenu.selectedText}"</span>
          <input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="Paste URL or path" autoFocus />
          <div>
            <button type="button" onClick={() => applyLink('internal')}>
              Internal Link
            </button>
            <button type="button" onClick={() => applyLink('external')}>
              External Link
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InserterMenu({ onInsert }: { onInsert: (type: BlockType | LinkKind) => void }) {
  const options: Array<{ icon: JSX.Element; label: string; type: BlockType | LinkKind }> = [
    { icon: <FileText size={15} />, label: 'Absatz / Paragraph', type: 'paragraph' },
    { icon: <Heading1 size={15} />, label: 'H1', type: 'h1' },
    { icon: <Heading2 size={15} />, label: 'H2', type: 'h2' },
    { icon: <Heading3 size={15} />, label: 'H3', type: 'h3' },
    { icon: <Heading4 size={15} />, label: 'H4', type: 'h4' },
    { icon: <List size={15} />, label: 'Liste', type: 'list' },
    { icon: <Link size={15} />, label: 'Internal Link', type: 'internal' },
    { icon: <Link2 size={15} />, label: 'External Link', type: 'external' },
    { icon: <Image size={15} />, label: 'Artikelbild', type: 'image' },
    { icon: <Code2 size={15} />, label: 'Custom HTML', type: 'html' },
  ];

  return (
    <div className="admin-inserter-menu">
      {options.map((option) => (
        <button type="button" key={option.label} onClick={() => onInsert(option.type)}>
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

function renderBlock(
  block: Block,
  updateBlock: (id: string, updates: Partial<Block>) => void,
  updateHtmlFromElement: (blockId: string, element: HTMLElement) => void,
  handleEditorContextMenu: (event: MouseEvent<HTMLElement>, blockId: string) => void,
) {
  if (block.type === 'image') {
    return <ImageBlock block={block} updateBlock={updateBlock} />;
  }
  if (block.type === 'html') {
    return <HtmlBlock block={block} updateBlock={updateBlock} />;
  }
  if (block.type === 'list') {
    return (
      <ul
        className="admin-block-content admin-list-block"
        contentEditable
        suppressContentEditableWarning
        onContextMenu={(event) => handleEditorContextMenu(event, block.id)}
        onInput={(event) => updateHtmlFromElement(block.id, event.currentTarget)}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.html ?? '<li>List item</li>') }}
      />
    );
  }

  const Tag = block.type === 'paragraph' ? 'p' : block.type;
  return (
    <Tag
      className="admin-block-content"
      contentEditable
      suppressContentEditableWarning
      onContextMenu={(event: MouseEvent<HTMLElement>) => handleEditorContextMenu(event, block.id)}
      onInput={(event) => updateHtmlFromElement(block.id, event.currentTarget)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.html ?? '') }}
    />
  );
}

function ImageBlock({ block, updateBlock }: { block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }) {
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadMessage('Image upload ho rahi hai...');
    const result = await uploadMediaFile(file);
    updateBlock(block.id, { alt: block.alt || file.name.replace(/\.[^.]+$/, ''), url: result.url });
    setUploadMessage(result.message);
  };

  return (
    <div className="admin-image-block">
      <div className="admin-image-controls">
        <span>Artikelbild</span>
        <div className="admin-sample-row">
          {sampleImages.map((sample) => (
            <button type="button" key={sample.url} onClick={() => updateBlock(block.id, { alt: sample.label, url: sample.url })}>
              {sample.label}
            </button>
          ))}
        </div>
        <label>
          Image URL
          <input value={block.url ?? ''} onChange={(event) => updateBlock(block.id, { url: event.target.value })} placeholder="https://..." />
        </label>
        <label>
          Alt text
          <input value={block.alt ?? ''} onChange={(event) => updateBlock(block.id, { alt: event.target.value })} placeholder="Describe the image" />
        </label>
        <label className="admin-upload-button">
          Upload/select from computer
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>
        {uploadMessage ? <small className="admin-upload-note">{uploadMessage}</small> : null}
      </div>
      <div className="admin-image-preview">
        {block.url ? <img src={block.url} alt={block.alt ?? ''} /> : <span>No image selected yet</span>}
      </div>
    </div>
  );
}

function HtmlBlock({ block, updateBlock }: { block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }) {
  return (
    <div className="admin-html-block">
      <label>
        Custom HTML
        <textarea
          value={block.code ?? ''}
          onChange={(event) => updateBlock(block.id, { code: event.target.value })}
          placeholder="<div>Your HTML</div>"
          rows={7}
        />
      </label>
      <div className="admin-html-preview">
        <span>Preview</span>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.code ?? '') }} />
      </div>
    </div>
  );
}

function renderPreviewBlock(block: Block) {
  if (block.type === 'image') {
    return block.url ? <img key={block.id} src={block.url} alt={block.alt ?? ''} /> : null;
  }
  if (block.type === 'html') {
    return <div key={block.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.code ?? '') }} />;
  }
  if (block.type === 'list') {
    return <ul key={block.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.html ?? '') }} />;
  }
  const Tag = block.type === 'paragraph' ? 'p' : block.type;
  return <Tag key={block.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.html ?? '') }} />;
}

function createBlock(type: BlockType | LinkKind): Block {
  if (type === 'internal') {
    return { id: createId(), type: 'paragraph', html: '<a href="/gbp-to-inr">Internal link text</a>' };
  }
  if (type === 'external') {
    return {
      id: createId(),
      type: 'paragraph',
      html: '<a href="https://example.com" target="_blank" rel="nofollow noopener">External link text</a>',
    };
  }
  if (type === 'image') {
    return { alt: '', id: createId(), type: 'image', url: '' };
  }
  if (type === 'html') {
    return { code: '<p><strong>Custom HTML preview</strong></p>', id: createId(), type: 'html' };
  }
  if (type === 'list') {
    return { html: '<li>List item</li>', id: createId(), type: 'list' };
  }
  const labels: Record<BlockType, string> = {
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    html: '',
    image: '',
    list: '',
    paragraph: 'Start writing...',
  };
  return { html: labels[type], id: createId(), type };
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function sanitizeHtml(input: string) {
  if (!input.trim()) {
    return '';
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        if (blockedTags.has(element.tagName)) {
          element.remove();
          return;
        }
        if (!allowedTags.has(element.tagName)) {
          element.replaceWith(...element.childNodes);
          return;
        }
        [...element.attributes].forEach((attribute) => {
          const name = attribute.name.toLowerCase();
          if (!allowedAttributes.has(name) || name.startsWith('on')) {
            element.removeAttribute(attribute.name);
          }
        });
        if (element.tagName === 'A') {
          const href = element.getAttribute('href') ?? '';
          if (/^javascript:/i.test(href)) {
            element.removeAttribute('href');
          }
          if (/^https?:\/\//i.test(href)) {
            element.setAttribute('target', '_blank');
            element.setAttribute('rel', 'nofollow noopener');
          }
        }
        if (element.tagName === 'IMG') {
          const src = element.getAttribute('src') ?? '';
          if (/^javascript:/i.test(src)) {
            element.removeAttribute('src');
          }
        }
      }
      walk(child);
    });
  };
  walk(doc.body);
  return doc.body.firstElementChild?.innerHTML ?? '';
}

function normalizeUrl(url: string, kind: LinkKind) {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }
  if (kind === 'external') {
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`;
}

function findBlockHost(node: Node | null) {
  let current: Node | null = node;
  while (current) {
    if (current instanceof HTMLElement && current.dataset.blockId) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function stripHtml(value: string) {
  const template = document.createElement('template');
  template.innerHTML = sanitizeHtml(value);
  return template.content.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function countWords(value: string) {
  return value.split(/\s+/).filter(Boolean).length;
}

function blockToPlainText(block: Block) {
  if (block.type === 'image') {
    return block.alt ?? '';
  }
  if (block.type === 'html') {
    return stripHtml(block.code ?? '');
  }
  return stripHtml(block.html ?? '');
}

function extractLinks(blocks: Block[]) {
  const links = blocks.flatMap((block) => {
    const html = block.type === 'html' ? block.code ?? '' : block.html ?? '';
    const doc = new DOMParser().parseFromString(sanitizeHtml(html), 'text/html');
    return [...doc.querySelectorAll('a')].map((link) => link.getAttribute('href') ?? '').filter(Boolean);
  });
  return {
    external: links.filter((link) => /^https?:\/\//i.test(link)),
    internal: links.filter((link) => link.startsWith('/')),
  };
}

function buildSeoScore({
  articleText,
  focusKeyword,
  foundLinks,
  hasFeaturedImage,
  metaDescription,
  seoTitle,
  slug,
  wordCount,
}: {
  articleText: string;
  focusKeyword: string;
  foundLinks: { external: string[]; internal: string[] };
  hasFeaturedImage: boolean;
  metaDescription: string;
  seoTitle: string;
  slug: string;
  wordCount: number;
}) {
  const keyword = focusKeyword.trim().toLowerCase();
  const normalizedArticle = articleText.toLowerCase();
  const checks = [
    { label: 'keyword title mein', pass: Boolean(keyword && seoTitle.toLowerCase().includes(keyword)) },
    { label: 'keyword meta description mein', pass: Boolean(keyword && metaDescription.toLowerCase().includes(keyword)) },
    { label: 'keyword URL mein', pass: Boolean(keyword && slug.toLowerCase().includes(keyword.replace(/\s+/g, '-'))) },
    { label: 'keyword content ke start mein', pass: Boolean(keyword && normalizedArticle.slice(0, 180).includes(keyword)) },
    { label: 'internal link present', pass: foundLinks.internal.length > 0 },
    { label: 'external link present', pass: foundLinks.external.length > 0 },
    { label: 'meta description length ok', pass: metaDescription.length >= 120 && metaDescription.length <= 160 },
    { label: 'article word count ok', pass: wordCount >= 300 },
    { label: 'featured image present', pass: hasFeaturedImage },
  ];
  const score = Math.round((checks.filter((check) => check.pass).length / checks.length) * 100);
  return { checks, score };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitLinks(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
