const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  try {
    for (const viewport of [{width:390,height:844},{width:768,height:1024},{width:1440,height:900}]) {
      const page = await browser.newPage({viewport,deviceScaleFactor:1});
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://127.0.0.1:8765/the-bed-edit/',{waitUntil:'networkidle'});
      await page.locator('#conceptSwitch button').first().waitFor({state:'visible'});
      assert.equal(await page.locator('#conceptSwitch button').count(),3);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1), 'Horizontal overflow at '+viewport.width);
      for (let c=0;c<3;c++) {
        await page.locator('#conceptSwitch button').nth(c).click();
        const expectedId=['crisp-classic','soft-textured','airy-luminous'][c];
        const info=await page.evaluate(i=>{
          const concept=window.BED_DATA.concepts[i];
          const total=concept.products.reduce((t,p)=>t+p.pricing.lo,0);
          return {name:concept.name,total,count:concept.products.length}
        },c);
        assert.equal((await page.locator('#selectedName').innerText()).trim(),info.name);
        assert.equal(await page.locator('#productRows tr').count(),info.count,'Shopping row count '+info.name);
        const displayed=(await page.locator('#selectedPrice').innerText()).trim();
        assert.ok(displayed.includes(info.total.toLocaleString('en-US',{maximumFractionDigits:0})), 'Price mismatch '+displayed+' '+info.total);
        for (const season of ['summer','winter']) {
          await page.locator('[data-season="'+season+'"]').click();
          assert.equal(await page.locator('[data-season="'+season+'"]').getAttribute('aria-pressed'),'true');
          for(const angle of ['hero','side','detail']) {
            await page.locator('[data-angle="'+angle+'"]').click();
            const expected=expectedId+'-'+season+'-'+angle+'.webp';
            await page.waitForFunction((filename)=>{
              const img=document.querySelector('#mainImage');
              return img && img.complete && img.naturalWidth>0 && img.currentSrc.includes(filename) && img.currentSrc.includes('pillow-fix-20261127');
            },expected,{timeout:12000});
            const src=await page.locator('#mainImage').getAttribute('src');
            assert.ok(src.includes(expected), 'Wrong image: '+src);
          }
        }
      }
      assert.equal(errors.length,0,'JavaScript errors: '+errors.join('; '));
      await page.screenshot({path:'qa-'+viewport.width+'.png',fullPage:true});
      console.log('PASS '+viewport.width+'px: 18/18 images loaded, all season/angle controls, all 3 product totals, no overflow or page errors');
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
