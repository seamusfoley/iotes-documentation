---
id: what-is-iotes
title: What Is Iotes?
---

## What is IOT?

**IOT** stands for **Internet of Things**.

The Internet of Things is a loose collection of ideas around how physical devices connect to and send messages over the internet.

Physical devices could be anything from environmental sensors that report on air quality for a city, to a fridge that alerts you when your food's about to go off. 

The devices don't necessarily have to be physical. The 'device' could be a button on an app and or a website, like it is in our [mqtt example](docs/introduction/example).

Which means IOT could be just about anything which connects to the internet...

![Whatever](https://media1.giphy.com/media/3o6nUNDHrGyYKslfH2/giphy.gif?cid=ecf05e471b24d9f726f3e0cf74274a319caeec95cb55463e&rid=giphy.gif)


## Is IOT useful for you?

Rather than asking 'Do I need IOT?' it can be more helpful to ask what characteristics do you want in your connections:

- **&#9989**  Do you want devices to be able to 'push' messages to each other or your application?
- **&#9989**  Is the likely period of the messages between 100 milliseconds and a few hours?
- **&#9989**  Is 'some' latency acceptable? **
- **&#9989**  Can the messages be serialized as a string?

If the answer to all these is **YES** then IOT may be for you.

** *We have used these protocols for things like physical button controls for a screen and the latency has been unnoticeable. However IOT protocols generally aren't designed specifically for very low latency*

#### However

- **&#10060**  Do you want 'no noticeable' latency (in a video chat application)?
- **&#10060**  Is the likely period between messages very low  (less that 100 milliseconds)?

Then you might be better off with another realtime focused approach

#### Maybe

- **&#9757**  Is period of data from your device relatively slow? Once a day for example? Then IOT protocols could be used but a REST endpoint might be simpler.  


#### Other Considerations 

- Power consumption

  Sometimes your devices will want to be battery powered and/or connected over a low bandwidth network. Because of this, IOT protocols are often designed to use as little power and data as possible.


## How does Iotes help?

Iotes takes a lot of the boilerplate work out of interacting with IOT client libraries, turning them from  chain of promises or callbacks *(i.e. Connect ***then*** Create a Device, ***then*** Set Up Event listeners, ***then*** handle Errors)* into a Host and Device stream that make IOT simple to integrate, particularly with declarative UI libraries like React. You can spend less time researching and trying different protocols and more time developing solutions. 


## What is Iotes not?

Iotes is not for building hardware or robotics devices. There are JavaScript Libraries for that.

[Johnny Five](http://johnny-five.io)
[Cylon](https://cylonjs.com)


## See it in action.

Check out the [examples]('/docs/introduction/examples) page to get a feel for how Iotes works, or just [get started]('/docs/introduction/getting-started')

