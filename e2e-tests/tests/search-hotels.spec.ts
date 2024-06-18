import { test, expect } from '@playwright/test';

const UI_URL="http://localhost:5173/"

test.beforeEach(async({page})=>{
    await page.goto(UI_URL);
  
    //get sign in button
    await page.getByRole("link",{name:"Sign in"}).click();

    await expect(page.getByRole("heading",{name: "Sign In"})).toBeVisible();

    await page.locator("[name=email]").fill("user10@hail.com");

    await page.locator("[name=password]").fill("password@123");

    await page.getByRole("button",{name:"Login"}).click();

    await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should show hotel search results",async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Delhi");
    await page.getByRole("button",{name:"Search"}).click();

    await expect(page.getByText("Hotels found in Delhi")).toBeVisible();
    await expect(page.getByText("Skyline Getaways")).toBeVisible();
});

test("should show hotel detail",async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Delhi");
    await page.getByRole("button",{name:"Search"}).click();

    await page.getByText("Skyline Getaways").click();
    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();

});