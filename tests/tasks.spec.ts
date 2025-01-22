import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { CartPage } from '../pages/cart.page';
import { CheckOutPage } from '../pages/checkout.page';
import { verifyProductNavigation } from './utils/helper';

// First describe is for navigating to website and check the visibility of items for homepage.
// This step doesn't require logging in
test.describe('Test which can be done without logging in', async() => {
    test('User is able to navigate to homepage and view products without authentication', async({ page }) => {
        await page.goto(`/`);
        await expect(page).toHaveURL('https://magento.softwaretestingboard.com/');
        const exptitle = page.locator('span.base');
        await expect(exptitle).toHaveText('Home Page'); 
    
        const productList = page.locator('li[class = "product-item"]'); 
        const productCount = await productList.count();
        expect(productCount).toBeGreaterThan(0);

    });
});
    
// Below are test cases which need logged in user and always build the logic for searching specific item.
// "Backpack" is the given item to search, but the parameter can be passed dynamicly
test.describe('Tests which need logging in and search for specific product', async() => {

    let page: Page;
    let homePage: HomePage;
    let cartPage: CartPage;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        const magento = new LoginPage(page, 'https://magento.softwaretestingboard.com/');

        await magento.login();
        await page.waitForTimeout(2000);
  
    });

    test.beforeEach(async () =>{
        homePage = new HomePage(page);
        await page.waitForLoadState("load")
        await page.fill('input#search', ''); 
        await homePage.searchForProduct('backpack');
    })
    
    test('User is able to sign in successfully and welcome message is visible', async () => {
        await page.waitForLoadState("load")
        await expect(page.locator('span[class = "logged-in"]').nth(1)).toContainText('Welcome, Olivia Martin'!);

    });
    
    test('User can search on a specific product and results are visible', async() => {
        const productCount = await homePage.getSearchResQuantity('a[class="product-item-link"]');
        expect(productCount).toBeGreaterThan(0);
    });

    test('Verify all search result should contain the search term', async() => {
        const resList = page.locator('a[class="product-item-link"]'); 
        const productCount = await homePage.getSearchResQuantity('a[class="product-item-link"]');

        for (let i = 0; i < productCount; i++) {
            const element = resList.nth(i);
            const text= await element.textContent();
            expect(text?.trim()).toContain('Backpack');
        };
    });
    
    test('Can navigate to a product page and verify that the correct page is opened', async() => {
        await verifyProductNavigation(page, 'a.product-item-link', 'a.product-item-link', 'span[data-ui-id="page-title-wrapper"]');
    });


    test('User can add a product to Cart', async() => {
        cartPage = new CartPage(page);
        await cartPage.addSearcheditem();
        const getMsg = page.locator('div[data-ui-id="message-success"]');
        await expect(getMsg).toBeVisible();
    });

    
    
    test('Verify that the exact chosen product is added to the cart', async() => {
        cartPage = new CartPage(page);
        await cartPage.addSearcheditem();

        await page.locator('div[class="minicart-wrapper"]').click();
        await verifyProductNavigation(page, 'a.product-item-link','span:text("View and edit cart")', 'strong[class="product-item-name"]');
        
    })

    test('User can empty the cart and get the message that cart is empty', async() => {
        cartPage = new CartPage(page);
        await cartPage.addSearcheditem();
        await cartPage.deleteItem();

        await page.waitForLoadState("load")
        await expect(page.getByText('You have no items in your shopping cart')).toBeVisible();

    });


// The below written test cases are standing for another than searched product, product is chosen from homepage.
// The chosen product has options like size and color.
// The last test case ensures that order history shows full information, that's why after signing in proccess page redirects to "Order History"
test.describe('Tests that need to add another product and checkout', async() => {

    let page: Page;
    let cartPage: CartPage;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        const magento = new LoginPage(page, 'https://magento.softwaretestingboard.com/');

        await magento.login();
        const cartPage = new CartPage(page);
        await cartPage.addItemWithOptions('Radiant Tee', 'XS', 'Blue');
        await page.waitForLoadState("load")
    });

    test('Add another product and proceed to checkout', async() => {
        await page.locator('div[class="minicart-wrapper"]').click();
        await page.waitForSelector('button#top-cart-btn-checkout');
        await page.locator('button#top-cart-btn-checkout').click();
    
        await expect(page.locator("li#shipping")).toBeVisible();
    })

    test('Finish checkout and place order', async() => {
        const myItemCheckOut = new CheckOutPage(page);
        await page.waitForLoadState("load")
        await myItemCheckOut.ProceedToCheckOut();
        await expect(page.locator('span.base')).toContainText('Thank you for your purchase!')
    })

    test('Verify that the order is visible in orders history page with order number and price', async({ page }) => {
        await page.goto('https://magento.softwaretestingboard.com/sales/order/history/');
        await page.waitForTimeout(2000);

        const tdElements = page.locator('table td');
    
        const tdCount = await tdElements.count();

        for (let i = 0; i < tdCount; i++) {
            const textContent = await tdElements.nth(i).textContent();
            if (!textContent || textContent.trim() === '') {
                throw new Error(`Empty <td> found at index ${i}`);
        }};

        console.log('All order history details are filled.');
    });
})
    
});
