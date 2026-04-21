// import { test, expect } from '@playwright/test';

// var baseURL = 'http://localhost:8080';

// test('TEST-CONNECTION', async ({ page }) => {
//   await page.goto(baseURL);
// });
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    // testing buggy (1/2)
    // await page.goto('https://cs1632-buggier.appspot.com/');

    await page.evaluate(() => {
      document.cookie = "1=false";
      document.cookie = "2=false";
      document.cookie = "3=false";
    });
});

test('TEST-1-RESET', async ({ page }) => {
    // preconditions
    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });
    // execution steps
    await page.getByRole('link', { name: 'Reset' }).click();
    // postconditions
    await expect(page.locator('#cat-id1')).toHaveText('ID 1. Jennyanydots');
    await expect(page.locator('#cat-id2')).toHaveText('ID 2. Old Deuteronomy');
    await expect(page.locator('#cat-id3')).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Catalog' }).click();
    // postconditions
    // await expect(page.locator('img').nth(1)).toHaveAttribute('src', "/images/cat2.jpg");
    await expect(page.locator('ol li img').nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Catalog' }).click();
    // postconditions
    const items = page.locator('#listing').getByRole('listitem');
    await expect(items).toHaveCount(3);
    await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    // postconditions
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.locator('#rentID').fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();
    // postconditions
    const items = page.locator('#listing').getByRole('listitem');
    await expect(items.nth(0)).toHaveText('Rented out');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
    await expect(page.locator('#rentResult')).toHaveText('Success!');
});


test('TEST-6-RETURN', async ({ page }) => {
    // preconditions
    await page.evaluate(() => {
        document.cookie = "2=true";
        document.cookie = "3=true";
    });
    // execution steps
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.locator('#returnID').fill('2');
    await page.getByRole('button', { name: 'Return' }).click();
    // postconditions
    const items = page.locator('#listing').getByRole('listitem');
    await expect(items.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('Rented out');
    await expect(page.locator('#returnResult')).toHaveText('Success!');
});


test('TEST-7-FEED-A-CAT', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    // postconditions
    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});


test('TEST-8-FEED', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.locator('#catnips').fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();
    // postconditions
    await expect(page.locator('#feedResult')).toHaveText('Nom, nom, nom.', { timeout: 10000 });
});


test('TEST-9-GREET-A-CAT', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    // postconditions
    await expect(page.locator('#greeting')).toContainText('Meow!Meow!Meow!');
});


test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    // preconditions
    // execution steps
    await page.goto(page.url().replace(/\/$/, '') + '/greet-a-cat/Jennyanydots');
    // postconditions
    await expect(page.locator('#greeting')).toContainText('Meow! from Jennyanydots.');
});


test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    // preconditions
    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });
    // execution steps
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    // postconditions
    await expect(page.locator('body')).toHaveScreenshot();
});
// notes:
// find 3 defects and report them
// write new tests

// exploring the site notes: 

// entering 0 catnips to feed them results in 'nom nom nom'
// is this a defect? it's not a positve integer

// when you rent cat 1
// then visit greet a cat
// it displays meow x 3 but should only be 2
// it always shows 3 it seems

// you can rent with a decimal, idk if that's a defect



// entering 0 catnips should show "Cat fight!" per FUN-FEED
// since 0 is not a positive integer
test('DEFECT1-FUN-FEED', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.locator('#catnips').fill('0');
    await page.getByRole('button', { name: 'Feed' }).click();
    // postconditions
    await expect(page.locator('#feedResult')).toHaveText('Cat fight!', { timeout: 10000 });
});


// cat 1 being rented should result in only 2 meows on greet page
// per FUN-GREET-A-CAT, meows = number of available cats
test('DEFECT2-FUN-GREET-A-CAT', async ({ page }) => {
    // preconditions
    await page.evaluate(() => {
        document.cookie = "1=true";
    });
    // execution steps
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    await expect(page.locator('#greeting')).toHaveText('Meow!Meow!');
});


// feeding a negative number of catnips should show "Cat fight!" per FUN-FEED
// since negative numbers are not positive integers
test('DEFECT3-FUN-FEED', async ({ page }) => {
    // preconditions
    // execution steps
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.locator('#catnips').fill('-9');
    await page.getByRole('button', { name: 'Feed' }).click();
    // postconditions
    await expect(page.locator('#feedResult')).toHaveText('Cat fight!', { timeout: 10000 });
});
