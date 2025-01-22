import { Locator, Page , expect} from '@playwright/test';


// Cart Page helps for adding already searched item to Cart, adding different item which has options to choose, and also remove cart items covering case
// when there are more than 1 items in cart
export class CartPage {
    constructor(private page: Page) {}

    public getItem = (): Locator => this.page.locator('div[class="product-item-info"]').nth(0);
    public addToCart = (): Locator => this.page.locator('button[title="Add to Cart"]').nth(0);
    public diffProduct = (): Locator => this.page.locator('li');
    public miniCart = (): Locator => this.page.locator('div[class="minicart-wrapper"]');
    public removeButton = (): Locator => this.page.locator('a.delete');
    public okButton = (): Locator => this.page.getByRole('button', { name: 'OK' });
    public msgEmpty = (): Locator => this.page.locator('strong[class="subtitle empty"]');
    
    async addSearcheditem() {
        await this.page.waitForLoadState("load")
        await this.getItem().hover();
        await this.addToCart().click();
    };

    async addItemWithOptions(productName: string, size: string, color: string) {
        const product = this.diffProduct().filter({ hasText: productName });

        await product.getByLabel(size).click();
        await product.getByLabel(color).click();

        await this.addToCart().click();
        await this.page.waitForLoadState("load")
    }

    async deleteItem() {
        await this.miniCart().click();
        
        const totalItems = await this.removeButton().count();
        for (let i = 0; i < totalItems; i++) {
            await this.removeButton().nth(0).click();
            await this.okButton().click();
            await this.page.waitForLoadState("load")
        };
    }
}