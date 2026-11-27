const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[];
for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]){
 const page=await browser.newPage({viewport,deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(viewport.width+': '+e.message));
 await page.goto('http://127.0.0.1:8765/the-bed-edit/',{waitUntil:'networkidle'});
 await page.locator('#conceptSwitch button').first().waitFor();
 assert.equal(await page.locator('#conceptSwitch button').count(),3);
 assert.equal(await page.locator('#productRows li').count(),9);
 assert.match(await page.locator('#selectedPrice').innerText(),/2,324/);
 assert.equal(await page.locator('html').evaluate(el=>el.scrollWidth<=innerWidth),true,'No horizontal overflow at '+viewport.width);
 await page.locator('#conceptSwitch button').nth(1).click();
 assert.equal(await page.locator('#selectedName').innerText(),'Soft & Textured');
 await page.locator('[data-season="winter"]').click();
 assert.match(await page.locator('#seasonHeading').innerText(),/Warmth/);
 await page.locator('[data-angle="detail"]').click();
 assert.equal(await page.locator('[data-angle="detail"]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-season="transitional"]').click();
 assert.equal(await page.locator('[data-angle="detail"]').getAttribute('aria-pressed'),'true','Angle retained after season change');
 assert.equal(await page.locator('[data-season="transitional"]').getAttribute('aria-pressed'),'true');
 await page.locator('#mainImage').evaluate(async img=>{if(!img.complete)await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true})});});
 assert.equal(await page.locator('#mainImage').evaluate(img=>img.naturalWidth>0),true,'Photo fallback loads');
 await page.locator('#explorerControls').scrollIntoViewIfNeeded();
 const sticky=await page.locator('#explorerControls').evaluate(el=>({top:el.getBoundingClientRect().top,position:getComputedStyle(el).position}));
 assert.equal(sticky.position,'sticky');
 await page.locator('#comparison .compareCard').nth(2).locator('button').click();
 assert.match(await page.locator('#favoriteStatement').innerText(),/Airy/);
 assert.equal(await page.locator('#productRows li').count(),8);

 // Verify all approved, committed photos actually load from the seasonal asset paths.
 const conceptIds=['crisp-classic','soft-textured','airy-luminous'];
 for(let c=0;c<3;c++){
   await page.locator('#conceptSwitch button').nth(c).click();
   for(const season of ['summer','winter']){
     await page.locator('[data-season="'+season+'"]').click();
     for(const angle of ['hero','side','detail']){
       await page.locator('[data-angle="'+angle+'"]').click();
       const expected=conceptIds[c]+'-'+season+'-'+angle+'.webp';
       await page.waitForFunction((name)=>{
         const img=document.getElementById('mainImage');
         return img && img.complete && img.naturalWidth>0 && img.currentSrc.includes(name);
       },expected,{timeout:10000});
       const actual=await page.locator('#mainImage').getAttribute('src');
       assert.ok(actual.includes(expected),'Expected real seasonal image '+expected+', got '+actual);
     }
   }
 }
 console.log('PASS all 18 approved seasonal images at '+viewport.width+'px');

 await page.screenshot({path:'qa-'+viewport.width+'.png',fullPage:true});
 console.log('PASS '+viewport.width+'px, sticky top='+sticky.top);
 await page.close();
}
assert.equal(errors.length,0,'Browser JS errors: '+errors.join(' | '));
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
