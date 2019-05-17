# How to contribute

### Running on a local machine:
In order to contribute you'll need to first fork this repo and clone it to your local machine. You'll also need to run `npm i --save-dev`.  
You'll notice that this package is written in TypeScript: that makes it so that your code editor (if it has type support like VSCode or Atom) will help you by showing you docs and types.  
The downside of that is that you won't be able to directly require the `.ts` files: if you want to run an example you have two options:

- You can edit the source and place your test in the `tests/test.js` file (run `npm run build` to compile it for the first time and allow support). You can then run `npm run test`: npm will first use TypeScript to compile the source into the `dist` folder, then run the package with your test.
- You can edit the source and run `npm run build`. After that, run `npm link` to associate this package folder with the package globally on your machine. You can then require it in a different project and use your local version.

### Opening a PR:
When you're done with your edits, push them to your GitHub fork and open a pull request. Please open a single pull request for every fix/addition as it'll be easier to review.