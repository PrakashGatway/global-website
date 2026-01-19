/**
 * Quick API Test Script
 * 
 * Browser Console mein yeh code copy-paste karo aur run karo
 * Sabhi pages ko ek saath test karega
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Test function - Kisi bhi page ka data fetch karega
async function testPageAPI(slug) {
  console.log(`\n🧪 Testing API for page: ${slug}`)
  console.log(`📍 URL: ${API_BASE_URL}/page-information/public/${slug}`)
  
  try {
    const startTime = performance.now()
    const response = await fetch(`${API_BASE_URL}/page-information/public/${slug}`)
    const endTime = performance.now()
    const data = await response.json()
    
    if (data.success) {
      console.log(`✅ SUCCESS! (${Math.round(endTime - startTime)}ms)`)
      console.log(`   Title: ${data.data.title}`)
      console.log(`   Slug: ${data.data.slug}`)
      console.log(`   Status: ${data.data.status}`)
      console.log(`   Page Type: ${data.data.pageType}`)
      return { success: true, data: data.data }
    } else {
      console.log(`❌ FAILED:`, data.message)
      return { success: false, error: data.message }
    }
  } catch (error) {
    console.log(`❌ ERROR:`, error.message)
    return { success: false, error: error.message }
  }
}

// Test function - Image fetch karega
async function testImageAPI(slug, imageType) {
  console.log(`\n🖼️ Testing Image API: ${slug}/${imageType}`)
  console.log(`📍 URL: ${API_BASE_URL}/page-information/images/${slug}/${imageType}`)
  
  try {
    const response = await fetch(`${API_BASE_URL}/page-information/images/${slug}/${imageType}`)
    const data = await response.json()
    
    if (data.success && data.data?.imageUrl) {
      console.log(`✅ SUCCESS! Image URL:`, data.data.imageUrl.substring(0, 50) + '...')
      return { success: true, imageUrl: data.data.imageUrl }
    } else {
      console.log(`⚠️ Image not found (using fallback)`)
      return { success: false, message: 'Image not found' }
    }
  } catch (error) {
    console.log(`❌ ERROR:`, error.message)
    return { success: false, error: error.message }
  }
}

// Test all pages at once
async function testAllPages() {
  console.log('🚀 Starting Universal API Test...')
  console.log('='.repeat(50))
  
  const pages = ['home', 'about', 'contact']
  const results = []
  
  for (const page of pages) {
    const result = await testPageAPI(page)
    results.push({ page, ...result })
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 Test Summary:')
  console.log('='.repeat(50))
  
  results.forEach(({ page, success, error }) => {
    const status = success ? '✅' : '❌'
    console.log(`${status} ${page}: ${success ? 'PASSED' : `FAILED - ${error}`}`)
  })
  
  const allPassed = results.every(r => r.success)
  console.log('\n' + '='.repeat(50))
  if (allPassed) {
    console.log('🎉 All tests PASSED! Universal API is working correctly!')
    console.log('✅ Same API endpoint used for all pages')
    console.log('✅ Only slug changed, everything else same')
  } else {
    console.log('⚠️ Some tests FAILED. Check the errors above.')
  }
  
  return results
}

// Test images
async function testAllImages() {
  console.log('\n🖼️ Testing Images...')
  console.log('='.repeat(50))
  
  const tests = [
    { slug: 'home', imageType: 'heroImage' },
    { slug: 'home', imageType: 'universitySliderBg' },
    { slug: 'about', imageType: 'heroImage' },
  ]
  
  for (const test of tests) {
    await testImageAPI(test.slug, test.imageType)
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}

// Run all tests
async function runAllTests() {
  await testAllPages()
  await testAllImages()
  
  console.log('\n💡 Tip: Network tab mein check karo - sabhi calls same endpoint use kar rahe hain!')
}

// Export for use
if (typeof window !== 'undefined') {
  window.testPageAPI = testPageAPI
  window.testImageAPI = testImageAPI
  window.testAllPages = testAllPages
  window.testAllImages = testAllImages
  window.runAllTests = runAllTests
  
  console.log('✅ Test functions loaded!')
  console.log('📝 Available functions:')
  console.log('   - testPageAPI(slug)')
  console.log('   - testImageAPI(slug, imageType)')
  console.log('   - testAllPages()')
  console.log('   - testAllImages()')
  console.log('   - runAllTests()')
  console.log('\n🚀 Quick start: runAllTests()')
}
