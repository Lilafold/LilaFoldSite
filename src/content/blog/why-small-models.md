---
title: Why we are betting on small models
cover: Small models, serious work
coverSub: The case for one model per job
excerpt: General models try to know everything. We think most real work needs a model that knows one field very well, and is small enough to own.
date: 2026-11-10
author: LilaFold team
tags: research, models
featured: true
---

Most AI today is rented. You send your data to someone else's data centre, a very large general model reads it, and you pay by the token. For a lot of tasks that works. For a lot of others it is the wrong shape of tool.

LilaFold starts from a different bet: that much of the useful work businesses want from AI is narrow, repeated and private, and that a small model trained for one field can do that work well.

## One model per job

A general model spends its capacity on everything at once: poetry, tax law, cooking, code. When you only need it to read security alerts, most of that capacity is along for the ride. You still pay to run it, in memory, energy and money.

A specialised model is trained for one job. We are building models in the range of about 100M to 500M parameters, each focused on a single field. Small enough to run cheaply, small enough to run on hardware you control.

> Depth over breadth: a model trained for one field spends its capacity where it counts.

## Why we think this can work

Specialised compact models are not a new idea, and there are public examples of them doing well. Google Research's TimesFM-3, released in August 2026, is a 330M-parameter model for time-series forecasting that reports strong results on public forecasting benchmarks. It is a useful reference point for what a focused model of that size can do. It is not our model, and we do not build on it.

Our job now is to show the same principle holds in the fields we care about, with our own models and our own measurements.

## Where we are starting

Our first model is for **cybersecurity**: log triage, threat explanations and alert summaries. It is a good first field because the work is high-volume, the language is specialised and the data is often too sensitive to send outside the network.

After that we are exploring:

- Freight and logistics
- Software engineering
- Forecasting
- Research workflows

## What comes next

The first model is in development. We will share what we learn here as we go, including what does not work. If you want to try the models when our cloud opens, [join early access](/#join).
