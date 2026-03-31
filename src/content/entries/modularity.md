---
title: "Modularity"
oneLiner: "Systems made of loosely connected parts that can fail independently without bringing down the whole"
alsoKnownAs: ["Loose coupling", "Compartmentalisation", "Decoupling"]
theme: "resilience-and-change"
tags: ["design", "resilience", "structure", "architecture"]
dotGrid:
  seed: 6185
  variant: "subOptimisation"
related:
  - slug: "resilience"
    note: "Modularity is a key design principle for resilience - failure in one module doesn't cascade to the rest"
  - slug: "redundancy"
    note: "Modularity and redundancy work together - modular systems can have redundant components that back each other up"
  - slug: "interconnections"
    note: "Modularity is about managing interconnections - keeping modules loosely connected so failure doesn't propagate"
  - slug: "sub-optimisation"
    note: "The tension: modularity protects the whole by limiting integration, but too much separation is sub-optimisation"
  - slug: "complexity-vs-complication"
    note: "Modularity helps manage complexity by containing it within units - each module can be complex internally while being simple externally"
  - slug: "sub-optimisation"
    note: "Too much modularity can produce sub-optimisation - parts that work perfectly in isolation but don't coordinate"
draft: false
---

<span class="kicker">THE IDEA</span>

## Walls that protect

In a modular system, the parts are relatively self-contained. They connect to each other through defined interfaces, not through deep entanglement. When one part fails, the failure stays contained. The rest of the system continues to function.

Think of a ship with watertight compartments. A breach in one compartment floods that section, but the sealed bulkheads prevent the water from reaching the rest. The ship survives damage that would sink an open-hulled vessel. The modularity doesn't prevent the breach. It prevents the breach from becoming a catastrophe.

The same principle applies everywhere. A software system built as independent services can lose one without crashing the whole application. An organisation with autonomous teams can have one team in crisis without paralysing the others. A personal life with separate domains - work, family, friends, hobbies - can take a hit in one area without everything collapsing.

The cost of modularity is efficiency. Tightly integrated systems can be faster, more coordinated, and less duplicative. But they're also more fragile, because a problem anywhere can propagate everywhere. Modularity trades some coordination for a lot of containment. In stable, predictable environments, that trade-off might not be worth it. In volatile, surprising ones, it's the difference between damage and disaster.

<span class="kicker">IN PRACTICE</span>

## Containing the damage

The internet was designed as a modular network. Packets route around damage. Servers operate independently. No single node is essential to the whole. This is why a data centre can catch fire and most users don't notice. The architecture contains failures locally. Compare this to a centralised system where everything routes through one hub - efficient until the hub fails, at which point everything fails.

A restaurant group runs each location as a semi-autonomous unit with its own suppliers, its own staff, and its own management, sharing only the brand and some central functions. When one location faces a health inspection failure, it's contained. The other locations keep serving. An alternative model - centralised kitchens, shared staff pools, integrated supply chains - is more efficient but means a supply chain problem hits every location simultaneously. Modularity costs more per unit but protects the network.

A person's identity is modular when their sense of self doesn't depend entirely on one domain. If someone's entire self-worth comes from their career, losing the job doesn't just affect income - it collapses identity, social connections, daily structure, and purpose simultaneously. A more modular identity - where work, relationships, creative pursuits, and community involvement are distinct sources of meaning - can absorb a loss in one area because the others remain intact.

<span class="kicker">WORKING WITH THIS</span>

## Designing for containment

When designing any system, ask: if this part fails, what else fails with it? If the answer is "everything," you have a modularity problem. The connections between parts are too tight. A failure in one propagates through the whole.

The fix is creating boundaries between components - not walls that prevent communication, but bulkheads that prevent cascading failure. Each module should be able to operate independently, even if it operates better when connected. The interfaces between modules should be defined and limited, so that what passes between them is controlled.

The tension to manage is between integration and isolation. Too much integration and failures cascade. Too much isolation and the system can't coordinate. The sweet spot is loose coupling - modules that communicate through clear, limited interfaces and can survive alone if they need to. This applies to software architecture, organisational design, personal life structure, and almost any system where a single point of failure could bring down the whole.

<span class="kicker">THE INSIGHT</span>

## The line to remember

The strength of a modular system isn't that its parts don't fail. It's that when they do, the failure knows where to stop.

<span class="kicker">RECOGNITION</span>

## When this is in play

You're seeing modularity when a failure in one area doesn't spread to others. When a team can operate autonomously during a wider organisational crisis. When a system degrades gracefully rather than collapsing entirely. You're seeing its absence when a small problem in one department paralyses the whole organisation. When a relationship breakup seems to take every other area of life down with it. When everything is so tightly integrated that you can't change one thing without changing everything.