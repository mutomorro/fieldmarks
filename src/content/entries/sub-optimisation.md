---
title: "Sub-optimisation"
oneLiner: "Optimising one part of a system at the expense of the whole - every department hitting its targets while the organisation fails"
alsoKnownAs: ["Silo optimisation", "Part vs whole", "Local optimisation"]
theme: "boundaries-and-power"
tags: ["optimisation", "silos", "structure", "design"]
dotGrid:
  seed: 7294
  variant: "subOptimisation"
related:
  - slug: "local-vs-global-optimisation"
    note: "Sub-optimisation is local optimisation in action - what's best for the part damages the whole"
  - slug: "reductionism"
    note: "Sub-optimisation is reductionism applied to improvement - optimising parts separately and assuming the whole will follow"
  - slug: "boundaries"
    note: "Sub-optimisation happens when boundaries are drawn too tightly around parts, losing sight of the whole"
  - slug: "modularity"
    note: "Modularity protects the whole from cascading failure but too much separation can produce sub-optimisation"
  - slug: "interconnections"
    note: "Sub-optimisation ignores interconnections - improving one part without considering what flows between parts"
draft: false
---

<span class="kicker">THE IDEA</span>

## Perfect parts, broken whole

Sub-optimisation is what happens when each part of a system is improved independently and the overall system gets worse. It sounds paradoxical. It isn't. It's one of the most common failure modes in any system with divisions, departments, teams, or distinct components.

The mechanism is simple. Each part optimises for its own goals - its own metrics, its own efficiency, its own performance. These local optimisations often come at the expense of coordination, handoffs, and shared resources. The marketing team optimises for leads, flooding the sales team with unqualified prospects. The engineering team optimises for code quality, slowing releases to a crawl. The finance team optimises for cost control, cutting the investment that would generate next year's revenue. Each department is performing brilliantly. The organisation is failing.

The root cause is that systems have properties that belong to the whole, not to any part. Customer satisfaction doesn't live in any department. Organisational health doesn't belong to HR. Product-market fit doesn't belong to product or marketing. These whole-system properties can only be optimised at the whole-system level. Optimise the parts separately and you lose exactly the thing that matters most.

<span class="kicker">IN PRACTICE</span>

## When every metric is green and everything is broken

A hospital optimises each department independently. A&E reduces wait times by admitting patients faster. The wards weren't consulted, so they're overwhelmed with admissions they can't process. Discharge planning speeds up to clear beds, pushing patients out before they're ready. Readmissions spike. Each department hit its target. The patient experience deteriorated across the board. The system optimised its parts and degraded its purpose.

A household divides financial responsibilities. One person optimises the grocery budget by buying cheaper food. Another optimises the health budget by choosing a higher-quality gym. A third optimises the transport budget by taking the cheapest option. Individually, each budget looks good. Collectively, the family is eating poorly, spending more on health problems caused by poor diet, and losing hours to unreliable transport. The local optimisations undermined the global outcome: a healthy, functioning family life.

A software team splits into microservices, each team optimising their own service for performance and reliability. The services are excellent individually. But the interfaces between them - the API contracts, the data consistency, the error handling across boundaries - are nobody's primary responsibility. The system's failures now live in the gaps between the optimised parts. Each team's dashboard is green. The user experience is broken.

<span class="kicker">WORKING WITH THIS</span>

## Seeing the whole while improving the parts

The antidote to sub-optimisation is whole-system metrics that sit alongside local ones. Every part needs its own measures, but there must also be measures that only make sense at the level of the whole - customer experience end-to-end, total cost of delivery, time from request to fulfilment.

When improving a part, always ask: what does this change for the parts connected to it? If you speed up one stage, can the next stage absorb the increase? If you cut costs in one area, does that create costs somewhere else? The connections between parts are where sub-optimisation does its damage.

The organisational design question is: who is responsible for the performance of the whole, not just the parts? If nobody owns the whole-system performance, sub-optimisation is inevitable. Every part will optimise locally because that's what they're measured on, and the whole will degrade because nobody's measured on that.

<span class="kicker">THE INSIGHT</span>

## The line to remember

A system of perfect parts is not a perfect system. The performance that matters lives in the connections between parts, not inside them.

<span class="kicker">RECOGNITION</span>

## When this is in play

You're seeing sub-optimisation when every team reports good numbers but the overall outcome is poor. When improving one area consistently creates problems in another. When handoffs between parts are where quality, time, and information are lost. When departments compete for resources rather than coordinating for outcomes. When the question "who owns the whole thing?" doesn't have a clear answer.