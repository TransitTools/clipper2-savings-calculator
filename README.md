# Clipper 2.0 Savings Calculator

Today, the Bay Area's transportation system is split into 27 different agencies serving different areas with different modes of transportation. Rail agencies operate separately from bus agencies, bus agencies stop at the county line or city line, and the entire system is fragmented and hard to get around.

The Clipper 2.0 Savings Calculator celebrates the coming implementation of the new Clipper 2.0 fare payment system, which will allow contactless card payments, as well as a system of effectively "free" transfers between different agencies: instead of the current 218 existing transfer rules, often a simple $0.50 discount at best, one simple rule will be in effect, with up to a $2.85 discount every time a rider tags onto a new vehicle.

### Development

Start the app in dev mode:

`$ npm run watch:ts`

Then start a webserver in the `public/` directory:

`$ $ python -m http.server -d public/`

### iframe embed

`/embed.html` contains only the trip calculator in an embeddable format. It is also available as a separate embed-only deployment.

### JavaScript embed

`/embed-js.html` demonstrates a calculator mounted into a single div. Add this
container and module script to an agency page:

```html
<div data-clipper-calculator data-color="3fa92a"></div>
<script type="module"
  src="https://clipper2calculator.transittools.dev/embed-loader.js"></script>
```

The loader creates the markup, loads the script and styles, and
runs the calculator inside a shadow root. Its height grows with the trip and its
CSS stays inside the shadow root. Multiple containers have independent state.
The optional `data-color` accepts three- or six-digit hex colors. Set
`data-trip="#adult#MA#SA;A;D#SO;zone:1;zone:1"` to preload a trip.
Shared links open the hosted calculator and preserve the trip and color; the
embed does not change the agency page's URL.


Pages with a Content Security Policy must allow scripts and connections to `clipper2calculator.transittools.dev` and Google Fonts.

### Data sources

Data for the existing fares and transfer schemes are taken from the Metropolitan Transportation Commission's [regional GTFS feed](https://511.org/open-data/transit), in particular, the `fare_*` files. In addition, the section of `stops.txt` defining BART stops has been imported as well.
