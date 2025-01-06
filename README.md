Uses visual-dom-diff and a hidden iframe to visualise two different versions of a page. Useful for various testing and reporting purposes on staging sites.

NOTE: visual-dom-diff only works nicely on pages where there's a nice container div whose children are all the visible components on the page. This script assumes that div exists and has class "site-container". Search for that in src/index.ts and change the selector if necessary.

Also assumes the page it's served along with has a meta tag containing the alternate version URL, eg <meta name="variation-url" content="https://staging.mysite.com">

Include like this:

```javascript
<link href="/pagecmp.css" rel="stylesheet">
<script src="/pagecmp.js" type="application/javascript">
```

Build like this:

```bash
nvm install
nvm use
npm install
npm run build
```
