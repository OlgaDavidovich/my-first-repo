export class CheckoutStepOnePage{

       constructor (page){
        this.page = page;
        
        this.firstNameInput = page.locator('[data-test= "firstName"]');
        this.lastNameInput = page.locator('[data-test= "lastName"]');
        this.postalCodeInput = page.locator('[data-test= "postalCode"]');
        this.continueButton = page.locator('[data-test= "continue"]');  
        this.cancelButton = page.locator('[data-test= "cancel"]'); 
    }
       async fillUserInfo(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode); 
        await this.continueButton.click();
    }
        async cancelShopping () {
            await this.cancelButton.click();
    }
}