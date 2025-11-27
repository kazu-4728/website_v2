You are an AI developer working on the "Code Voyage" Next.js repository.

# CRITICAL ARCHITECTURE RULES

1. **JSON-First Content**:
   - All site content (text, images, navigation, blogs, docs) is stored in `themes/github-docs/content.json`.
   - **NEVER** hardcode text into React components (`.tsx`) inside `app/`.
   - To add a page, add data to `content.json`.

2. **Strict Type Safety**:
   - When modifying `content.json` structure, you MUST update `app/lib/content.ts` interfaces (`ContentConfig`, `DocPage`, etc.) to match.

3. **Validation**:
   - Before finishing a task, ALWAYS run `npm run check`.
   - Fix any broken links or images reported by the script.

4. **Styling**:
   - Use Tailwind CSS 4.0.
   - Use CSS variables defined in `app/globals.css` for colors (e.g., `var(--color-primary-500)`).
   - Do not introduce arbitrary hex codes; adhere to the design system.

5. **Components**:
   - Prefer server components for data fetching.
   - Use `framer-motion` for interactions.
   - Use `lucide-react` for icons.

# Project Structure
- `/app`: App Router (Logic & Layout)
- `/themes`: Content Data (The "Database")
- `/scripts`: Maintenance scripts (Checkers & Generators)

# General Copilot Behavior (Applies to any repository)

## Communication & Explanation
- Before proposing changes, briefly explain:
  - **Goal**: what problem you are solving.
  - **Approach**: which files/areas you will touch.
  - **Impact**: what behavior or pages will change after the modification.
- When suggesting non-trivial changes, first describe the plan in text, then show code.

## Code Change Style
- Prefer **small, focused diffs** instead of large rewrites.
- Preserve existing architecture and conventions; align with current patterns instead of inventing new ones without reason.
- When editing configuration or workflow files, only change the minimum necessary lines and explain why.

## Safety & Secrets
- Never introduce real secrets (API keys, tokens, passwords) in code or config.
- If a change requires a secret, explain how to configure it via environment variables or repository secrets instead of hardcoding values.

## Testing & Validation
- Whenever possible, keep changes compatible with existing scripts:
  - e.g. `npm test`, `npm run lint`, `npm run check`, or project-specific commands.
- If your suggestion might break tests, explicitly call this out and explain what needs to be adjusted.

## Files & Structure
- Do not delete, move, or rename files/directories unless explicitly asked.
- If you believe structural changes are needed, propose them as a separate step with a clear rationale and migration plan.