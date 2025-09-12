export class InventoryPage {
    constructor (page){
    this.page = page;
   
    this.pageName = page.locator('[data-test= "title"]')
    this.cartIcon = page.locator('[id= "shopping_cart_container"]')
    this.itemList = page.locator('[data-test= "inventory-item-name"]');
    this.typeSort = '.product_sort_container';
    this.firstItem = page.locator( '.inventory_item:first-child .btn_primary');
    
    this.addToCartBackpack = page.locator('[data-test= "add-to-cart-sauce-labs-backpack"]');
    this.addToCartBikeLight = page.locator('[data-test= "add-to-cart-sauce-labs-bike-light"]');
    this.addToCartBoltTShirt = page.locator('[data-test= "add-to-cart-sauce-labs-bolt-t-shirt"]');
    this.addToCartFleeseJacket = page.locator('[data-test= "add-to-cart-sauce-labs-fleece-jacket"]');
    this.addToCartOnesie = page.locator('[data-test= "add-to-cart-sauce-labs-onesie"]');
    this.addToCartTShirtRed = page.locator('[data-test= "add-to-cart-test.allthethings()-t-shirt-(red)"]');
     }
        async open () {
        await this.page.goto('https://www.saucedemo.com/');
        }
        async login(username, password) {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
            }

          async addItemToCart(itemName){
            if (itemName == "Sauce Labs Backpack") {
              await this.addToCartBackpack.click();
            } else if (itemName == "Sauce Labs Bike Light") {
              await this.addToCartBikeLight.click();
            } else if (itemName == "Sauce Labs Bolt T-Shirt") {
              await this.addToCartBoltTShirt.click()
            } else if (itemName == "Sauce Labs Fleece Jacket") {
              await this.addToCartFleeseJacket.click()
            }  else if (itemName == "Sauce Labs Onesie") {
              await this.addToCartFleeseJacket.click()
            }  else if (itemName == "Test.allTheThings() T-Shirt (Red)") {
              await this.addToCartTShirtRed.click()
            } 
          }
          async addFirstItem(){
            await this.firstItem.click();
          }
          async openCart() {
            await this.cartIcon.click();
          }
          async getPageTitle() {
            const title = await this.pageName.textContent();
            return title
          }  
          async selectOption(selector, options) {
              await this.page.selectOption(selector, options); 
          }
          async addMostExpensiveItemToCart() {
             await this.selectOption(this.typeSort, { value: 'hilo' });
             await this.page.waitForTimeout(500);
             await this.page.locator('.inventory_item:first-child .btn_primary').click();
         }
        
}