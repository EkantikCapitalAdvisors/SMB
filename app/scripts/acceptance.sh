#!/usr/bin/env bash
# §6 — Enhancement Spec acceptance gates (grep-style). Run from app/.
# Exits non-zero on any failure. CI-suitable.
set -u
cd "$(dirname "$0")/.." || exit 2
fail=0
pass() { printf '  ok   %s\n' "$1"; }
bad()  { printf '  FAIL %s\n' "$1"; fail=1; }

# zero-match forbidden strings in src/
zero() { # <regex> <label>
  local n; n=$(grep -riE "$1" src/ | wc -l | tr -d ' ')
  [ "$n" = "0" ] && pass "$2 (0 matches)" || { bad "$2 ($n matches)"; grep -riE "$1" src/ | head; }
}
echo "Forbidden strings:"
zero "principal.?protect"            "§1.1 no 'principal-protect'"
zero "0% downside|downside capture"  "§1.2 no '0% downside / downside capture'"
zero "16\.1%|2\.6% alpha"            "§1.3 no CAGR / alpha figures"
zero "members typically"             "§1.4 no 'members typically'"
zero "placeholder"                   "§1.5 no 'placeholder'"
zero "holistic|journey|client-centric" "§5 no filler jargon"
zero "contact@ekantik\.com"          "§1.5 canonical email only"

echo "Structure:"
# 'guarantee' only in negation context
# A line mentioning "guarantee" is acceptable only if it also carries a negation
# (not / no / never / nothing / n't) or is the FAQ objection question itself.
gbad=$(grep -riE "guarantee" src/ | grep -viE "\bnot\b|\bno\b|\bnever\b|\bnothing\b|n't|guaranteed\?" | wc -l | tr -d ' ')
[ "$gbad" = "0" ] && pass "§6 'guarantee' appears only in negations" || { bad "§6 non-negated 'guarantee' ($gbad)"; grep -riE "guarantee" src/ | grep -viE "not guarantee|n't guarantee|no guarantee|never guarantee|nothing.*guarantee|guaranteed returns|guaranteed\?"; }

# DisclaimerBlock present in every calculator
missing=0
for f in src/calculators/*.tsx; do
  c=$(grep -c "DisclaimerBlock" "$f")
  [ "$c" -ge 1 ] || { bad "DisclaimerBlock missing in $f"; missing=1; }
done
[ "$missing" = "0" ] && pass "§6 DisclaimerBlock ≥1 per calculator"

# exactly one <h1> (className h1) in the app
h1=$(grep -rE '<h1' src/ | wc -l | tr -d ' ')
[ "$h1" = "1" ] && pass "§6 exactly one h1 ($h1)" || bad "§6 h1 count = $h1 (want 1)"

echo ""
[ "$fail" = "0" ] && echo "ACCEPTANCE: PASS ✅" || echo "ACCEPTANCE: FAIL ❌"
exit $fail
