---
title: Lala L1-Lite Ablation: a 3.3M attack detector that matches 1.5 to 3B LLMs
cover: Lala L1-Lite
coverSub: Tiny models for spotting attacks on Linux hosts
excerpt: Our first model reads a Linux host's event stream and flags attack steps. On our lab benchmark it matches or beats every small LLM we tried, and it runs on a CPU in seconds.
date: 2026-11-12
author: LilaFold team
tags: research, models, security
featured: true
---

Every Linux machine produces a constant stream of events: processes starting, files opening, connections being made. Buried in that stream, an attacker running `arp`, `getent` and `ps` to map out the machine looks a lot like an admin doing their job.

So we asked a simple question: how small can a model be and still pick those moments out reliably?

Our answer is **Lala L1-Lite**, our first model. Its building block is a small transformer with about 1.1 million parameters. **Lala L1-Lite Ablation** runs three of them together as an ensemble, 3.3 million parameters in total. It reads a host's events in order and gives each one a score. On our frozen lab benchmark it matches or beats every small language model we tried, including Qwen2.5 and DeepSeek-R1-Distill models up to 3 billion parameters. It needs no GPU, and it scores tens of thousands of events per second on a normal CPU.

## The results

We tested on 12 lab campaigns the model had never seen in training. That is 76,312 events, and only 388 of them are attack steps. Attacks are rare here, about 1 in 200, so we lead with PR-AUC. It is a score where a model guessing at random gets about 0.005 and a perfect one gets 1.0. It is harder to flatter than the more common ROC-AUC, which looks good for almost every model on data this lopsided. The isolation forest, for example, reaches 0.975 ROC-AUC and still catches nothing at a usable false alarm rate.

```plots
title: Accuracy vs. time
x: Time to score the full test set (log scale) | log | 8 | 4000 | 10=10 s, 60=1 min, 600=10 min, 3600=1 hour
y: PR-AUC (higher is better) | 0.76 | 0.92 | 0.78=0.78, 0.82=0.82, 0.86=0.86, 0.90=0.90
L1-Lite Ablation (CPU) | 15 | 0.89 | lead tag above #e879f9
Qwen2.5-1.5B | 660 | 0.85 | #22d3ee
DeepSeek-R1-Distill-1.5B | 1020 | 0.83 | #fb923c
Qwen2.5-3B | 1800 | 0.81 | #3b82f6
SmolLM2-1.7B | 1140 | 0.79 | #4ade80
line: Qwen2.5-1.5B, Qwen2.5-3B | #60a5fa
note: The four language models ran on an RTX 4090 with a linear probe on top. Lala L1-Lite Ablation ran on a desktop CPU. The classical baselines are left out because we did not time them.
---
title: Attacks caught vs. false alarms
x: Real false alarm rate on normal events (%) | linear | 0 | 1.3 | 0=0%, 0.25=0.25%, 0.5=0.5%, 0.75=0.75%, 1=1%
y: Attack events caught (%) | 0 | 100 | 0=0%, 25=25%, 50=50%, 75=75%, 100=100%
L1-Lite Ablation | 0.23 | 88 | lead tag above #e879f9
Qwen2.5-1.5B | 0.51 | 88 | #22d3ee
DeepSeek-R1-Distill-1.5B | 0.33 | 84 | #fb923c
Qwen2.5-3B | 0.21 | 77 | #3b82f6
SmolLM2-1.7B | 0.36 | 80 | #4ade80
LightGBM | 0.61 | 42 | #facc15
Logistic regression | 1.12 | 17 | #f87171
line: Qwen2.5-1.5B, Qwen2.5-3B | #60a5fa
note: Every model was asked for the same strict setting, about 1 false alarm per 1,000 normal events. The best place to be is the top left: more attacks caught, fewer false alarms.
```

The same numbers in a table:

| Model | Size | PR-AUC | Time for the full test set |
|---|---|---|---|
| **Lala L1-Lite Ablation** | **3.3M** | **0.89** | **About 15 seconds, on a CPU** |
| Qwen2.5-1.5B + linear probe | 1.5B | 0.85 | About 11 minutes, on an RTX 4090 |
| DeepSeek-R1-Distill-Qwen-1.5B + linear probe | 1.8B | 0.83 | About 17 minutes, on an RTX 4090 |
| Qwen2.5-3B + linear probe | 3.1B | 0.81 | About 30 minutes, on an RTX 4090 |
| SmolLM2-1.7B + linear probe | 1.7B | 0.79 | About 19 minutes, on an RTX 4090 |
| Logistic regression | n/a | 0.31 | CPU |
| LightGBM | n/a | 0.27 | CPU |
| Isolation forest | n/a | 0.10 | CPU |

At the strict setting, with a target of about 1 false alarm per 1,000 normal events, Lala L1-Lite Ablation caught 88% of attack events with a real false alarm rate of 0.23%. The best language model caught the same 88% with more than twice the false alarms. Across all 12 test campaigns, Lala L1-Lite Ablation raised at least one alert in every single one.

## How sure are we?

With only 12 test campaigns, we resampled whole campaigns to get a realistic range around each number.

| | Value | 95% range |
|---|---|---|
| Lala L1-Lite Ablation PR-AUC | 0.89 | 0.77 to 0.96 |
| Lala L1-Lite Ablation attacks caught at the strict setting | 88% | 76% to 96% |
| Lala L1-Lite Ablation's PR-AUC lead over Qwen2.5-1.5B + probe | +0.045 | -0.03 to +0.08 |

Lala L1-Lite Ablation came out ahead in 91% of the resamples. So on this test set, Lala L1-Lite Ablation and the best language model probe are close on accuracy, and we won't claim more than that. What isn't close is the cost: a 3-million-parameter model on a CPU against a 1.5-billion-parameter model on a GPU.

> "Across 76,312 Linux host events in 12 unseen lab campaigns, the 3.3M-parameter Lala L1-Lite Ablation ensemble achieves 0.89 PR-AUC in 15 seconds on a desktop CPU — outperforming 1.5B to 3B parameter language model probes running on an RTX 4090."

## Does it work on campaigns it has never seen?

After the main benchmark, we scored Lala L1-Lite Ablation on five more lab campaigns it had never seen in training or testing. Four of them come from a newer collector that also records full command lines, so the input looks different from the main test set. We left out other unseen campaigns that were reruns of training campaigns, because a model can partly recognise a rerun.

On those five campaigns, with 130 attack events, it scored a PR-AUC of 0.80, caught 73% of attacks, and had a false alarm rate of 0.10%. It raised an alert in all five. The drop from 0.89 to 0.80 is about what we would expect on new data, but it holds up.

We also tried some simple evasion on the main test set, changing only the attack events.

```chart
How well Lala L1-Lite Ablation ranks attack events when the attacker tries to hide (PR-AUC)
Unmodified | 0.89 | Catches 88% of attacks
Attack tools renamed to the host's most common process | 0.91 | Catches 94%
Attack tools copied to random names | 0.80 | Catches 75%
Collector records no command lines | 0.70 | Catches 60%
```

Disguising tools as a common process didn't help the attacker, because Lala L1-Lite Ablation looks at the sequence of events, not just names. Random renaming costs some accuracy. Losing command lines costs the most, so Lala L1-Lite Ablation works best with a collector that records them.

## How we tried to keep it honest

Security machine learning has a habit of producing near-perfect numbers that fall apart in the real world, usually because the model found a shortcut that won't exist outside the lab. We built the evaluation to rule that out.

- **A frozen split.** We fixed the test campaigns before evaluating any model, and held out whole campaigns. Reruns and near-duplicates of a test campaign stayed out of training too, so a model can't memorise a run and recognise it later.
- **No hints from the labels.** Labels, attack-step IDs, technique IDs and severity were removed before any model saw an event.
- **No lab-only shortcuts.** We also removed signals that only work in our lab, such as raw process IDs, timestamps, where an event sits in a campaign, how long the campaign is, and the user IDs of our lab accounts. A test suite checks that no single feature can predict the label on its own.
- **The test set never sets the threshold.** The alert threshold is set per host from the first 30% of that host's own events, without labels, and those events are never scored. That is also how we recommend deploying it, since every host's idea of normal is different.
- **The same inputs for everyone.** Every model, language models included, saw the same events in the same order and was scored by the same code.

## What about the big models?

General-purpose language models know a lot about Linux, so we gave four small ones a fair shot. We ran them locally, so no telemetry ever left the machine, and tried two approaches.

First, we simply asked. We showed the model an event and the four before it and asked whether it looked like part of a scripted attack. All four scored close to random. Out of the box, small LLMs can't do this job.

Second, we froze the model and trained a small classifier on top of what it had learned internally. That is where they came alive, scoring 0.79 to 0.85. They do well because pretraining already taught them that commands like `arp`, `getent` and `uptime` are reconnaissance, even when those never show up as labelled attacks in our training data.

Two other things surprised us. Bigger was not better: the 3B model scored below the 1.5B one, and the two models with larger internal representations scored lowest, which suggests the classifier overfits when it has few attack examples to learn from. And reasoning models didn't help. The reasoning-tuned DeepSeek model landed right next to the Qwen model of the same size. This task is scored in one pass, so its reasoning never gets a chance to matter.

Lala L1-Lite Ablation led the table at about 1/460th the size of the smallest language model, with no GPU and no tokenizer. It processes about 28,000 events per second on a desktop CPU with around 1 GB of memory. For comparison, each language model read about 13 million tokens to score the same test set.

## Where it works best

```chart
Lala L1-Lite Ablation PR-AUC by attack type
User and owner discovery | 1.00
Host identity | 0.95
Shell script execution | 0.81
Admin tools mixed with attacks | 0.77
Endpoint discovery | 0.77
Network connection discovery | 0.71
```

Each type has only 32 to 140 attack events behind it, so read these as hints, not precise numbers.

## What this does not show

We would rather say this plainly than have you find out later.

- **This is lab data.** The attacks are scripted and the normal activity comes from a traffic generator. Real servers are messier. Admins run discovery-style commands such as `ps`, `uname` and `who` far more often than our generator does, so we expect every model in the table to score lower on real hosts.
- **The test set is small.** With 388 attack events across 12 campaigns, differences of a few points between models are within noise.
- **Coverage is partial.** The test set covers discovery and execution techniques. We don't have held-out data yet for credential access, persistence, privilege escalation, defence evasion or collection, and we make no claims about them.
- **Admin work that looks like recon still triggers alerts.** Our lab plants legitimate commands that resemble reconnaissance, such as `id` and `who`. At the strictest setting, Lala L1-Lite Ablation alerts on 14% of them, against 0.2% of ordinary normal events. This is the main thing we are working to reduce.
- **Expect some alert volume.** At the strict setting, our lab hosts saw a median of 1 to 6 false alerts per hour, depending on how busy the host was. Busier production hosts will see proportionally more.
- **Each host needs its own calibration.** Thresholds learned on our training campaigns don't carry over to new machines. Lala L1-Lite Ablation has to learn what normal looks like on each host first.
- **The baseline has to be clean.** That calibration uses the first 30% of a host's events, which are never alerted on. If a host is already compromised when monitoring starts, attacks in that window will be missed.

## What's next

The big open question is real-world traffic. Next, we are validating on live hosts with realistic everyday activity, and filling in the attack types our test set doesn't cover yet.

Model checkpoints, evaluation scripts, and the full model card are available on [Hugging Face (LilaFold/lala-l1)](https://huggingface.co/LilaFold/lala-l1) and [GitHub (Lilafold/lala-l1)](https://github.com/Lilafold/lala-l1). Lala L1-Lite is a small piece of a bigger idea at [LilaFold](https://lilafold.io/): a lot of useful work can be done by small, specialised models that are cheap enough to run anywhere. If you want to follow along, or you run Linux hosts and would like to try it, [sign up for early access](https://lilafold.io/#join).
