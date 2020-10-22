# Take Home Challenge

## Setup
1. Setup node & npm. I'm using `v12.16.1` but I'd imagine most other versions work just fine as well.
2. Install packages. `npm i`.
3. `npm start` to start the server and begin compiling assets.
4. `npm build` if you want to build the files for production.

## Implementation Notes
- I could have used React. But considering the complexity of the form, it didn't seem worth while to add the extra [109kb(unzipped)](https://reactjs.org/blog/2017/09/26/react-v16.0.html#:~:text=react%20is%205.3%20kb%20(2.2,kb%20(6.9%20kb%20gzipped).) to the payload.
- Some may say Gulp is super old, but I felt Webpack was a bit overkill for something like this.
- I am using Babel for some small things. I really just love [optional chaining](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining).
- There is a "reset" button in the bottom right corner for resetting the form.
- Data is saved via `sessionStorage` so it will persist upon refresh.
- I'm leveraging a lot of HTML5 validation. I prefer this as it usually handles a lot of the a11y heavy lifting for you.
- Some of the colors have A11Y violations due to contrast. Ideally we'd go back to UX and explore possibly finding better color combinations. [White on mint](https://color.a11y.com/ContrastPair/?bgcolor=19cca3&fgcolor=ffffff). [Ocean on Lavender](https://color.a11y.com/ContrastPair/?bgcolor=E3EBFC&fgcolor=356AE6).
- I chose `em` units with a base `font-size: 18px;` on the `<body>`. Mostly just chose this for speed as I was eyeballing the sizes in the PDF.
