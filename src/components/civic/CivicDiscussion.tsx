import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

interface CivicFeedItem {
  number: number;
  title: string;
  kind: 'report' | 'proposal' | 'update' | 'reviews';
  state: 'open' | 'closed';
  url: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  meta: {
    assetId?: string;
    category?: string;
    severity?: string;
    preferredChannel?: string;
    side?: string;
  };
}

interface CivicComment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

const cleanComment = (body: string) =>
  body
    .replace(/<!--[\\s\\S]*?-->/g, '')
    .replace(/\\*\\*/g, '')
    .replace(/^_([^_]+)_$/gm, '$1')
    .trim();

const kindLabel: Record<CivicFeedItem['kind'], string> = {
  report: 'Issue case',
  proposal: 'Improvement proposal',
  update: 'Information update',
  reviews: 'Reviews',
};

export default function CivicDiscussion({ assetId }: { assetId: string }) {
  const [items, setItems] = useState<CivicFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedFailed, setFeedFailed] = useState(false);
  const [activeIssue, setActiveIssue] = useState<number | null>(null);
  const [comments, setComments] = useState<CivicComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsFailed, setCommentsFailed] = useState(false);
  const [replyType, setReplyType] = useState('reply');
  const [reply, setReply] = useState('');
  const [alias, setAlias] = useState('');
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const [replyState, setReplyState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [replyMessage, setReplyMessage] = useState('');

  const loadFeed = async () => {
    setLoading(true);
    setFeedFailed(false);
    try {
      const response = await fetch('/api/civic', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.items)) throw new Error('feed');
      setItems(data.items.filter((item: CivicFeedItem) => item.meta?.assetId === assetId));
    } catch {
      setFeedFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFeed();
  }, [assetId]);

  const activeItem = useMemo(
    () => items.find(item => item.number === activeIssue) || null,
    [activeIssue, items]
  );

  const loadComments = async (issueNumber: number) => {
    setActiveIssue(issueNumber);
    setCommentsLoading(true);
    setCommentsFailed(false);
    setReplyState('idle');
    setReplyMessage('');
    setParentCommentId(null);
    try {
      const response = await fetch('/api/civic?issue=' + issueNumber, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.comments)) throw new Error('comments');
      setComments(data.comments);
    } catch {
      setComments([]);
      setCommentsFailed(true);
    } finally {
      setCommentsLoading(false);
    }
  };

  const submitReply = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeIssue) return;
    setReplyState('submitting');
    setReplyMessage('');
    try {
      const response = await fetch('/api/civic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          issueNumber: activeIssue,
          commentType: replyType,
          details: reply,
          alias,
          parentCommentId,
        }),
      });
      const data = response.status === 204 ? {} : await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save your response.');
      setReply('');
      setParentCommentId(null);
      setReplyState('success');
      setReplyMessage('Added to the public BetterMakati discussion.');
      await loadComments(activeIssue);
      await loadFeed();
    } catch (error) {
      setReplyState('error');
      setReplyMessage(error instanceof Error ? error.message : 'Could not save your response.');
    }
  };

  const quickResponse = async (issueNumber: number, commentType: string) => {
    setActiveIssue(issueNumber);
    setReplyState('submitting');
    try {
      const response = await fetch('/api/civic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          issueNumber,
          commentType,
          alias,
          details:
            commentType === 'confirm'
              ? 'I can confirm this issue is present.'
              : commentType === 'resolved'
                ? 'This appears to be resolved now.'
                : commentType === 'support'
                  ? 'I support this proposal.'
                  : 'I have a concern or trade-off to raise.',
        }),
      });
      const data = response.status === 204 ? {} : await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save response.');
      setReplyState('success');
      setReplyMessage('Community signal added.');
      await loadFeed();
      await loadComments(issueNumber);
    } catch (error) {
      setReplyState('error');
      setReplyMessage(error instanceof Error ? error.message : 'Could not save response.');
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
        Loading community reports and discussion…
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            Community record
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-gray-950">
            Reports, proposals, reviews & updates
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void loadFeed()}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-primary-700"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
        These are community-submitted BetterMakati records. They are not official government cases unless an official referral or acknowledgement is separately documented.
      </p>

      {feedFailed ? (
        <div className="mt-5 rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-900">
          The public Civic Map feed could not be loaded from this deployment.
        </div>
      ) : items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-[#fffdf8] p-6 text-sm text-gray-600">
          No public BetterMakati Civic Map records are attached to this asset yet.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map(item => (
            <article key={item.number} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                  {kindLabel[item.kind]}
                </span>
                <span className={item.state === 'open' ? 'text-success-700' : 'text-gray-500'}>
                  {item.state === 'open' ? 'Open community record' : 'Closed record'}
                </span>
                {item.meta?.severity && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                    {item.meta.severity}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-extrabold text-gray-950">
                #{item.number} {item.title}
              </h3>
              <div className="mt-1 text-xs text-gray-500">
                Updated {new Date(item.updatedAt).toLocaleDateString('en-PH')} · {item.comments} contribution{item.comments === 1 ? '' : 's'}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.kind === 'report' && item.state === 'open' && (
                  <>
                    <button
                      type="button"
                      onClick={() => void quickResponse(item.number, 'confirm')}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3 text-sm font-bold text-primary-800"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Confirm issue
                    </button>
                    <button
                      type="button"
                      onClick={() => void quickResponse(item.number, 'resolved')}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700"
                    >
                      Appears resolved
                    </button>
                  </>
                )}
                {item.kind === 'proposal' && item.state === 'open' && (
                  <>
                    <button
                      type="button"
                      onClick={() => void quickResponse(item.number, 'support')}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3 text-sm font-bold text-primary-800"
                    >
                      <ThumbsUp className="h-4 w-4" /> Support
                    </button>
                    <button
                      type="button"
                      onClick={() => void quickResponse(item.number, 'concern')}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700"
                    >
                      <ThumbsDown className="h-4 w-4" /> Raise concern
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => void loadComments(item.number)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700"
                >
                  <MessageCircle className="h-4 w-4" /> Discuss
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-primary-700"
                >
                  Public record <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeItem && (
        <div className="mt-7 rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Discussion #{activeItem.number}
              </div>
              <h3 className="mt-1 text-lg font-extrabold text-gray-950">{activeItem.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveIssue(null)}
              className="text-sm font-bold text-gray-600 underline underline-offset-2"
            >
              Close discussion
            </button>
          </div>

          {commentsLoading ? (
            <div className="mt-5 text-sm text-gray-500">Loading discussion…</div>
          ) : comments.length === 0 ? (
            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
              {commentsFailed ? 'Replies could not be loaded. Reopen this discussion to try again.' : 'No community replies yet.'}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {comments.map(comment => (
                <article key={comment.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {cleanComment(comment.body)}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>{new Date(comment.createdAt).toLocaleString('en-PH')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setParentCommentId(comment.id);
                        setReplyType('reply');
                        document.getElementById('civic-reply-box')?.focus();
                      }}
                      className="font-bold text-primary-700 underline underline-offset-2"
                    >
                      Reply
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <form onSubmit={submitReply} className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-field">
                <span>Response type</span>
                <select value={replyType} onChange={event => setReplyType(event.target.value)}>
                  <option value="reply">Reply</option>
                  <option value="update">Add an update</option>
                  {activeItem.kind === 'report' && <option value="confirm">Confirm issue</option>}
                  {activeItem.kind === 'report' && <option value="resolved">Appears resolved</option>}
                  {activeItem.kind === 'proposal' && <option value="support">Support</option>}
                  {activeItem.kind === 'proposal' && <option value="concern">Concern / trade-off</option>}
                </select>
              </label>
              <label className="form-field">
                <span>Public name / alias</span>
                <input value={alias} onChange={event => setAlias(event.target.value)} placeholder="Optional" />
              </label>
              <label className="form-field sm:col-span-2">
                <span>{parentCommentId ? 'Replying to comment #' + parentCommentId : 'Comment / update'}</span>
                <textarea
                  id="civic-reply-box"
                  rows={4}
                  value={reply}
                  onChange={event => setReply(event.target.value)}
                  placeholder="Add evidence, context, an alternative, or a current update. Avoid personal information and unverified accusations."
                />
              </label>
            </div>

            {parentCommentId && (
              <button
                type="button"
                onClick={() => setParentCommentId(null)}
                className="mt-2 text-xs font-bold text-gray-600 underline underline-offset-2"
              >
                Cancel reply target
              </button>
            )}

            {replyMessage && (
              <div
                role="status"
                className={
                  replyState === 'error'
                    ? 'mt-4 rounded-xl border border-error-200 bg-error-50 p-3 text-sm text-error-900'
                    : 'mt-4 rounded-xl border border-success-200 bg-success-50 p-3 text-sm text-success-900'
                }
              >
                {replyMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={replyState === 'submitting'}
              className="brand-btn-primary mt-4"
            >
              {replyState === 'submitting' ? 'Adding…' : 'Add to discussion'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
