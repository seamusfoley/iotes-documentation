---
id: motivation
title: Motivation
---


Most clients and protocols for connecting IOT devices to a webpage are fairly similar in their design if not their detail. The client etablishes stateful connection to a broker a hub or a device, an then receives or transmits a stream of messages over that connection until that connection is closed.

The actual impelmentation of how you set up this connection and start receiving messages differs from library to library and protocol to protocol, sometimes you set up a connection and then set up the devices as a callback, sometimes the connection is global and then you connect the devices and many other variations.

From the point of view of your ui though, particually when using a declartive ui, your 'device components' (ie the components representing decive state) dont really care about the connection state to the host or device. They just want to receive data and update the ui. To acheive this you often end up proxying the device object in some way until the connection is ready or the device exists and then swapping in the actual data. The same goes for the connection to the host. The ui wants to respond to connection changes but doesnt want to be reponsible for managing the connection set up. 

One solution is to set up a device stream that exists syncronously, and then listen on that stream for whenever information comes through from the desired device, regardless of connection status. Then you could set up a host stream in the same manner to provide connection status updates.

This is how Iotes handles iot connections. The strategy handles the connection details and specifics, and passes that to the core which sets up the streams for ui components to use. 

## Origins

Iotes originates from the digital team at wtc in Bristol, U.K. wtc is a science mueseum with interactive exhibits that often connect to sensors, physical controls or building management systems. One of the challenges with building exhibits in museums is that generally software is funded up front as part of wider physical exhibition build and then receive very few updates over the life of the physcial exhibition, which is generally contracted to be 8 to 10 years. 

During that period some sensor or physical device will fail and the part will be irreplacable due to no longer bein manfactured etc. If the exhibit software is tightly bound with a specific api throughout the application code then the whole exhibit will, in some cases be, unrepairable. Iotes design came from techniques that wtc uses to isolate the ehibits from dependance on specific phtsical devices or apis.








