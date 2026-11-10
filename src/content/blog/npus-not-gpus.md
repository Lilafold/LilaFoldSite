---
title: Why we are researching NPUs instead of GPUs
cover: NPU first
coverSub: What we plan to measure, and why
excerpt: NPUs are chips built only for AI. Here is why we are looking at them for small models, and how we plan to test the idea before building anything.
date: 2026-11-10
author: LilaFold team
tags: research, hardware
---

Almost all AI today runs on GPUs. They are powerful and flexible, and for training very large models they are hard to beat. For running small models, day after day, we think there may be a better fit.

## What an NPU is

An NPU, or neural processing unit, is a chip designed only for the maths that neural networks use. Many recent laptop and phone chips include one. Because it does less than a GPU, it can be smaller and use less power for the work it is built for.

## Why it might suit small models

Our models are small by design, roughly 100M to 500M parameters each. A model that size does not need a data-centre GPU to run. If an NPU can run it fast enough, it could do so at a fraction of the power and cost, on hardware small enough to sit on a desk or in a rack.

That is the idea behind our modular hardware: compact modules you can start with one of and add to as you need more.

## How we plan to test it

This is a research question, not a conclusion. Before we design any hardware we want to measure, on real models:

- **Performance:** how fast each chip answers, and how many requests it can handle at once.
- **Power:** how much energy each answer takes.
- **Memory:** how much model fits, and how quickly the chip can read it.
- **Cost:** what the hardware costs for the work it does.

We plan to compare NPUs against integrated GPUs and dedicated GPUs on the same models, so the comparison is fair.

## What we will not assume

Connecting modules together does not automatically let them act as one big computer. Splitting a single large model across several modules is a hard problem, and it is part of our research, not a promise. What we can say is that several modules can run several models side by side.

We will publish what we find here, including results that do not go our way.
