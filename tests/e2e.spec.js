import { test, expect } from '@playwright/test';
import {LoginPage} from './pages/login.page';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/cartPage';
import { CheckoutStepOnePage } from './pages/checkoutStepOnePage';
import { CheckoutStepTwoPage } from './pages/checkoutStepTwoPage';
import { CheckoutCompletePage } from './pages/checkoutCompletePage';

test('Успешный логин', async({page}) => {
   const loginPage = new LoginPage(page); 
   const inventoryPage = new InventoryPage(page);
   const cartPage = new CartPage(page);
   const checkoutStepOnePage = new CheckoutStepOnePage(page);
   const checkoutStepTwoPage = new CheckoutStepTwoPage (page);
   const checkoutCompletePage = new CheckoutCompletePage (page);
   await loginPage.open();
   await loginPage.login('standard_user', 'secret_sauce');
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
   const pageTitle = await inventoryPage.getPageTitle ();
   expect(pageTitle).toBe('Products');
   await inventoryPage.addMostExpensiveItemToCart();
   await inventoryPage.openCart();
   await expect(page).toHaveURL('https://www.saucedemo.com/cart.html')
   await cartPage.checkItemInCart("Sauce Labs Fleece Jacket");
   await cartPage.goToCheckout();
   await checkoutStepOnePage.fillUserInfo("Test", "User", "12345");
   await checkoutStepTwoPage.finishCheckout();
   const completionMessage = await checkoutCompletePage.getCompletionMessage();
   expect(completionMessage).toBe('Thank you for your order!'); 
   }   )
