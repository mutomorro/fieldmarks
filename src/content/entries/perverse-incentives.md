---
title: "Perverse Incentives"
oneLiner: "Incentive structures that reward the opposite of what you intended - the cobra effect"
alsoKnownAs: ["The cobra effect", "Misaligned incentives", "Incentive failure"]
theme: "measurement-and-signals"
tags: ["incentives", "unintended-consequences", "design", "behaviour"]
dotGrid:
  seed: 5729
  variant: "fixesThatFail"
related:
  - slug: "goodharts-law"
    note: "Perverse incentives often arise from Goodhart's Law - targeting a measure creates incentives to game it"
  - slug: "unintended-consequences"
    note: "Perverse incentives are a specific type of unintended consequence - the incentive drives behaviour opposite to the intent"
  - slug: "feedback-loops"
    note: "Perverse incentives create reinforcing feedback loops that amplify the problem the incentive was designed to solve"
  - slug: "system-traps"
    note: "Perverse incentives are a system trap - the structure reliably produces the wrong behaviour regardless of who's in the system"
  - slug: "catalytic-mechanisms"
    note: "Well-designed catalytic mechanisms avoid perverse incentives by aligning the mechanism tightly with the goal"
draft: false
---

<span class="kicker">THE IDEA</span>

## The reward that makes things worse

The British colonial government in Delhi, concerned about the number of venomous cobras, offered a bounty for every dead cobra brought in. Cobra killings increased. Then enterprising residents started breeding cobras - to kill them and collect the bounty. When the government discovered the farms and cancelled the programme, the now-worthless cobras were released. The cobra population ended up larger than before the bounty was introduced.

This is a perverse incentive - a reward structure that produces the opposite of the intended outcome. The logic of the incentive was sound: pay people to reduce cobras, cobra population decreases. But the incentive didn't control how people reduced cobras. It rewarded the output (dead cobras) without considering the behaviour the reward would generate (breeding cobras).

Perverse incentives are everywhere, and they share a common structure: the incentive targets a measurable output, people find the easiest way to produce that output, and the easiest way turns out to undermine the original goal. The problem isn't that people are dishonest. It's that people are rational - they respond to incentives as designed, not as intended. When the design is flawed, rational behaviour produces irrational outcomes.

<span class="kicker">IN PRACTICE</span>

## When doing the rewarded thing is the wrong thing

A software company pays developers a bonus for every bug they fix. Bug fix rate soars. So does the rate of bugs introduced in new code. Some developers realise they can maximise their bonus by writing buggier code and then fixing it. The incentive was supposed to improve quality. It rewarded the appearance of quality while degrading the reality.

A healthcare system pays hospitals per procedure performed. Hospitals perform more procedures. Not all of them are necessary. Preventive care - which would reduce the need for procedures - generates no revenue, so it's deprioritised. The sicker the population, the more the system earns. The incentive aligns the hospital's financial interest with more illness, not less. Nobody designed this outcome. The incentive structure produced it automatically.

A parent rewards their child with screen time for completing homework. The child rushes through homework to get to the screen. Homework quality drops. The child associates homework with an obstacle between them and what they want, rather than with learning. The incentive was supposed to motivate effort. It motivated speed. The reward structure turned homework into something to get through rather than something to engage with.

<span class="kicker">WORKING WITH THIS</span>

## Aligning the reward with the real goal

Before introducing any incentive, ask: if people optimise entirely for this reward, what behaviour would that produce? Not the behaviour you hope for - the behaviour that would maximise the reward with the least effort. If that behaviour isn't what you want, the incentive is perverse, and it will be found.

Design incentives that reward outcomes, not outputs, wherever possible. Paying for bug-free code is better than paying for bugs fixed. Paying for patient health outcomes is better than paying for procedures. Rewarding learning is better than rewarding homework completion. The closer the incentive aligns with the actual goal, the harder it is to game.

When perfect alignment isn't possible - and it often isn't - use multiple incentives that balance each other. If you reward speed, also measure quality. If you reward quantity, also track satisfaction. Make it hard to maximise one dimension without maintaining the others. And monitor for gaming. The moment an incentive is introduced, people will test its edges. Watch what happens and be willing to adjust quickly.

<span class="kicker">THE INSIGHT</span>

## The line to remember

People don't do what you want. They do what you reward. If the reward doesn't match the goal, rational people will reliably produce the wrong outcome.

<span class="kicker">RECOGNITION</span>

## When this is in play

You're seeing perverse incentives when a reward programme produces more of the problem it was designed to reduce. When people are doing exactly what the incentive encourages and the results are getting worse. When gaming the system is more rational than doing the actual work. When someone says "the incentives are wrong" - they're almost always right, and the structure needs redesigning, not the people.