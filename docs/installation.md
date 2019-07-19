# Installation

## Direct Download / CDN

https://unpkg.com/tv-ui/dist/tv-ui 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/tv-ui@{{ $version }}/dist/tv-ui.js
 
Include tv-ui after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/tv-ui/dist/tv-ui.js"></script>
```

## NPM

```sh
$ npm install tv-ui
```

## Yarn

```sh
$ yarn add tv-ui
```

When used with a module system, you must explicitly install the `tv-ui` via `Vue.use()`:

```javascript
import Vue from 'vue'
import tv-ui from 'tv-ui'

Vue.use(tv-ui)
```

You don't need to do this when using global script tags.

