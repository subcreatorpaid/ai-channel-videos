---
name: goal-lock
description: Checks any video idea, trend, collab or side project for the AI channel against the locked 90-day goal (1,000 subscribers + 4,000 watch hours) and returns On goal / One fix away / Off goal with the fix. Triggers - "goal check", "goal lock", "should I make this", "is this worth making", "does this fit my goal".
---

# Goal lock

## Locked goal
**1,000 subscribers + 4,000 public watch hours by 8 Feb 2027** (set 10 Nov 2026). The owner changes it by saying "new goal lock: ...".
Repeat the goal at the top of every check.

## The five tests
1. **Watch time** - can it hold 8-12 minutes with a real demo or build (not padding)?
2. **Subscribe reason** - does it fit a series a viewer would want more of (AI automation and creation)?
3. **Demand** - search demand or outlier evidence in the last 90 days?
4. **Showable** - can we show it working on screen, faceless, with tools we have?
5. **On brand** - honest, practical, nothing from the never-list, no terms-breaking tricks.

## Output (exactly this shape)
```
GOAL: 1,000 subs + 4,000 watch hours by 8 Feb 2027
IDEA: <one line>
VERDICT: On goal | One fix away | Off goal
TESTS: watch time ✓/✗ · subscribe reason ✓/✗ · demand ✓/✗ · showable ✓/✗ · on brand ✓/✗
WHY: <two sentences max>
FIX: <the one change, or "none needed">
SUGGESTED TITLE: <one line, if on goal or after the fix>
```
Views alone are not the goal; a viral video for the wrong audience is Off goal. Never soften a verdict.
