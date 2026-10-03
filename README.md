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

Include `layout/header.css` and `layout/footer.css` in the page head, then `layout/header.js` and `layout/footer.js` before `</body>`. The shared markup lives in `layout/header.html` and `layout/footer.html`. Adjust the relative paths for the page's directory. Serve the site through a local web server so the component HTML files can be fetched.

## Zoom meeting workflow

On the HR meetings page, approve a request, choose **Schedule**, and use **Create meeting in Zoom**. After creating the meeting in Zoom, copy its invitation or join link back into the HR form. The form extracts a Zoom join URL, saves it with that request, and shows **Join now** in both HR and employee views. The clipboard button can paste the copied invitation on the same laptop.

Meeting requests and links currently use browser `localStorage`, so both views need the same browser and site origin. The page does not create a Zoom meeting through the API; that would require an authorized Zoom app and a backend to protect its credentials.
