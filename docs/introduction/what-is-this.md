---
id: what-is-this
title: What Is This?
---

## What is IOT?

IOT stands for Internet of Things.

The Internet of Things is a loose collection of ideas around physical devices that connect to the the internet.

Those physical devices could be anything from environmental sensors that report on air quality for a city, to a fridge that alerts you when your food's about to go off. 

The devices dont neccessarily have to be physical either. The 'device' could be a button on an app and or a website, like it is in our [mqtt example](docs/introduction/example).

Which means IOT could be just about be anything...

![Whatever](https://media1.giphy.com/media/3o6nUNDHrGyYKslfH2/giphy.gif?cid=ecf05e471b24d9f726f3e0cf74274a319caeec95cb55463e&rid=giphy.gif)

## Is IOT helpful?

When making a desicion it more helpful to ask what characteristics do you want.

Ask yourself these questions:

- **&#9989**  Do you want devices to be able to 'push' messages to each other or your application?
- **&#9989**  Is the likely period between the messages between 100 milliseconds and a few hours?
- **&#9989**  Is 'some' latency acceptable? **
- **&#9989**  Can the messages be serialized as a string?

If the answer to all these is **YES** then IOT may be for you.

** *We have used these protocols for things like physical button controls for a screen and the latency has been unnoticable. IOT protocols generally aren't designed specifically for very low latency though*

#### However

- **&#10060**  Do you want 'no noticable' latency (in a video chat application)?
- **&#10060**  Is the likely period between messages very low  (less that 100 milliseconds)?

Then you might be better off with another realtime focused approach

#### Maybe

- **&#9757**  Is period of data from your device resonably slow? Once a day for example? Then IOT protocols could be used but a REST endpoint might be simpler.  



#### Other Considerations 

- Power consumption

  Sometimes your devices will be battery powered. IOT protocals are often specifically designed to use as little power as possible for exactly this reason.














# What does Iotes do






