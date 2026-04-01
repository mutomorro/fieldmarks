---
title: "Rule Beating"
oneLiner: "People find ways to comply with the letter of a rule while violating its spirit - and the system gets what it measures, not what it wants"
alsoKnownAs: ["Gaming the system", "Goodhart's Law in action", "Perverse compliance"]
theme: "systems-archetypes"
tags: ["incentives", "measurement", "rules", "behaviour"]
dotGrid:
  seed: 9173
  variant: "ruleBeating"
related:
  - slug: "feedback-loops"
    note: "Rules create feedback loops that shape behaviour - but the behaviour shaped isn't always the behaviour intended"
  - slug: "unintended-consequences"
    note: "Rule beating is the unintended consequence of well-intentioned rules that target the wrong thing"
  - slug: "boundaries"
    note: "Rules draw boundaries around what's measured and enforced - rule beating exploits what's outside those boundaries"
  - slug: "eroding-goals"
    note: "When rule beating makes the metric look good while the underlying reality gets worse, the goal has effectively eroded"
  - slug: "fixes-that-fail"
    note: "A rule designed to fix a problem often fails when people find ways around it while technically complying"
draft: false
---

<span class="kicker">THE IDEA</span>

## The letter, not the spirit

A rule says: reduce hospital waiting times to under four hours. The intention is that patients get treated faster. What happens in practice? Some hospitals start the clock later. Others move patients to a different queue that technically counts as "admitted." Others discharge patients who haven't been fully treated, then readmit them as new cases. The waiting time metric improves. The patient experience doesn't. The rule has been beaten.

Rule beating is what happens when a system creates a rule or a measure, and the people subject to it find ways to satisfy the measurement without achieving the purpose behind it. It's not cheating, exactly - the rule is technically being followed. It's not malice - people usually aren't trying to cause harm. It's a structural response to a system that measures one thing but wants another.

**The deeper pattern is this: a rule can only control what it specifies. Everything it doesn't specify becomes a degree of freedom - space for people to optimise in ways the rule-maker didn't anticipate.** The more a rule tries to force a particular outcome, the more creative people become at finding paths around it that technically comply. And the more rules are added to close the loopholes, the more complex and fragile the system becomes.

<span class="kicker">IN PRACTICE</span>

## Getting what you measure, not what you want

A school system introduces league tables based on exam results. Schools want to rank well. One way to improve results is better teaching. Another way - faster, cheaper, and more certain - is to encourage weaker students to take easier exams, or to focus resources on students near the grade boundary who might be pushed over, while neglecting both struggling students and high achievers. The league table improves. The education doesn't necessarily improve with it. The schools are responding rationally to the incentive. The incentive just isn't aligned with the purpose.

Speed cameras are placed on a stretch of road to reduce accidents. Drivers learn where the cameras are. They brake sharply before each camera and accelerate after it. Average speed across the road might actually increase, because drivers go faster between cameras to make up time. Accidents may shift to the stretches without cameras. The rule (don't exceed the limit at this specific point) is obeyed. The intention (safer driving overall) is not achieved. The system got exactly what it measured.

A software team is measured on the number of features shipped per sprint. The incentive is clear: ship more features. So features get smaller. Complex work gets broken into tiny increments that technically count as separate features. Quality checks are rushed because they slow down the count. The dashboard shows an impressive feature velocity. The product, meanwhile, accumulates rough edges, unfinished flows, and technical debt. The team is hitting every metric. The product is getting worse.

<span class="kicker">WORKING WITH THIS</span>

## Measure the purpose, not just the proxy

The first defence against rule beating is to be clear about what the rule is trying to achieve and then **measure as close to the actual purpose as possible.** If the goal is patient care, measure patient outcomes, not just waiting times. If the goal is education, measure what students can do, not just what grade they got. The closer the metric is to the real objective, the harder it is to game.

Watch for the signs of gaming early. When a metric improves sharply without a visible change in the underlying reality, something is being gamed. Ask the people subject to the rule how they're achieving the results. They'll usually tell you - often with some pride in their ingenuity. The information is there. It just needs someone willing to ask and willing to hear the answer.

Accept that all rules will be beaten to some degree, and design with that in mind. Instead of trying to create an unbeatable rule (impossible), create a portfolio of measures that make gaming any single one pointless. If the speed measure, the quality measure, and the customer satisfaction measure all have to improve together, it's much harder to game one without exposing the problem through the others.

<span class="kicker">THE INSIGHT</span>

## A system gets what it measures

Every rule is an invitation to optimise - and people will optimise for what's measured, not what's intended. If the measurement and the intention aren't the same thing, the gap between them is where rule beating lives.

<span class="kicker">RECOGNITION</span>

## Knowing it when you see it

You're seeing rule beating when metrics are improving but the thing the metrics are supposed to represent doesn't feel like it's improving. When people talk about "hitting targets" with a knowing look. When workarounds and creative interpretations of rules are widespread and openly discussed. When the response to gaming is more rules, more detail, more compliance checks - and the gaming just gets more sophisticated. When someone says "technically, we're compliant" - the word "technically" is doing all the heavy lifting.
