import { expect } from '@playwright/test';

export class CartPage {
    
    constructor (page){
    this.page = page;
    this.itemList = page.locator('.inventory_item_name');
    this.checkout = page.locator('[data-test = "checkout"]');
    this.continueShopping = page.locator('[data-test = "continue-shopping"]')
    }
   
    async goToCheckout(){
        await this.checkout.click();
    }

    async goToContinueShoppingt(){
        await this.continueShopping.click();
    }

    async getItemNameInCart(index = 0) {
        const itemName = await this.itemList.nth(index).textContent();
        return itemName;
    }

    async checkItemInCart(expectedItemName) {
        const actualItemName = await this.getItemNameInCart();
        expect(actualItemName).toBe(expectedItemName);
    }
}