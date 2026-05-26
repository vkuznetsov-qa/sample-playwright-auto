import path from 'path';
import { test, expect } from '@playwright/test';
import { BasePage } from './pages';
import { locators } from './locators';
import { testID } from './helpers';

let basePage: BasePage;
const parentCollectionName = `Parent ${testID()}`;
const childCollectionName = `Child ${testID()}`;
const grandchildCollectionName = `Grandchild ${testID()}`;
const assetCollectionName = `Asset Collection ${testID()}`;
const assetCollectionName2 = `Asset Collection 2 ${testID()}`;
const uploadFiles = ['testPhoto.jpg', 'testPhoto1.jpg', 'testPhoto2.jpg', 'testPhoto3.jpg'];

test.beforeEach(async ({ page }) => {
  basePage = new BasePage(page);
  await page.goto('https://pics.io');
  await basePage.login(process.env.CLIENT_LOGIN ?? '', process.env.CLIENT_PASSWORD ?? '');
});

test.afterAll(async ({ browser }) => {
  const page = await browser.newPage();
  const tempBasePage = new BasePage(page);
  await page.goto('https://pics.io');
  await tempBasePage.login(process.env.CLIENT_LOGIN ?? '', process.env.CLIENT_PASSWORD ?? '');

  const collectionNames = [
    parentCollectionName,
    childCollectionName,
    grandchildCollectionName,
    assetCollectionName,
    assetCollectionName2,
  ];

  for (const name of collectionNames) {
    await tempBasePage.deleteCollection(name);
  }

  await page.close();
});

test.describe('Collection workflows', () => {
  test('creates a three-level collection tree', async () => {
    await basePage.createCollection(parentCollectionName);
    await basePage.createCollection(childCollectionName, parentCollectionName);
    await basePage.createCollection(grandchildCollectionName, childCollectionName);

    await expect(basePage.collectionTitle(grandchildCollectionName)).toBeVisible();
  });

  test('moves uploaded assets between collections', async ({ page }) => {
    await basePage.createCollection(assetCollectionName);
    await basePage.createCollection(assetCollectionName2);

    await basePage.click(locators.collectionNameItem.replace('{collectionName}', assetCollectionName));
    await basePage.click(locators.toolbarActionUpload);

    const assetPaths = uploadFiles.map((fileName) => path.join(__dirname, 'fixtures', fileName));
    await basePage.uploadAssets(assetPaths);

    await basePage.moveAssetToCollection(1, assetCollectionName2);
    await page.reload();

    await basePage.selectCollection(assetCollectionName2);
    const movedAsset = page.locator(locators.catalogItem.replace('{index}', '1'));
    await expect(movedAsset).toBeVisible();
  });
});
