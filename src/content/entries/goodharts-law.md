---
title: "Goodhart's Law"
oneLiner: "When a measure becomes a target, it ceases to be a good measure"
alsoKnownAs: ["Campbell's Law", "The cobra effect", "Gaming the metric"]
theme: "measurement-and-signals"
tags: ["measurement", "incentives", "targets", "failure"]
dotGrid:
  seed: 5294
  variant: "fixesThatFail"
related:
  - slug: "proxy-measures"
    note: "Goodhart's Law is what happens when a proxy measure becomes a target - people optimise the proxy, not the thing it represents"
  - slug: "feedback-loops"
    note: "Goodhart's Law corrupts feedback loops - the signal that was guiding the system becomes the thing the system games"
  - slug: "perverse-incentives"
    note: "Goodhart's Law is the mechanism behind most perverse incentives - the measure drives behaviour away from the intended goal"
  - slug: "system-traps"
    note: "Goodhart's Law creates a system trap - the better you get at hitting the measure, the further you drift from the goal"
  - slug: "unintended-consequences"
    note: "The unintended consequence of targeting a measure is that the measure stops measuring what it used to"
  - slug: "observer-effect"
    note: "The observer effect is the behavioural mechanism behind Goodhart's Law - people change behaviour when they know it's measured"
  - slug: "surrogate-measures"
    note: "Surrogate measures are Goodhart's Law fully realised - the measure has displaced the goal entirely"
draft: false
---

<span class="kicker">THE IDEA</span>

## The measure that eats itself

Charles Goodhart, an economist advising the Bank of England, observed something that should be printed on every dashboard, scorecard, and KPI report in existence: when a measure becomes a target, it ceases to be a good measure.

The logic is elegant and devastating. A measure is useful because it correlates with something you care about. Test scores correlate with learning. Citation counts correlate with research quality. Response time correlates with customer service quality. The measure isn't the thing itself - it's a signal that points toward the thing.

The moment you make that measure a target - the moment you reward people for improving it, punish them for missing it, or use it to make decisions about them - the relationship between the measure and the thing it measures breaks. People optimise for the measure, not for the underlying reality. They find ways to improve the number without improving the thing the number was supposed to represent. Test scores go up while learning stays flat. Citation counts rise through mutual back-scratching while research quality declines. Response times improve because agents rush callers off the phone while customer satisfaction drops.

<span class="kicker">IN PRACTICE</span>

## The number goes up, the reality goes sideways

A hospital is measured on A&E waiting times. The target: 95% of patients seen within four hours. The hospital hits the target by redefining "seen" (a brief triage counts), reclassifying patients (move them to a different department before the clock runs out), and focusing resources on the four-hour boundary rather than on clinical priority. The number improves. The patient experience doesn't. The measure that was supposed to drive better care is now driving better accounting.

A school is ranked by exam results. Teachers shift time from broad education to exam preparation. Subjects that aren't tested get less attention. Students near the grade boundary get disproportionate help because moving them across the line improves the metric most. Students well above or well below the boundary get less attention because they don't move the number. The school rises in the rankings. The education narrows to fit the measure.

A social media platform measures engagement - likes, comments, shares, time spent. The algorithm optimises for these metrics, surfacing content that provokes emotional reactions because emotional content generates engagement. The metric goes up. The quality of the experience goes down. The measure of a healthy platform (meaningful connection) has been replaced by a measure of an addictive one (engagement), and the system optimises relentlessly for the wrong thing.

<span class="kicker">WORKING WITH THIS</span>

## Measuring without corrupting

You can't avoid measurement. And you can't avoid the fact that measures influence behaviour. But you can design measurement systems that are harder to game.

Use multiple measures rather than one. A single target is easy to game. A balanced set of measures - where improving one at the expense of another is visible - is much harder. If you measure speed, also measure quality. If you measure quantity, also measure satisfaction. The game becomes harder when the player has to optimise several things simultaneously.

Separate the measure from the target. Use measures for learning - to understand what's happening in the system - rather than for judgement. The moment a measure is attached to rewards and punishments, Goodhart's Law activates. Measures used for curiosity stay honest. Measures used for accountability get gamed.

Rotate measures periodically. If people know the target will change, they're less likely to build elaborate systems for gaming the current one. And be willing to retire a measure when it's been corrupted - even if it's one you've invested heavily in tracking.

<span class="kicker">THE INSIGHT</span>

## The line to remember

A measure tells you something useful until you use it to control people. Then it tells you what people think you want to hear.

<span class="kicker">RECOGNITION</span>

## When this is in play

You're seeing Goodhart's Law when a metric improves but the reality it's supposed to represent doesn't. When people find creative ways to hit targets without achieving the underlying goal. When the conversation shifts from "how do we improve?" to "how do we improve the number?" When gaming the metric becomes more rational than doing the actual work. When a measure that was once informative becomes the subject of arguments about methodology - that's the measure being contested because it's become a weapon.