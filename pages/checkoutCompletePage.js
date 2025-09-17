import { expect } from '@playwright/test';
export class CheckoutCompletePage{
    
    constructor (page){
        this.page = page;
        this.completeHeader = page.locator('[data-test= "complete-header"]');
        this.backHomeButton = page.locator('[data-test= "back-to-products"]');
        }
    async getCompletionMessage() {
       const message = await this.completeHeader.textContent();
       return message;
    }
}