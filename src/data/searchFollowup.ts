/** Local-only, deterministic routing for a follow-up to an existing citizen guide.
 * It does not infer meaning or answer unsupported factual questions.
 * Caller must check immediate danger before any other routing and must not
 * place resident text in URLs, telemetry, or external model requests.
 */
export type FollowupAction = 'danger' | 'advance' | 'contacted' | 'new-topic' | 'clarify' | 'repeat';

export interface FollowupContext {
  issue: string;
  guideId: string;
  step: number;
  stepCount: number;
}

export interface FollowupResolution {
  action: FollowupAction;
  message: string;
  nextStep: number;
}

const explicitSwitch = /\b(?:new (?:issue|topic|question)|another (?:issue|topic|question)|different (?:issue|topic)|change (?:topic|subject)|ibang (?:issue|concern|problema|tanong)|iba naman|next question)\b/i;
const contacted = /\b(?:already (?:called|contacted|reported|filed)|i (?:called|contacted|reported)|i have (?:called|contacted|reported)|nag[ -]?report na|nai[ -]?report ko na|tumawag na|na[ -]?contact ko na|nakapag[ -]?report na|nagsumbong na)\b/i;
const attempted = /\b(?:already (?:done|tried)|did that|tried that|i (?:did|tried) (?:it|that)|done that|nagawa ko na|nagawa na|nasubukan ko na|sinubukan ko na|ginawa ko na|tapos na|na[ -]?try ko na)\b/i;
const nextStep = /\b(?:what (?:next|now|else)|what should i do next|ano (?:na|pa|ang susunod)|paano na|sunod na|next step|what if it (?:continues|happens again))\b/i;
const sourceQuestion = /\b(?:where|when|how much|fee|cost|documents?|requirements?|saan|kailan|magkano|bayad|papeles|requirements|anong office|which office|ordinance|law|batas)\b/i;
const bareAcknowledgment = /^(?:yes|no|yep|nah|ok|okay|oo|opo|hindi|sige|salamat|thanks)[.!? ]*$/i;

export function resolveSearchFollowup(
  raw: string,
  context: FollowupContext,
  matchedGuideIds: string[],
  immediateDanger: boolean
): FollowupResolution {
  const message = raw.trim().slice(0, 500);
  const stay = (action: FollowupAction, step = context.step): FollowupResolution => ({
    action,
    message,
    nextStep: Math.max(0, Math.min(step, Math.max(0, context.stepCount - 1))),
  });
  if (!message) return stay('clarify');
  if (immediateDanger) return stay('danger');
  if (explicitSwitch.test(message)) return stay('new-topic');
  const differentGuide = matchedGuideIds.some(id => id !== context.guideId);
  if (differentGuide && !contacted.test(message) && !attempted.test(message)) {
    return stay('new-topic');
  }
  if (contacted.test(message)) return stay('contacted');
  if (attempted.test(message) || nextStep.test(message)) {
    return stay('advance', context.step + 1);
  }
  if (sourceQuestion.test(message) || bareAcknowledgment.test(message)) {
    return stay('clarify');
  }
  if (matchedGuideIds.includes(context.guideId)) return stay('repeat');
  // A substantive unmatched utterance may be a new Makati question; use the
  // existing general search, rather than forcing an unrelated guide answer.
  return message.length >= 8 ? stay('new-topic') : stay('clarify');
}
