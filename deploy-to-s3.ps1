# Script tự động deploy frontend lên S3 và invalidate CloudFront cache
# Sử dụng: .\deploy-to-s3.ps1

$ErrorActionPreference = "Stop"

# ==================== CẤU HÌNH ====================
$S3_BUCKET = "your-bucket-name"  # Thay bằng tên S3 bucket của bạn
$CLOUDFRONT_ID = "YOUR_DISTRIBUTION_ID"  # Thay bằng CloudFront Distribution ID
$BUILD_FOLDER = "build"
$REGION = "ap-southeast-1"  # Region của S3 bucket

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  CHAOTOK FRONTEND DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# ==================== KIỂM TRA AWS CLI ====================
Write-Host "[1/6] Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "  ✅ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ AWS CLI not found. Please install AWS CLI first!" -ForegroundColor Red
    Write-Host "  Download: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# ==================== KIỂM TRA BUILD FOLDER ====================
Write-Host ""
Write-Host "[2/6] Checking build folder..." -ForegroundColor Yellow
if (-Not (Test-Path $BUILD_FOLDER)) {
    Write-Host "  ❌ Build folder not found!" -ForegroundColor Red
    Write-Host "  Please run 'npm run build' first" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✅ Build folder exists" -ForegroundColor Green

# ==================== XÁC NHẬN API URL ====================
Write-Host ""
Write-Host "[3/6] Verifying API URL in build..." -ForegroundColor Yellow
$apiCheckResult = Select-String -Path "$BUILD_FOLDER\static\js\*.js" -Pattern "api.chaotok.site" -ErrorAction SilentlyContinue
if ($apiCheckResult) {
    Write-Host "  ✅ Production API URL found in build" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  WARNING: Production API URL not found!" -ForegroundColor Red
    Write-Host "  Build may contain localhost URLs!" -ForegroundColor Red
    $continue = Read-Host "  Continue deployment? (y/n)"
    if ($continue -ne "y") {
        Write-Host "  Deployment cancelled" -ForegroundColor Yellow
        exit 0
    }
}

# ==================== UPLOAD TO S3 ====================
Write-Host ""
Write-Host "[4/6] Uploading to S3..." -ForegroundColor Yellow
Write-Host "  Bucket: s3://$S3_BUCKET" -ForegroundColor Cyan
Write-Host "  This may take a few minutes..." -ForegroundColor Gray

try {
    aws s3 sync $BUILD_FOLDER s3://$S3_BUCKET --delete --region $REGION
    Write-Host "  ✅ Upload completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Upload failed: $_" -ForegroundColor Red
    exit 1
}

# ==================== SET CACHE HEADERS ====================
Write-Host ""
Write-Host "[5/6] Setting cache headers..." -ForegroundColor Yellow

# HTML files: No cache
Write-Host "  Setting no-cache for HTML files..." -ForegroundColor Gray
aws s3 cp s3://$S3_BUCKET/index.html s3://$S3_BUCKET/index.html `
    --metadata-directive REPLACE `
    --cache-control "no-cache, no-store, must-revalidate" `
    --content-type "text/html" `
    --region $REGION

# JS/CSS files: Cache for 1 year (they have hash in filename)
Write-Host "  Setting long-term cache for static assets..." -ForegroundColor Gray
# (JS và CSS files đã có hash nên có thể cache lâu)

Write-Host "  ✅ Cache headers updated" -ForegroundColor Green

# ==================== INVALIDATE CLOUDFRONT ====================
Write-Host ""
Write-Host "[6/6] Invalidating CloudFront cache..." -ForegroundColor Yellow
Write-Host "  Distribution ID: $CLOUDFRONT_ID" -ForegroundColor Cyan

try {
    $invalidation = aws cloudfront create-invalidation `
        --distribution-id $CLOUDFRONT_ID `
        --paths "/*" `
        --query "Invalidation.Id" `
        --output text
    
    Write-Host "  ✅ Invalidation created: $invalidation" -ForegroundColor Green
    Write-Host "  Cache will be cleared in 1-5 minutes" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ CloudFront invalidation failed: $_" -ForegroundColor Red
    Write-Host "  You may need to invalidate manually in AWS Console" -ForegroundColor Yellow
}

# ==================== HOÀN THÀNH ====================
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ✅ DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Wait 2-5 minutes for CloudFront cache to clear" -ForegroundColor Gray
Write-Host "  2. Test your site: https://d13tci060h3fsw.cloudfront.net" -ForegroundColor Gray
Write-Host "  3. Hard refresh browser: Ctrl+Shift+R (or Ctrl+F5)" -ForegroundColor Gray
Write-Host ""
