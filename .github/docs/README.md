## Doc. pages

Additional documentation apart from `README.md` should be added here.  
This keeps the root directory clutter-free.

The `pages.yml` workflow deploys this folder to [Github Pages][ghp].  

You can:

- add `.html`, `.md` pages
- add assets, images, videos etc.

> **note:** use relative paths when referencing assets.

You can't:

- Add an `index.md` or `index.html`

The root `README.md` is copied here and compiled to `index.html` by the 
workflow, which sets it as the homepage.

### Manual deployment

You can manually trigger a doc. deployment:

Select `Actions` -> `Deploy docs` -> `Run workflow`
