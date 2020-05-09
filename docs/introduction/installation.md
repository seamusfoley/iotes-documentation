---
id: installation
title: Installation
---
To install the stable version:

```
npm install iotes
```

This assumes you are using npm as your package manager.

To use Iotes you will also require a connection strategy which tells Iotes how to connect to an external service. More information about different strategies and there individual requirements are avaliable in the [strategies section of this documentation](../strategies/mqtt.md)

You currently cant use Iotes without a module bundler. We may consider providing a UMD build if there is demand.

The Iotes source code is written in Typescript but we precompile to ES5 so they work in any modern browser.

## Plugins

Plugins wrap the Iotes core for direct use in different environments. To use a plugin you install the plugin package **instead of** installing Iotes directly. For example the easiest way to use Iotes with modern React is to use the [react-hooks plugin](/docs/plugins/react-hooks)

```
npm install iotes-plugins-react-hooks
```

(you will still need a strategy in order to connect to your iot service)

At the moment plugins are only avaliable for react hooks 
