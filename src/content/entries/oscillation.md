---
title: "Oscillation"
oneLiner: "Systems that overshoot and undershoot because feedback arrives too late"
alsoKnownAs: ["Boom and bust", "Overcorrection", "Hunting"]
theme: "system-behaviours"
tags: ["cycles", "instability", "timing", "overcorrection"]
dotGrid:
  seed: 6147
  variant: "oscillation"
related:
  - slug: "feedback-loops"
    note: "Oscillation happens when a balancing feedback loop has a delay - the correction always arrives too late"
  - slug: "delays"
    note: "Delays are the root cause of oscillation - without them, systems would correct smoothly"
  - slug: "buffers"
    note: "Buffers dampen oscillation by absorbing the overshoot before it triggers a panicked correction"
  - slug: "stocks-and-flows"
    note: "Oscillation is visible in stocks - the level swings above and below where it needs to be"
draft: false
---

<span class="kicker">THE IDEA</span>

## The overshoot and the snap-back

You step into the shower and the water is cold. You crank the hot tap. Nothing happens for a few seconds - the hot water is still travelling through the pipes. So you crank it further. Suddenly the water is scalding. You yank the tap back toward cold. Too far. Now it's freezing again. You're oscillating - swinging back and forth around the temperature you want, overshooting each time because your correction is based on what the water felt like a few seconds ago, not what it feels like now.

This is what happens in any system where there's a delay between taking action and seeing the result. You act based on current conditions, but by the time the effect arrives, conditions have already moved. So you overcorrect. And then you overcorrect the overcorrection. The system swings above and below its target, sometimes settling down gradually, sometimes swinging wider with each cycle.

Oscillation isn't a sign that people are making bad decisions. It's a structural feature of systems with delayed feedback. The person in the shower is behaving perfectly rationally - responding to what they feel. The problem isn't the person. It's the gap between action and feedback. Understanding this changes how you respond: instead of making bigger corrections, you make smaller ones and wait.

<span class="kicker">IN PRACTICE</span>

## The swing that never quite settles

Hiring cycles in growing companies follow this pattern with remarkable regularity. Work piles up, so a team puts in a request to hire. The hiring process takes three months. During those three months, the team is drowning - so they request even more people. By the time the new hires are onboarded and productive (another delay), the original workload spike has passed. Now the team is overstaffed. The budget gets tightened. People leave and aren't replaced. Six months later, the team is drowning again. The oscillation isn't caused by bad planning. It's caused by the delay between recognising a need and filling it.

Commodity markets are built on oscillation. When the price of oil is high, producers invest in new drilling. But new wells take years to come online. By the time the extra supply arrives, demand has shifted and the price has dropped. Low prices discourage new investment, supply tightens, and prices rise again. The cycle repeats over years or decades, driven not by irrational actors but by the unavoidable delay between investment decisions and production.

Even your body oscillates. Blood sugar spikes after a sugary meal, so your pancreas releases insulin. But insulin takes time to work, so your body keeps releasing more. By the time the sugar is processed, there's too much insulin in your system. Blood sugar crashes. You feel hungry again. You eat more sugar. The cycle repeats - not because of weakness, but because of a delayed feedback loop between what you eat and how your body responds.

<span class="kicker">WORKING WITH THIS</span>

## Slow down the corrections

When you spot oscillation, the most natural instinct - reacting more forcefully - is exactly wrong. Bigger corrections don't settle the system down. They make the swings wider. The counterintuitive move is to respond less aggressively and wait longer between adjustments.

Ask: **how long is the delay between action and result in this system?** If you don't know, find out before changing anything. If the delay is three months, and you're adjusting course every two weeks, you're layering corrections on top of corrections that haven't had time to show their effects yet. You're steering by looking in the rearview mirror and yanking the wheel.

Buffers help enormously. If you can build slack into the system - spare inventory, cross-trained team members, flexible capacity - the oscillation doesn't hit as hard. The buffer absorbs the overshoot, giving the delayed feedback time to arrive before things get critical. The goal isn't to eliminate oscillation entirely (in most systems, you can't). It's to keep the swings small enough that they don't cause damage.

<span class="kicker">THE INSIGHT</span>

## The cure for oscillation is patience

Most oscillation is caused by people responding to outdated information with oversized corrections. The system doesn't need a bigger push. It needs a gentler one - and time to respond.

<span class="kicker">RECOGNITION</span>

## Knowing it when you see it

You're looking at oscillation when the same problem keeps coming back in cycles. When the response to a shortage creates a surplus, and the response to the surplus creates another shortage. When people say "we keep swinging between extremes." When a metric wobbles above and below target and nobody can get it to settle. When every correction seems to make things worse before they get better - and then worse again.
