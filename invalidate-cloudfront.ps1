# Script nhanh để invalidate CloudFront cache
# Sử dụng sau khi đã upload files lên S3 thủ công

$CLOUDFRONT_ID = "YOUR_DISTRIBUTION_ID"  # Thay bằng CloudFront Distribution ID

Write-Host "🔄 Invalidating CloudFront cache..." -ForegroundColor Yellow
Write-Host "   Distribution ID: $CLOUDFRONT_ID" -ForegroundColor Cyan

try {
    $invalidation = aws cloudfront create-invalidation `
        --distribution-id $CLOUDFRONT_ID `
        --paths "/*" `
        --query "Invalidation.Id" `
        --output text
    
    Write-Host "✅ Invalidation created: $invalidation" -ForegroundColor Green
    Write-Host "⏳ Wait 2-5 minutes for cache to clear" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Check status:" -ForegroundColor Yellow
    Write-Host "   aws cloudfront get-invalidation --distribution-id $CLOUDFRONT_ID --id $invalidation" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    exit 1
}
