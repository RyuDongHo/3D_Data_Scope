# User Experience Checklist
**3D Data Scope - TYPE B (Manual/VibeCheck) Validation**

> **Generated**: 2025-11-27  
> **Test Type**: Manual User Acceptance Testing  
> **Tester Role**: QA Engineer / End User

---

## 🎯 Purpose

This checklist validates aspects that require human judgment:
- **Visual Design**: Layout, colors, spacing, aesthetics
- **User Experience**: Intuitiveness, flow, feedback clarity
- **Error Messages**: Helpfulness, tone, actionability
- **Accessibility**: Keyboard navigation, screen readers, color contrast
- **Performance Feel**: Responsiveness, smoothness, loading perception

---

## ✅ Checklist Format

Each item rated on scale:
- ✅ **Pass**: Meets expectations
- ⚠️ **Needs Improvement**: Functional but suboptimal
- ❌ **Fail**: Blocks good UX, needs fixing
- N/A: Not applicable for current version

---

## 📄 Section 1: Upload Page (/)

### Visual Design

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | Upload area is visually prominent and inviting | ⬜ | |
| 1.2 | Drag-and-drop zone has clear visual boundaries | ⬜ | |
| 1.3 | File icon/illustration enhances understanding | ⬜ | |
| 1.4 | "Choose File" button stands out appropriately | ⬜ | |
| 1.5 | Sample data button is clearly distinguished | ⬜ | |
| 1.6 | Color scheme is pleasant and not overwhelming | ⬜ | |
| 1.7 | Spacing between elements feels balanced | ⬜ | |
| 1.8 | Typography is readable (font size, weight) | ⬜ | |
| 1.9 | CSV Tutorial modal is easy to read | ⬜ | |
| 1.10 | Progress indicators (if shown) are clear | ⬜ | |

### User Experience

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.11 | Purpose of page is immediately obvious | ⬜ | |
| 1.12 | User knows what file formats are accepted | ⬜ | |
| 1.13 | Drag-and-drop area reacts to hover/drag | ⬜ | |
| 1.14 | "Try with Sample Data" button purpose is clear | ⬜ | |
| 1.15 | CSV Tutorial link is easy to find | ⬜ | |
| 1.16 | File upload feels instant (<1s perceived) | ⬜ | |
| 1.17 | Data preview appears without jarring transition | ⬜ | |
| 1.18 | User knows next step after upload | ⬜ | |
| 1.19 | "Next" button feels natural to click | ⬜ | |
| 1.20 | Page doesn't feel cluttered or overwhelming | ⬜ | |

### Error Messages

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.21 | File size error message is helpful | ⬜ | Example: "File too large (52MB). Maximum is 50MB." |
| 1.22 | Wrong file type error suggests solution | ⬜ | Example: "Only .csv files are supported. Try converting your Excel file." |
| 1.23 | Malformed CSV error explains the issue | ⬜ | Example: "Row 5 has 4 columns but header has 3. Please fix formatting." |
| 1.24 | Error messages use friendly tone (not technical jargon) | ⬜ | |
| 1.25 | Errors are visually distinct (red, icon) | ⬜ | |
| 1.26 | User knows how to recover from error | ⬜ | |

### Accessibility

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.27 | Can navigate page with Tab key | ⬜ | |
| 1.28 | File input has keyboard trigger (Enter/Space) | ⬜ | |
| 1.29 | Focus indicator is visible on all elements | ⬜ | |
| 1.30 | Screen reader announces upload area purpose | ⬜ | Test with NVDA/JAWS |
| 1.31 | Error messages are announced to screen readers | ⬜ | |
| 1.32 | Color contrast meets WCAG AA (4.5:1 text, 3:1 UI) | ⬜ | Use Contrast Checker tool |

---

## 🗺️ Section 2: Mapping Page (/mapping)

### Visual Design

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1 | Page header clearly states purpose | ⬜ | |
| 2.2 | Axis selectors are visually organized | ⬜ | |
| 2.3 | X/Y/Z labels use intuitive icons or colors | ⬜ | |
| 2.4 | Dropdowns are easy to identify as interactive | ⬜ | |
| 2.5 | Column statistics are readable and useful | ⬜ | |
| 2.6 | Data summary feels helpful, not overwhelming | ⬜ | |
| 2.7 | Color encoding section is distinct | ⬜ | |
| 2.8 | Navigation buttons (Back/Next) are clear | ⬜ | |
| 2.9 | Selected columns are visually confirmed | ⬜ | |
| 2.10 | Layout feels logical and uncluttered | ⬜ | |

### User Experience

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.11 | User understands what "axis mapping" means | ⬜ | |
| 2.12 | Numeric columns are auto-suggested (if applicable) | ⬜ | |
| 2.13 | Dropdowns feel responsive (no lag) | ⬜ | |
| 2.14 | User knows all 3 axes must be selected | ⬜ | |
| 2.15 | Already-selected columns are disabled in other dropdowns | ⬜ | |
| 2.16 | Color encoding is clearly optional | ⬜ | |
| 2.17 | Statistics help user make informed choices | ⬜ | |
| 2.18 | "View in 3D" button feels like exciting next step | ⬜ | |
| 2.19 | Back button preserves previous data | ⬜ | |
| 2.20 | Page doesn't feel tedious or confusing | ⬜ | |

### Error Messages

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.21 | Validation error explains what's missing | ⬜ | Example: "Please select all 3 axes before continuing." |
| 2.22 | Duplicate selection error is clear | ⬜ | Example: "You've already selected 'age' for X axis." |
| 2.23 | Too few numeric columns error suggests solution | ⬜ | Example: "Your data needs at least 3 numeric columns. Found: 2." |
| 2.24 | Error placement is logical (near problem area) | ⬜ | |
| 2.25 | Errors don't block view of selectors | ⬜ | |

### Accessibility

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.26 | Can select all dropdowns with keyboard | ⬜ | |
| 2.27 | Arrow keys navigate dropdown options | ⬜ | |
| 2.28 | Screen reader announces dropdown labels | ⬜ | |
| 2.29 | Validation errors are announced | ⬜ | |
| 2.30 | Focus doesn't get trapped in dropdowns | ⬜ | |

---

## 🌌 Section 3: Viewer Page (/viewer)

### Visual Design

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | 3D scene is visually impressive | ⬜ | |
| 3.2 | Background color feels appropriate | ⬜ | |
| 3.3 | Point colors are distinguishable | ⬜ | |
| 3.4 | Grid lines aid depth perception | ⬜ | |
| 3.5 | Axis labels (X/Y/Z) are readable | ⬜ | |
| 3.6 | Leva controls panel is well-organized | ⬜ | |
| 3.7 | Header information is unobtrusive | ⬜ | |
| 3.8 | Button placement feels natural | ⬜ | |
| 3.9 | Scene doesn't feel cluttered (clean UI) | ⬜ | |
| 3.10 | Color scheme enhances data visibility | ⬜ | |

### User Experience

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.11 | User immediately understands it's a 3D view | ⬜ | |
| 3.12 | Camera controls are intuitive | ⬜ | Rotate: Left drag, Zoom: Wheel, Pan: Right drag |
| 3.13 | Rotation feels smooth (no lag) | ⬜ | |
| 3.14 | Zoom speed feels comfortable | ⬜ | |
| 3.15 | Points render at acceptable framerate | ⬜ | No stuttering or freezing |
| 3.16 | Leva controls respond immediately | ⬜ | |
| 3.17 | Point size adjustment feels intuitive | ⬜ | |
| 3.18 | Grid/axis toggles work as expected | ⬜ | |
| 3.19 | User can reset camera if lost | ⬜ | |
| 3.20 | Data filename/row count is informative | ⬜ | |
| 3.21 | "Edit Mapping" button is easy to find | ⬜ | |
| 3.22 | Overall experience feels delightful | ⬜ | |

### Performance Feel

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.23 | Initial scene load feels fast (<3s) | ⬜ | |
| 3.24 | Camera rotation is buttery smooth | ⬜ | |
| 3.25 | No stuttering when adjusting point size | ⬜ | |
| 3.26 | Grid toggle is instantaneous | ⬜ | |
| 3.27 | Plane toggles don't cause flicker | ⬜ | |
| 3.28 | Browser doesn't feel sluggish | ⬜ | |
| 3.29 | No memory leak over 5+ minutes of use | ⬜ | Check Task Manager |
| 3.30 | Can handle dataset with 10K+ points | ⬜ | |

### Error Messages

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.31 | WebGL not supported error is helpful | ⬜ | Example: "Your browser doesn't support 3D graphics. Try Chrome or Firefox." |
| 3.32 | Empty dataset error suggests action | ⬜ | Example: "No data to display. Please upload a CSV file." |
| 3.33 | Render errors don't crash entire page | ⬜ | Should show fallback UI |

### Accessibility

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.34 | Keyboard shortcuts for common actions | ⬜ | Example: R to reset camera |
| 3.35 | Focus doesn't get trapped in canvas | ⬜ | |
| 3.36 | Leva controls are keyboard accessible | ⬜ | |
| 3.37 | Screen reader describes scene state | ⬜ | Example: "Displaying 52 data points in 3D space" |
| 3.38 | Alternative text view available (if needed) | ⬜ | For users who can't see 3D |

---

## 🎨 Section 4: Overall Design Consistency

### Cross-Page Consistency

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | Navigation flow feels natural | ⬜ | Upload → Mapping → Viewer |
| 4.2 | Page headers use consistent style | ⬜ | |
| 4.3 | Button styles are uniform | ⬜ | |
| 4.4 | Color palette is cohesive | ⬜ | |
| 4.5 | Typography is consistent | ⬜ | |
| 4.6 | Spacing/margins feel harmonious | ⬜ | |
| 4.7 | Transitions between pages are smooth | ⬜ | |
| 4.8 | Back button behavior is predictable | ⬜ | |
| 4.9 | Error message style is uniform | ⬜ | |
| 4.10 | Loading indicators match design | ⬜ | |

### Mobile Responsiveness

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.11 | Upload page works on tablet (iPad) | ⬜ | |
| 4.12 | Mapping page dropdowns usable on mobile | ⬜ | |
| 4.13 | 3D viewer touch controls work | ⬜ | Pinch zoom, swipe rotate |
| 4.14 | Leva controls accessible on small screens | ⬜ | |
| 4.15 | Text is readable without zooming | ⬜ | |
| 4.16 | Buttons are large enough to tap | ⬜ | Min 44x44px |
| 4.17 | Layout doesn't break on narrow screens | ⬜ | |
| 4.18 | CSV Tutorial modal fits on mobile | ⬜ | |

---

## 🚀 Section 5: Delight Factors

### "Wow" Moments

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | Sample data demo is impressive | ⬜ | |
| 5.2 | First 3D render feels magical | ⬜ | |
| 5.3 | Camera controls feel AAA-game quality | ⬜ | |
| 5.4 | Color encoding reveals patterns beautifully | ⬜ | |
| 5.5 | Real-time controls feel powerful | ⬜ | |
| 5.6 | Overall app feels polished | ⬜ | |

### Frustration Points

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.7 | No confusing jargon or tech terms | ⬜ | |
| 5.8 | No unexpected page refreshes | ⬜ | |
| 5.9 | No dead ends (always next action) | ⬜ | |
| 5.10 | No excessive clicking to achieve goals | ⬜ | |
| 5.11 | No performance hiccups | ⬜ | |
| 5.12 | No visual bugs (overlapping text, etc.) | ⬜ | |

---

## 🎨 Section 6: CSV Tutorial Modal

### Content Quality

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | Examples are clear and helpful | ⬜ | |
| 6.2 | "Correct format" example is easy to understand | ⬜ | |
| 6.3 | "Incorrect format" warnings are informative | ⬜ | |
| 6.4 | Sample data download button works | ⬜ | |
| 6.5 | Recommendations are actionable | ⬜ | |
| 6.6 | Tone is friendly and encouraging | ⬜ | |
| 6.7 | Modal is easy to close (X button, ESC key) | ⬜ | |
| 6.8 | Modal doesn't block critical info | ⬜ | |

---

## 📊 Section 7: Error Scenario Testing

### Common User Mistakes

| # | Scenario | Expected Behavior | Status | Notes |
|---|----------|-------------------|--------|-------|
| 7.1 | Upload .xlsx file | "Only .csv files supported" error | ⬜ | |
| 7.2 | Upload 100MB file | "File too large (100MB). Max 50MB" | ⬜ | |
| 7.3 | Upload empty CSV | "File is empty. Please check your data" | ⬜ | |
| 7.4 | Upload CSV with 2 numeric columns | "Need at least 3 numeric columns. Found: 2" | ⬜ | |
| 7.5 | Try to continue without selecting axes | "Please select all 3 axes" | ⬜ | |
| 7.6 | Select same column twice | Dropdown disables already-selected option | ⬜ | |
| 7.7 | Refresh page on mapping screen | Data preserved or friendly message | ⬜ | |
| 7.8 | Network error loading sample data | "Could not load sample. Try again" | ⬜ | |

---

## 🎯 Section 8: First-Time User Experience

### Onboarding Clarity

| # | Item | Status | Notes |
|---|------|--------|-------|
| 8.1 | New user knows what app does in 5 seconds | ⬜ | |
| 8.2 | Call-to-action is obvious | ⬜ | |
| 8.3 | Sample data option reduces friction | ⬜ | |
| 8.4 | CSV Tutorial helps unfamiliar users | ⬜ | |
| 8.5 | Progress indicators show where user is | ⬜ | Upload (1/3) → Mapping (2/3) → Viewer (3/3) |
| 8.6 | User completes workflow without help | ⬜ | |
| 8.7 | User feels accomplished after first viz | ⬜ | |

---

## ✅ Completion Summary

### Overall Scores

| Category | Pass | Needs Improvement | Fail | Total |
|----------|------|-------------------|------|-------|
| Visual Design | __ | __ | __ | 40 |
| User Experience | __ | __ | __ | 60 |
| Error Messages | __ | __ | __ | 18 |
| Accessibility | __ | __ | __ | 22 |
| Performance Feel | __ | __ | __ | 8 |
| Delight Factors | __ | __ | __ | 12 |
| **TOTAL** | __ | __ | __ | **160** |

### Pass Rate
- **Target**: 90%+ Pass (144/160)
- **Acceptable**: 80%+ Pass (128/160)
- **Needs Work**: <80% Pass

---

## 📝 Testing Notes

### Environment
- **Browser**: Chrome 120 / Firefox 121 / Safari 17
- **Device**: Desktop (1920x1080) / Tablet (iPad) / Mobile (iPhone)
- **Accessibility Tools**: NVDA, JAWS, Contrast Checker, axe DevTools

### Issues Found
_Document any issues discovered during testing:_

```
Issue #1:
- Location: Upload Page - File Drop Zone
- Description: Border color too faint, hard to see boundaries
- Severity: Minor
- Screenshot: [attach]

Issue #2:
- Location: Viewer Page - Leva Controls
- Description: Point Size slider lags on Chrome
- Severity: Medium
- Steps to Reproduce: Drag slider rapidly back and forth

...
```

---

## 🚀 Recommendations

### High Priority Fixes
1. [ ] _Fill in after testing_
2. [ ] _Fill in after testing_
3. [ ] _Fill in after testing_

### Medium Priority Improvements
1. [ ] _Fill in after testing_
2. [ ] _Fill in after testing_

### Low Priority Enhancements
1. [ ] _Fill in after testing_
2. [ ] _Fill in after testing_

---

**Checklist Completed By**: _________________  
**Date**: _________________  
**Test Session Duration**: _______ minutes  
**Overall Impression**: ☆☆☆☆☆ (1-5 stars)
