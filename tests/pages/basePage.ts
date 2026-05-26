import { Page, Locator, expect } from '@playwright/test';
import { locators } from '../locators';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: Locator | string) {
    if (typeof locator === 'string') {
      await this.page.click(locator);
    } else {
      await locator.click();
    }
  }

  async fill(selector: Locator | string, value: string) {
    if (typeof selector === 'string') {
      await this.page.fill(selector, value);
    } else {
      await selector.fill(value);
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('CLIENT_LOGIN and CLIENT_PASSWORD must be set in .env');
    }

    const acceptButton = this.page.getByRole('button', { name: 'Accept All' });
    if (await acceptButton.count()) {
      await acceptButton.click();
    }

    await this.click(locators.loginBtn);
    await this.fill(locators.emailInput, email);
    await this.fill(locators.passwordInput, password);
    await this.click(locators.submitBtn);

    const catalog = this.page.locator(locators.appCatalog);
    await catalog.waitFor();
    await expect(catalog).toBeVisible();
  }

  collectionTitle(collectionName: string) {
    return this.page.locator(locators.collectionName.replace('{collectionName}', collectionName));
  }

  collectionItem(collectionName: string) {
    return this.page.locator(locators.collectionNameItem.replace('{collectionName}', collectionName));
  }

  async createCollection(collectionName: string, parentCollectionName?: string) {
    if (parentCollectionName) {
      await this.collectionTitle(parentCollectionName).hover();
      await this.click(
        this.page
          .getByRole('treeitem', { name: parentCollectionName })
          .getByTestId(locators.createCollectionBtn)
      );
    } else {
      await this.click(this.page.getByTestId(locators.createCollectionBtn).first());
    }

    await this.fill(locators.collectionNameInput, collectionName);
    await this.click(locators.saveCollectionBtn);
    await expect(this.collectionTitle(collectionName)).toBeVisible();
  }

  async selectCollection(collectionName: string) {
    await this.click(this.collectionItem(collectionName));
    await this.page.locator(locators.spinner).waitFor({ state: 'detached' });
  }

  async uploadAssets(assetPaths: string[]) {
    await this.page.locator(locators.uploadFilesMenuItem).setInputFiles(assetPaths);
    await expect(this.page.locator(locators.totalAssetsCountText)).toHaveText(`${assetPaths.length} assets to upload`);
    await this.click(locators.importSubmitBtn);
    await this.page.locator(locators.tiles).waitFor();
  }

  async moveAssetToCollection(assetIndex: number, targetCollectionName: string) {
    const source = this.page.locator(locators.catalogItem.replace('{index}', String(assetIndex)));
    const target = this.page.getByRole('treeitem', { name: targetCollectionName }).locator('p');

    await source.dragTo(target);
    await this.click(locators.dialogConfirmBtn);
    await this.page.locator(locators.spinner).waitFor({ state: 'detached' });
  }

  async deleteCollection(collectionName: string) {
    const item = this.collectionItem(collectionName);
    if (await item.count()) {
      await item.hover();
      await this.page.getByTestId(locators.collectionMenu).first().click();
      await this.page.getByRole('menuitem', { name: 'Delete collection' }).click();
      await this.click(locators.dialogDeleteBtn);
      await this.page.locator(locators.spinner).waitFor({ state: 'attached' });
      await this.page.locator(locators.spinner).waitFor({ state: 'detached' });
    }
  }
}
