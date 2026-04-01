---
title: "Observer Effect"
oneLiner: "The act of measuring or watching a system changes how the system behaves"
alsoKnownAs: ["Hawthorne effect", "Measurement effect", "Reactivity"]
theme: "measurement-and-signals"
tags: ["measurement", "behaviour", "observation", "bias"]
dotGrid:
  seed: 4183
  variant: "observerEffect"
related:
  - slug: "feedback-loops"
    note: "Observation creates a new feedback loop - the system senses it's being watched and adjusts its behaviour accordingly"
  - slug: "goodharts-law"
    note: "The observer effect is the behavioural mechanism behind Goodhart's Law - people change what they do when they know it's measured"
  - slug: "proxy-measures"
    note: "The observer effect means that measuring a proxy doesn't just simplify reality - it changes reality"
  - slug: "complexity-vs-complication"
    note: "The observer effect is a hallmark of complex systems - the system responds to being studied, unlike a machine"
  - slug: "intervention-side-effects"
    note: "Measurement is itself an intervention - the observer effect is its side effect"
draft: false
---

<span class="kicker">THE IDEA</span>

## Looking changes everything

You introduce a camera into a meeting room and people speak differently. You tell employees their calls are being recorded and they follow the script more carefully. You announce a school inspection and teachers prepare differently. The act of observation changes what's being observed.

This isn't deception or performance. It's a system responding to a change in its environment - and the introduction of an observer is a change in the environment. People who know they're being measured, watched, evaluated, or studied adjust their behaviour. Sometimes consciously, sometimes not. Sometimes in the direction the observer wants, sometimes in unexpected directions. But the behaviour under observation is never the same as the behaviour without it.

The implications for measurement are profound. Every measurement of a human system is, to some degree, a measurement of the system-being-measured rather than of the system itself. The data you collect is shaped by the fact that you're collecting it. This doesn't make measurement useless. It makes it an intervention, not just an observation. And interventions have effects.

<span class="kicker">IN PRACTICE</span>

## The watched and the unwatched

A factory's productivity was studied by researchers at Western Electric's Hawthorne plant in the 1920s. They changed the lighting and productivity improved. They changed it back and productivity improved again. They changed working hours, break times, pay structures - and productivity kept improving regardless. The conclusion: the workers weren't responding to the changes. They were responding to being watched. The attention itself changed the behaviour. The experiment was measuring its own effect.

A child behaves perfectly when the parent is in the room and chaotically when they leave. The parent sees a well-behaved child. The babysitter sees a different one entirely. The parent's observation creates the good behaviour. The absence of observation reveals the default. The parent who says "they're always like that" is describing the child under observation, not the child.

A team's code quality improves during a code review period. The improvement is real - fewer bugs, cleaner architecture, better documentation. But some of the improvement is the observer effect: people write differently when they know someone will read it. If the reviews stop, some of the quality will persist (learned habits) and some will fade (performance for the audience). The measurement can't easily distinguish between the two.

<span class="kicker">WORKING WITH THIS</span>

## Measuring honestly

The observer effect can't be eliminated, but it can be understood and accounted for. The first step is acknowledging that any human system behaves differently when it knows it's being observed. This means that pre-announced evaluations, visible metrics, and declared observations are all measuring observed behaviour, not natural behaviour.

If you need to understand natural behaviour, use unobtrusive measures where possible - data that's generated as a byproduct of normal activity rather than through explicit measurement. Website analytics, transaction records, communication patterns - these capture behaviour that wasn't performed for the observer.

When observation is visible (as it often must be), account for the effect rather than ignoring it. Ask: how might the observation itself be changing what we're seeing? Is the improvement we're measuring genuine, or partly a performance for the measuring system? And consider whether the observer effect is sometimes the point: code reviews improve code partly through the observer effect, and that's fine. The awareness of observation drives better practice. The danger is only when you mistake the observed performance for the unobserved reality.

<span class="kicker">THE INSIGHT</span>

## The line to remember

You can't observe a human system without becoming part of it. The measurement isn't separate from the thing measured - it's a new element in the system.

<span class="kicker">RECOGNITION</span>

## When this is in play

You're seeing the observer effect when behaviour improves during an audit and reverts afterward. When a team performs differently when the boss is watching. When survey results don't match experienced reality. When a pilot programme shows great results that can't be replicated at scale - the pilot had the attention, the scale-up doesn't. When the system seems to know it's being tested.