# HR-Management-System

##Trello :
https://trello.com/b/KfYFQ1h7/my-trello-board
-------
##Figma
https://www.figma.com/design/aWfk1DFm8dUlGnbCTTzprD/Untitled?node-id=0-1&t=GGmOITlN1rSINS8M-1

## Shared navigation and footer

Every implemented page includes the shared layout with just two placeholders:

```html
<div class="nav-bar"></div>
<!-- Page content -->
<div class="footer"></div>
```

Include `nav-bar/nav.css` and `Footer/footer.css` in the page head, then `nav-bar/nav-loader.js` and `Footer/footer.js` before `</body>`. Adjust the relative paths for the page's directory. Serve the site through a local web server so the component HTML files can be fetched.
