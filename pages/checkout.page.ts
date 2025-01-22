import { Locator, Page } from '@playwright/test';
import { CartPage } from './cart.page';

// Chechkout page is for completing checkout steps for logged in users which already have saved information about address and payment method
export class CheckOutPage {
    private miniCartPage: CartPage;

    constructor(private page: Page) {
        this.miniCartPage = new CartPage(page)
    }

    
    public checkOut = (): Locator => this.page.locator('button#top-cart-btn-checkout');
    public nextButton = (): Locator => this.page.locator('button[data-role="opc-continue"]');
    public placeOrder = (): Locator => this.page.locator('button[title="Place Order"]');

    async ProceedToCheckOut() {

        
        await this.miniCartPage.miniCart().click();
        await this.page.waitForLoadState("load")

        await this.checkOut().click();
        await this.nextButton().click();
        await this.placeOrder().click();

        await this.page.waitForLoadState("load")
    }
}