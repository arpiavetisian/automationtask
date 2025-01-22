import { Locator, Page } from '@playwright/test';

// HomePage class ensures to main functionalities of searching product and counting search results separately.
export class HomePage {
    constructor(private page: Page) {}

    public searchField= (): Locator => this.page.locator('input#search');
    public searchButton = (): Locator => this.page.locator('button[title="Search"]');
    
    async searchForProduct(productName: string) {
        await this.searchField().fill(productName);
        await this.searchButton().click(); 
        await this.page.waitForLoadState("load")
    };

    async getSearchResQuantity(_locator: string): Promise<number> {
        const results = await this.page.locator(_locator).count();
        return results;
    }
}