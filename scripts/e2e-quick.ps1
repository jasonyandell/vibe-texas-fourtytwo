# Quick E2E Workflow Launcher
# Simple script that shows the Augment trigger phrase

Write-Host ""
Write-Host "🚀 E2E WORKFLOW QUICK START" -ForegroundColor Cyan
Write-Host "="*50 -ForegroundColor Cyan
Write-Host ""
Write-Host "Open Augment Code and type:" -ForegroundColor White
Write-Host ""
Write-Host "    work e2e queue" -ForegroundColor Yellow -BackgroundColor DarkBlue
Write-Host ""
Write-Host "That's it! Augment will automatically:" -ForegroundColor Green
Write-Host "  ✓ Query GitHub Project #2 state" -ForegroundColor White
Write-Host "  ✓ Check for PRs to merge/fix/review" -ForegroundColor White  
Write-Host "  ✓ Work on next priority issue" -ForegroundColor White
Write-Host "  ✓ Execute exactly ONE task" -ForegroundColor White
Write-Host ""
Write-Host "After completion, run this script again!" -ForegroundColor Yellow
Write-Host ""

# Also copy the trigger phrase to clipboard for convenience
"work e2e queue" | Set-Clipboard
Write-Host "✓ Trigger phrase copied to clipboard!" -ForegroundColor Green

Write-Host ""
