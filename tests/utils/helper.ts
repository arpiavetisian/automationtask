import { expect, Page } from '@playwright/test';

//
 // Navigates to a product page and verifies that the correct page is opened.
 // @param page - The Playwright Page object.
 // @param productLinkLocator - CSS selector for the product link.
 // @param pageTitleLocator - CSS selector for the product page title.
//

export async function verifyProductNavigation(
    page: Page,
    productLinkLocator: string,
    comparelink: string,
    pageTitleLocator: string,
    
): Promise<void> {
    const productLink = page.locator(productLinkLocator).nth(0);
    const productText = await productLink.textContent();

    if (!productText) {
        throw new Error('Product header is missing');
    }

    await page.locator(comparelink).nth(0).click();

    const pageTitle = page.locator(pageTitleLocator).last();

    const pageTitleText = await pageTitle.textContent();

    if (!pageTitleText) {
        throw new Error('Product page title is missing');
    }

    expect(productText.trim().toLowerCase()).toEqual(pageTitleText.trim().toLowerCase());
}