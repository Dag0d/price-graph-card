# Price Graph Card

Home Assistant dashboard card for spot market electricity prices. The card renders a step graph or compact timeline, supports current price details, day switching, configurable color zones, extra information slots, and Home Assistant tap/hold/double-tap actions.

## Features

- Step graph and compact timeline view
- Today, tomorrow, and 2-day display modes
- Automatic or fixed price thresholds
- Currency and minor-unit display
- Extra information slots from attributes, entities, current price, price ranges, and averages
- Next occurrence of a selected dynamic price level
- Home Assistant tap, hold, and double-tap actions
- German and English editor/card labels

## Installation

### HACS

1. Add this repository as a HACS custom repository.
2. Select category `Dashboard`.
3. Install `Price Graph Card`.
4. Add the dashboard resource if Home Assistant does not add it automatically:

```yaml
url: /hacsfiles/price-graph-card/price-graph-card.js
type: module
```

HACS looks for dashboard plugin files in `dist/` first. This repository ships the built card as `dist/price-graph-card.js`, and HACS installs it as `price-graph-card.js` under `/hacsfiles/price-graph-card/`.

### Manual

Copy `dist/price-graph-card.js` into your Home Assistant `www` folder, for example:

```text
config/www/price-graph-card/price-graph-card.js
```

Then add the dashboard resource:

```yaml
url: /local/price-graph-card/price-graph-card.js
type: module
```

## Basic Configuration

```yaml
type: custom:price-graph-card
entity: sensor.electricity_price_metadata
view_mode: graph
show_day_buttons: true
day_view_default: today
unit_format: minor
detailed_colors: true
```

The card also includes a visual editor in Home Assistant.

## Full Example

```yaml
type: custom:price-graph-card
entity: sensor.electricity_price_metadata
view_mode: graph
height: 280
show_day_buttons: true
day_view_default: today
two_day_mode: span
unit_format: minor
detailed_colors: true
content_items_position: top
content_items:
  - label: Current
    source: current_price
    show_unit: true
  - label: Range today
    source: price_range
    range_day: today
    show_unit: true
  - label: Average today
    source: avg_price
    range_day: today
    show_unit: true
  - label: Source
    source: attribute
    attribute: last_successful_source_id
  - label: Battery
    source: entity
    entity: sensor.battery
    actions:
      enabled: true
      tap_action:
        action: more-info
```

## Expected Entity Attributes

The configured entity must expose a `data` attribute containing price points:

```yaml
currency: EUR
unit_of_measurement: EUR/kWh
data:
  - start_time: "2026-04-26T00:00:00+02:00"
    price_per_kwh: 0.2905
  - start_time: "2026-04-26T00:15:00+02:00"
    price_per_kwh: 0.2884
avg_today: 0.2009
min_today: -0.3739
max_today: 0.4226
p20_today: 0.0938
p70_today: 0.313
tomorrow_status: absent
```

Supported optional metrics:

- `avg_today`, `min_today`, `max_today`, `p20_today`, `p70_today`
- `avg_tomorrow`, `min_tomorrow`, `max_tomorrow`, `p20_tomorrow`, `p70_tomorrow`
- `avg_today_tomorrow`, `min_today_tomorrow`, `max_today_tomorrow`, `p20_today_tomorrow`, `p70_today_tomorrow`
- `today_rows`, `tomorrow_rows`, `tomorrow_status`, `timeline_status`

If threshold metrics are missing, the card computes them from `data`.

Tomorrow views become available when `tomorrow_status` is `ok` or `preview`, or when the card can detect a complete tomorrow timeline from `data`. Until then, tomorrow and 2-day views show a pending message.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `entity` | required | Entity with price timeline attributes. |
| `view_mode` | `graph` | `graph` or `timeline`. |
| `height` | `280` | Graph height in pixels. |
| `decimals` | `1` | Number of decimals for displayed prices. |
| `unit_format` | `currency` | `currency` or `minor`. |
| `currency_override` | `auto` | Use sensor currency, a known currency code, or `custom`. |
| `show_day_buttons` | `false` | Show today/tomorrow/2-day selector. |
| `day_view_default` | `today` | Initial day view when buttons are enabled. |
| `two_day_mode` | `span` | `span` or `overlay` for graph mode. |
| `detailed_colors` | `false` | Use cheap/normal/expensive/very expensive zones. |
| `use_fixed_p20` | `false` | Use a fixed threshold for normal prices. |
| `use_fixed_avg` | `false` | Use a fixed threshold for expensive prices. |
| `use_fixed_expensive` | `false` | Use a fixed threshold for very expensive prices. |
| `content_items` | `[]` | Extra information slots. |
| `content_items_position` | `top` | Show extra slots above or below the graph/timeline. |
| `content_items_max_cols` | `4` | Maximum extra slot tiles per row, `4` or `3`. |
| `tap_action` | unset | Home Assistant action configuration. |
| `hold_action` | unset | Home Assistant action configuration. |
| `double_tap_action` | unset | Home Assistant action configuration. |
| `debug` | `false` | Show debug information below the card. |

## Extra Content Slots

`content_items` can show values from attributes, other entities, the current price, price level, the next occurrence of a selected price level, price range, or average price.

```yaml
content_items:
  - label: Current
    source: current_price
    show_unit: true
  - label: Range today
    source: price_range
    range_day: today
    show_unit: true
  - label: Source
    source: attribute
    attribute: last_successful_source_id
  - label: Cheap again at
    source: next_price_level
    price_level: cheap
```

For `source: next_price_level`, the editor offers `below average` and `above average` with the simple two-color graph. With detailed colors enabled it offers `cheap`, `normal`, `expensive`, and `very expensive`. The lookup uses the exact same calculated or fixed thresholds as the graph.

Each extra slot can also define its own Home Assistant interactions. If no explicit target entity is set, actions use the slot entity for `source: entity` items and otherwise fall back to the main card entity.

```yaml
content_items:
  - label: Battery
    source: entity
    entity: sensor.battery
    actions:
      enabled: true
      tap_action:
        action: more-info
      hold_action:
        action: navigate
        navigation_path: /energy
      use_target_entity: true
      target_entity: sensor.battery
```

Supported slot action fields are:

- `actions.enabled`
- `actions.tap_action`
- `actions.hold_action`
- `actions.double_tap_action`
- `actions.use_target_entity`
- `actions.target_entity`

## Development

Source changes are made in `src/` and pushed to the Gitea `main` branch without a locally generated bundle.
The generated `dist/price-graph-card.js` is maintained exclusively by the Gitea build workflow and should not be edited by hand.

The Gitea workflow sequence:

1. installs the locked dependencies;
2. runs the unit tests and TypeScript check;
3. builds and syntax-checks `dist/price-graph-card.js`;
4. publishes the build-bot commit under a temporary Gitea CI branch;
5. marks the source and build commits as pending and dispatches the separate HACS workflow;
6. moves the validated commit to `main`, records the build, HACS and publication statuses, and always removes the temporary branch.

Published Gitea releases repeat the test and build checks and attach `price-graph-card.js` as a release asset. The bridge then validates a candidate in the permanent GitHub repository, promotes that exact commit to the permanent branch and release tag, and runs HACS once more on the published ref so the final commit carries the real GitHub check result.

A separate compatibility check validates the current `main` commit through a temporary GitHub repository every Monday at 02:49 UTC. It does not build or publish anything and records its result as `Weekly HACS Validation` on the checked commit.

## Cache Notes

After manually replacing the card file, reload the Home Assistant dashboard and clear the browser cache if the old version is still shown. HACS can also create a compressed `.gz` file for dashboard plugins; if you manually edit files inside the HACS community folder, remove the stale `.gz` file as well.

## Release Notes

The package uses calendar-style versions such as `2026.4.0`. When creating a GitHub release, the release workflow rebuilds `dist/price-graph-card.js` and uploads it as a release asset.

## License

MIT
